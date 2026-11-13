// app\exhibitions-sitemap.xml\route.ts
import { adminDb } from "@/lib/firebase/admin";
import {
    buildUrlSet,
    getLocalizedAvailability,
    sitemapResponse,
    type SitemapEntry,
} from "@/lib/seo/sitemap";

export async function GET(): Promise<Response> {
    const snapshot = await adminDb
        .collection("exhibitions")
        .get();

    const entries: SitemapEntry[] = snapshot.docs.flatMap(
        (doc): SitemapEntry[] => {
            const data = doc.data();

            // استبعاد المعارض غير النشطة.
            if (data.is_active === false) {
                return [];
            }

            const slug =
                typeof data.slug === "string" &&
                data.slug.trim()
                    ? data.slug.trim()
                    : doc.id;

            if (!slug) {
                return [];
            }

            const languages = getLocalizedAvailability(
                data.title,
            );

            return [
                {
                    arPath: `/exhibitions/${encodeURIComponent(slug)}/`,
                    enPath: `/en/exhibitions/${encodeURIComponent(slug)}/`,
                    hasArabic: languages.ar,
                    hasEnglish: languages.en,
                    lastModified:
                        data.updated_at ?? data.updatedAt,
                },
            ];
        },
    );

    return sitemapResponse(buildUrlSet(entries));
}
