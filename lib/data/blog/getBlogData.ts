// lib/data/blog/getBlogData.ts
import { adminDb } from "@/lib/firebase/admin";

import type {
    BlogData,
    BlogHero,
    BlogSeo,
    LocalizedText,
} from "@/types/blog";

function normalizeLocalizedText(
    value: unknown
): LocalizedText {
    const data =
        value &&
        typeof value === "object"
            ? (value as Record<string, unknown>)
            : {};

    return {
        ar:
            typeof data.ar === "string"
                ? data.ar
                : "",

        en:
            typeof data.en === "string"
                ? data.en
                : "",
    };
}

function normalizeImage(value: unknown) {
    const data =
        value &&
        typeof value === "object"
            ? (value as Record<string, unknown>)
            : {};

    return {
        url:
            typeof data.url === "string"
                ? data.url
                : "",

        publicId:
            typeof data.public_id === "string"
                ? data.public_id
                : typeof data.publicId === "string"
                    ? data.publicId
                    : "",

        alt: normalizeLocalizedText(data.alt),
    };
}

export async function getBlogData(): Promise<BlogData> {
    "use cache"
    const snapshot = await adminDb
        .collection("site_content")
        .doc("blog")
        .get();

    if (!snapshot.exists) {
        return {
            hero: {
                title: {
                    ar: "",
                    en: "",
                },

                description: {
                    ar: "",
                    en: "",
                },

                image: {
                    url: "",
                    publicId: "",
                    alt: {
                        ar: "",
                        en: "",
                    },
                },
            },

            seo: {
                title: {
                    ar: "",
                    en: "",
                },

                description: {
                    ar: "",
                    en: "",
                },

                keywords: {
                    ar: "",
                    en: "",
                },
            },
        };
    }

    const data = snapshot.data() ?? {};

    const heroData =
        data.hero &&
        typeof data.hero === "object"
            ? (data.hero as Record<string, unknown>)
            : {};

    const seoData =
        data.seo &&
        typeof data.seo === "object"
            ? (data.seo as Record<string, unknown>)
            : {};

    const hero: BlogHero = {
        title: normalizeLocalizedText(
            heroData.title
        ),

        description: normalizeLocalizedText(
            heroData.description
        ),

        image: normalizeImage(heroData.image),
    };

    const seo: BlogSeo = {
        title: normalizeLocalizedText(
            seoData.title
        ),

        description: normalizeLocalizedText(
            seoData.description
        ),

        keywords: normalizeLocalizedText(
            seoData.keywords
        ),
    };

    return {
        hero,
        seo,
    };
}