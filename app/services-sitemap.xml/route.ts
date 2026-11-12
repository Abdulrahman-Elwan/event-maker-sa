
import { adminDb } from "@/lib/firebase/admin";
import {
    buildUrlSet,
    getLocalizedAvailability,
    sitemapResponse,
    type SitemapEntry,
} from "@/lib/seo/sitemap";

export async function GET(): Promise<Response> {
    const snapshot = await adminDb
        .collection("site_content")
        .doc("services")
        .get();

    if (!snapshot.exists) {
        return sitemapResponse(buildUrlSet([]));
    }

    const data = snapshot.data();

    const services = Array.isArray(data?.services)
        ? data.services
        : [];

    const entries: SitemapEntry[] = services.flatMap(
        (service: Record<string, unknown>): SitemapEntry[] => {
            const slug =
                typeof service.slug === "string"
                    ? service.slug.trim()
                    : "";

            if (!slug) {
                return [];
            }

            const languages = getLocalizedAvailability(
                service.title,
            );

            return [
                {
                    arPath: `/services/${encodeURIComponent(slug)}/`,
                    enPath: `/en/services/${encodeURIComponent(slug)}/`,
                    hasArabic: languages.ar,
                    hasEnglish: languages.en,
                    lastModified:
                        service.updated_at ??
                        service.updatedAt ??
                        data?.updated_at,
                },
            ];
        },
    );

    return sitemapResponse(buildUrlSet(entries));
}
