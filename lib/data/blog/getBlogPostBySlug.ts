// lib\data\blog\getBlogPostBySlug.ts
import { adminDb } from "@/lib/firebase/admin";

import type {
    BlogCategory,
    BlogPost,
    LocalizedText,
} from "@/types/blog";

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

function normalizeBlogPost(
    id: string,
    data: FirebaseFirestore.DocumentData,
    categoriesMap: Map<string, BlogCategory>
): BlogPost {
    const categoryIds = Array.isArray(data.categories)
        ? data.categories.filter(
              (categoryId): categoryId is string =>
                  typeof categoryId === "string"
          )
        : [];

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

export async function getBlogPostBySlug(
    slug: string
): Promise<BlogPost | null> {
    "use cache"

    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
        return null;
    }

    const snapshot = await adminDb
        .collection("blog_posts")
        .where("seo.slug", "==", normalizedSlug)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.status !== "published") {
        return null;
    }

    const categoryIds = Array.isArray(data.categories)
        ? data.categories.filter(
              (categoryId): categoryId is string =>
                  typeof categoryId === "string"
          )
        : [];

    const categorySnapshots = await Promise.all(
        categoryIds.map((categoryId) =>
            adminDb
                .collection("blog_categories")
                .doc(categoryId)
                .get()
        )
    );

    const categoriesMap =
        new Map<string, BlogCategory>();

    categorySnapshots.forEach((categorySnapshot) => {
        if (!categorySnapshot.exists) {
            return;
        }

        categoriesMap.set(
            categorySnapshot.id,
            normalizeCategory(
                categorySnapshot.id,
                categorySnapshot.data() ?? {}
            )
        );
    });

    return normalizeBlogPost(
        doc.id,
        data,
        categoriesMap
    );
}
