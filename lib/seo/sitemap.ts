import { absoluteUrl } from "@/lib/site";

export interface SitemapEntry {
    arPath: string;
    enPath: string;
    hasArabic?: boolean;
    hasEnglish?: boolean;
    lastModified?: unknown;
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export function getLocalizedAvailability(
    value: unknown,
): {
    ar: boolean;
    en: boolean;
} {
    if (typeof value === "string") {
        const exists = value.trim().length > 0;

        return {
            ar: exists,
            en: exists,
        };
    }

    if (!value || typeof value !== "object") {
        return {
            ar: false,
            en: false,
        };
    }

    const localized = value as Record<string, unknown>;

    return {
        ar:
            typeof localized.ar === "string" &&
            localized.ar.trim().length > 0,

        en:
            typeof localized.en === "string" &&
            localized.en.trim().length > 0,
    };
}

function normalizeLastModified(
    value: unknown,
): string | null {
    if (!value) {
        return null;
    }

    try {
        let date: Date | null = null;

        if (value instanceof Date) {
            date = value;
        } else if (
            typeof value === "string" ||
            typeof value === "number"
        ) {
            date = new Date(value);
        } else if (
            typeof value === "object" &&
            "toDate" in value &&
            typeof value.toDate === "function"
        ) {
            date = value.toDate();
        }

        if (!date || Number.isNaN(date.getTime())) {
            return null;
        }

        return date.toISOString();
    } catch {
        return null;
    }
}


export function buildSitemapUrl(
    entry: SitemapEntry,
): string {
    const hasArabic = entry.hasArabic !== false;
    const hasEnglish = entry.hasEnglish !== false;

    const arabicUrl = hasArabic
        ? absoluteUrl(entry.arPath)
        : null;

    const englishUrl = hasEnglish
        ? absoluteUrl(entry.enPath)
        : null;

    const canonicalUrl = arabicUrl ?? englishUrl;

    if (!canonicalUrl) {
        return "";
    }

    const lines = [
        "    <url>",
        `        <loc>${escapeXml(canonicalUrl)}</loc>`,
    ];

    if (arabicUrl) {
        lines.push(
            `        <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arabicUrl)}" />`,
            `        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(arabicUrl)}" />`,
        );
    }

    if (englishUrl) {
        lines.push(
            `        <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(englishUrl)}" />`,
        );
    }

    const lastModified = normalizeLastModified(
        entry.lastModified,
    );

    if (lastModified) {
        lines.push(
            `        <lastmod>${lastModified}</lastmod>`,
        );
    }

    lines.push("    </url>");

    return lines.join("\n");
}

export function buildUrlSet(
    entries: SitemapEntry[],
): string {
    const urls = entries
        .map(buildSitemapUrl)
        .filter(Boolean)
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        urls,
        "</urlset>",
    ].join("\n");
}

export function sitemapResponse(xml: string): Response {
    return new Response(xml, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "no-store, max-age=0",
        },
    });
}