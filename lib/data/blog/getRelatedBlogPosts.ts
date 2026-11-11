// lib\data\blog\getRelatedBlogPosts.ts
import { cacheLife, cacheTag } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";

import type {
    BlogCategory,
    BlogPost,
    LocalizedText,
} from "@/types/blog";

export const BLOG_RELATED_POSTS_TAG = "blog-related-posts";
const RELATED_POSTS_CANDIDATE_LIMIT = 30;

function normalizeLocalizedText(
    value: unknown
): LocalizedText {
    if (!value || typeof value !== "object") {
        return {
            ar: "",
            en: "",
        };
    }

    const data = value as Record<string, unknown>;

    return {
        ar: typeof data.ar === "string" ? data.ar : "",
        en: typeof data.en === "string" ? data.en : "",
    };
}

function normalizeDate(
    value: unknown
): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof value.toDate === "function"
    ) {
        return value.toDate();
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? null
            : date;
    }

    return null;
}

function normalizeCategory(
    id: string,
    value: FirebaseFirestore.DocumentData
): BlogCategory {
    return {
        id,

        name: normalizeLocalizedText(
            value.name ?? value.title
        ),

        slug:
            typeof value.slug === "string"
                ? value.slug
                : "",
    };
}

function getCategoryIds(
    data: FirebaseFirestore.DocumentData
): string[] {
    if (!Array.isArray(data.categories)) {
        return [];
    }

    return [
        ...new Set(
            data.categories.filter(
                (categoryId): categoryId is string =>
                    typeof categoryId === "string"
            )
        ),
    ];
}

function normalizeBlogPost(
    id: string,
    data: FirebaseFirestore.DocumentData,
    categoriesMap: Map<string, BlogCategory>
): BlogPost {
    const categoryIds = getCategoryIds(data);

    const categories = categoryIds
        .map((categoryId) =>
            categoriesMap.get(categoryId)
        )
        .filter(
            (category): category is BlogCategory =>
                Boolean(category)
        );

    const coverImage =
        data.coverImage &&
            typeof data.coverImage === "object"
            ? data.coverImage
            : {};

    const seo =
        data.seo &&
            typeof data.seo === "object"
            ? data.seo
            : {};

    return {
        id,

        title: normalizeLocalizedText(data.title),

        content: normalizeLocalizedText(data.content),

        coverImage: {
            url:
                typeof coverImage.url === "string"
                    ? coverImage.url
                    : "",

            publicId:
                typeof coverImage.public_id === "string"
                    ? coverImage.public_id
                    : "",

            alt: normalizeLocalizedText(
                coverImage.alt
            ),
        },

        categories,

        seo: {
            metaTitle: normalizeLocalizedText(
                seo.metaTitle
            ),

            metaDescription: normalizeLocalizedText(
                seo.metaDescription
            ),

            slug:
                typeof seo.slug === "string"
                    ? seo.slug
                    : "",
        },

        status:
            typeof data.status === "string"
                ? data.status
                : "",

        createdAt: normalizeDate(data.created_at),

        updatedAt: normalizeDate(data.updated_at),
    };
}

function chunkArray<T>(
    items: T[],
    size: number
): T[][] {
    const chunks: T[][] = [];

    for (
        let index = 0;
        index < items.length;
        index += size
    ) {
        chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

/* Cached data layer. */
async function getCachedRelatedBlogPosts(
    categoryIds: string[]
): Promise<BlogPost[]> {
    "use cache";

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    });

    cacheTag(BLOG_RELATED_POSTS_TAG);

    if (categoryIds.length === 0) {
        return [];
    }

    const categoryChunks = chunkArray(
        categoryIds,
        30
    );

    // Fetch only the latest 30 matching posts per query.
    const snapshots = await Promise.all(
        categoryChunks.map((chunk) =>
            adminDb
                .collection("blog_posts")
                .where("status", "==", "published")
                .where(
                    "categories",
                    "array-contains-any",
                    chunk
                )
                .orderBy("created_at", "desc")
                .limit(RELATED_POSTS_CANDIDATE_LIMIT)
                .get()
        )
    );

    // Deduplicate documents returned by multiple queries.
    const documentsMap = new Map<
        string,
        FirebaseFirestore.QueryDocumentSnapshot
    >();

    for (const snapshot of snapshots) {
        for (const doc of snapshot.docs) {
            documentsMap.set(doc.id, doc);
        }
    }

    if (documentsMap.size === 0) {
        return [];
    }

    const currentCategoryIds = new Set(categoryIds);

    // Rank candidates by shared categories, then creation date.
    const candidates = Array.from(
        documentsMap.values()
    )
        .map((doc) => {
            const data = doc.data();

            const relatedCategoryIds =
                getCategoryIds(data);

            const sharedCategories =
                relatedCategoryIds.filter(
                    (categoryId) =>
                        currentCategoryIds.has(categoryId)
                ).length;

            return {
                doc,
                data,
                sharedCategories,
                createdAt: normalizeDate(data.created_at),
            };
        })
        .filter(
            (candidate) =>
                candidate.sharedCategories > 0
        )
        .sort((a, b) => {
            if (
                a.sharedCategories !==
                b.sharedCategories
            ) {
                return (
                    b.sharedCategories -
                    a.sharedCategories
                );
            }

            return (
                (b.createdAt?.getTime() ?? 0) -
                (a.createdAt?.getTime() ?? 0)
            );
        })
        .slice(0, RELATED_POSTS_CANDIDATE_LIMIT);

    if (candidates.length === 0) {
        return [];
    }

    // Collect only category IDs needed by selected candidates.
    const relatedCategoryIds = [
        ...new Set(
            candidates.flatMap((candidate) =>
                getCategoryIds(candidate.data)
            )
        ),
    ];

    const categoriesMap = new Map<
        string,
        BlogCategory
    >();

    if (relatedCategoryIds.length > 0) {
        const categoryRefs = relatedCategoryIds.map(
            (categoryId) =>
                adminDb
                    .collection("blog_categories")
                    .doc(categoryId)
        );

        const categorySnapshots = await adminDb.getAll(
            ...categoryRefs
        );

        for (const categorySnapshot of categorySnapshots) {
            if (!categorySnapshot.exists) {
                continue;
            }

            categoriesMap.set(
                categorySnapshot.id,
                normalizeCategory(
                    categorySnapshot.id,
                    categorySnapshot.data() ?? {}
                )
            );
        }
    }

    return candidates.map((candidate) =>
        normalizeBlogPost(
            candidate.doc.id,
            candidate.data,
            categoriesMap
        )
    );
}

export async function getRelatedBlogPosts(
    post: BlogPost,
    limit = 3
): Promise<BlogPost[]> {
    const safeLimit = Number.isFinite(limit)
        ? Math.max(0, Math.floor(limit))
        : 3;

    if (
        !post.id ||
        safeLimit === 0 ||
        !post.categories ||
        post.categories.length === 0
    ) {
        return [];
    }

    const categoryIds = [
        ...new Set(
            post.categories
                .map((category) => category.id)
                .filter(
                    (categoryId) =>
                        typeof categoryId === "string" &&
                        categoryId.length > 0
                )
        ),
    ].sort();

    if (categoryIds.length === 0) {
        return [];
    }

    const relatedPosts =
        await getCachedRelatedBlogPosts(categoryIds);

    // Exclude the current article after retrieving cached candidates.
    return relatedPosts
        .filter(
            (relatedPost) =>
                relatedPost.id !== post.id
        )
        .slice(0, safeLimit);
}