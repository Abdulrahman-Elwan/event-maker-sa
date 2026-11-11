
import { cacheLife, cacheTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";

import type {
    BlogCategory,
    LocalizedText,
} from "@/types/blog";

export const BLOG_CATEGORIES_TAG = "blog-categories";

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

async function getCachedBlogCategories(): Promise<BlogCategory[]> {
    "use cache";

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    });

    cacheTag(BLOG_CATEGORIES_TAG);

    const snapshot = await adminDb
        .collection("blog_categories")
        .where("is_active", "==", true)
        .get();

    return snapshot.docs
        .map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,
                name: normalizeLocalizedText(data.title),
                slug:
                    typeof data.slug === "string"
                        ? data.slug
                        : "",
            };
        })
        .filter((category) => category.slug);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
    return getCachedBlogCategories();
}
