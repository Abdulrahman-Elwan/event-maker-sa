// app\sitemap.xml\route.ts
import { absoluteUrl } from "@/lib/site";
const sitemapPaths = [
    "/post-sitemap.xml",
    "/services-sitemap.xml",
    "/exhibitions-sitemap.xml",
    "/page-sitemap.xml",
];

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
    const sitemaps = sitemapPaths
        .map((path) => {
            const url = escapeXml(absoluteUrl(path));

            return [
                "<sitemap>",
                `<loc>${url}</loc>`,
                "</sitemap>",
            ].join("");
        })
        .join("");

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        sitemaps,
        "</sitemapindex>",
    ].join("");

    return new Response(xml, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "no-store, max-age=0",
        },
    });
}