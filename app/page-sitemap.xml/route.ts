import {
    buildUrlSet,
    sitemapResponse,
    type SitemapEntry,
} from "@/lib/seo/sitemap";

const staticPages: SitemapEntry[] = [
    {
        arPath: "/",
        enPath: "/en/",
    },
    {
        arPath: "/about/",
        enPath: "/en/about/",
    },
    {
        arPath: "/blog/",
        enPath: "/en/blog/",
    },
    {
        arPath: "/contact/",
        enPath: "/en/contact/",
    },
    {
        arPath: "/exhibitions/",
        enPath: "/en/exhibitions/",
    },
    {
        arPath: "/services/",
        enPath: "/en/services/",
    },
    {
        arPath: "/privacy-policy/",
        enPath: "/en/privacy-policy/",
    },
    {
        arPath: "/terms/",
        enPath: "/en/terms/",
    },
];

export async function GET(): Promise<Response> {
    return sitemapResponse(
        buildUrlSet(staticPages),
    );
}