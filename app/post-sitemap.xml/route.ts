// app\post-sitemap.xml\route.ts
import { adminDb } from "@/lib/firebase/admin";
import {
    buildUrlSet,
    getLocalizedAvailability,
    sitemapResponse,
    type SitemapEntry,
} from "@/lib/seo/sitemap";

export async function GET(): Promise<Response> {
    const snapshot = await adminDb
        .collection("blog_posts")
        .where("status", "==", "published")
        .get();

    const entries: SitemapEntry[] = snapshot.docs.flatMap(
        (doc): SitemapEntry[] => {
            const data = doc.data();

            const slug =
                typeof data.seo?.slug === "string"
                    ? data.seo.slug.trim()
                    : "";

            if (!slug) {
                return [];
            }

            const languages = getLocalizedAvailability(
                data.title,
            );

            return [{
                arPath: `/${encodeURIComponent(slug)}/`,
                enPath: `/en/${encodeURIComponent(slug)}/`,
                hasArabic: languages.ar,
                hasEnglish: languages.en,
                lastModified: data.updated_at ?? data.updatedAt,
            }];
        },
    );

    entries.sort((a, b) => {
        const dateA = new Date(
            String(a.lastModified ?? 0),
        ).getTime();

        const dateB = new Date(
            String(b.lastModified ?? 0),
        ).getTime();

        return dateB - dateA;
    });

    return sitemapResponse(buildUrlSet(entries));
}
