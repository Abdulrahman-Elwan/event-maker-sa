// lib\data\blog\getBlogPosts.ts
import { cacheLife, cacheTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";

import { getBlogCategories } from "@/lib/data/blog/getBlogCategories";

import type {
    BlogCategory,
    BlogPost,
    BlogPostsResult,
    LocalizedText,
} from "@/types/blog";

const POSTS_PER_PAGE = 9;

const BLOG_POSTS_TAG = "blog-posts";

function normalizeLocalizedText(
    value: unknown
): LocalizedText {
    const data =
        value && typeof value === "object"
            ? (value as Record<string, unknown>)
            : {};

    return {
        ar: typeof data.ar === "string" ? data.ar : "",
        en: typeof data.en === "string" ? data.en : "",
    };
}

function normalizeDate(value: unknown): Date | null {
    if (!value) return null;

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
    category: BlogCategory
): BlogCategory {
    return {
        id: category.id,
        name: normalizeLocalizedText(category.name),
        slug: category.slug,
    };
}

function normalizePost(
    id: string,
    data: FirebaseFirestore.DocumentData,
    categoriesMap: Map<string, BlogCategory>
): BlogPost {
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

    const categoryIds = Array.isArray(data.categories)
        ? data.categories.filter(
            (item): item is string =>
                typeof item === "string"
        )
        : [];

    const categories = categoryIds
        .map((categoryId) => categoriesMap.get(categoryId))
        .filter(
            (category): category is BlogCategory =>
                Boolean(category)
        );

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
                    : typeof coverImage.publicId === "string"
                        ? coverImage.publicId
                        : "",

            alt: normalizeLocalizedText(coverImage.alt),
        },

        categories,

        seo: {
            metaTitle: normalizeLocalizedText(seo.metaTitle),
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

/**
 * Builds the base Firestore query.
 */
function buildPostsQuery(categoryId: string | null) {
    let query = adminDb
        .collection("blog_posts")
        .where("status", "==", "published");

    if (categoryId) {
        query = query.where(
            "categories",
            "array-contains",
            categoryId
        );
    }

    return query;
}

/**
 * Cached total count.
 * Independent from sorting and pagination.
 */
async function getCachedBlogPostsCount(
    categoryId: string | null
): Promise<number> {
    "use cache";

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    });

    const categoryKey = categoryId ?? "all";

    cacheTag(
        BLOG_POSTS_TAG,
        `blog-post-count-${categoryKey}`
    );

    const startedAt = performance.now();

    const snapshot = await buildPostsQuery(categoryId)
        .count()
        .get();

    console.log("[BLOG COUNT QUERY]", {
        category: categoryId ?? "all",
        duration: `${(
            performance.now() - startedAt
        ).toFixed(2)} ms`,
    });

    return snapshot.data().count;
}

/**
 * Cached posts page.
 * Cache key depends on category, sorting and page.
 */
async function getCachedBlogPostsPage(
    categoryId: string | null,
    sort: "latest" | "oldest",
    page: number,
    categories: BlogCategory[]
): Promise<BlogPost[]> {
    "use cache";

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    });

    const categoryKey = categoryId ?? "all";

    cacheTag(
        BLOG_POSTS_TAG,
        `blog-posts-category-${categoryKey}`
    );

    const sortDirection =
        sort === "oldest" ? "asc" : "desc";

    const startedAt = performance.now();

    const snapshot = await buildPostsQuery(categoryId)
        .orderBy("created_at", sortDirection)
        .offset((page - 1) * POSTS_PER_PAGE)
        .limit(POSTS_PER_PAGE)
        .get();

    console.log("[BLOG POSTS QUERY]", {
        category: categoryId ?? "all",
        sort,
        page,
        duration: `${(
            performance.now() - startedAt
        ).toFixed(2)} ms`,
    });

    const categoriesMap = new Map<string, BlogCategory>();

    for (const category of categories) {
        categoriesMap.set(
            category.id,
            normalizeCategory(category)
        );
    }

    return snapshot.docs.map((doc) =>
        normalizePost(
            doc.id,
            doc.data(),
            categoriesMap
        )
    );
}

/**
 * Public blog posts function.
 */
export async function getBlogPosts({
    category,
    sort = "latest",
    page = 1,
}: {
    category?: string;
    sort?: "latest" | "oldest";
    page?: number;
} = {}): Promise<BlogPostsResult> {
    const requestedPage = Number.isFinite(page)
        ? Math.max(1, Math.floor(page))
        : 1;

    const categories = await getBlogCategories();

    const normalizedCategory = category?.trim();

    const selectedCategory = normalizedCategory
        ? categories.find(
            (item) => item.slug === normalizedCategory
        )
        : undefined;

    if (normalizedCategory && !selectedCategory) {
        return {
            posts: [],
            totalPosts: 0,
            totalPages: 1,
            currentPage: 1,
        };
    }

    const categoryId = selectedCategory?.id ?? null;

    // Run count and posts queries simultaneously.
    const [totalPosts, requestedPosts] = await Promise.all([
        getCachedBlogPostsCount(categoryId),

        getCachedBlogPostsPage(
            categoryId,
            sort,
            requestedPage,
            categories
        ),
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(totalPosts / POSTS_PER_PAGE)
    );

    const safePage = Math.min(
        requestedPage,
        totalPages
    );

    // Fetch the last valid page if the requested page is out of range.
    const posts =
        safePage === requestedPage
            ? requestedPosts
            : await getCachedBlogPostsPage(
                categoryId,
                sort,
                safePage,
                categories
            );

    return {
        posts,
        totalPosts,
        totalPages,
        currentPage: safePage,
    };
}
