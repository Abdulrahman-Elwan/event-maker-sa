// lib\site.ts

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
}

export const SITE_URL = siteUrl.replace(/\/+$/, "");

/**
 * Normalize a path to always end with a trailing slash.
 * Query strings and hash fragments are preserved.
 */
export function normalizePath(path: string): string {
    if (!path || path === "/") {
        return "/";
    }

    const url = new URL(path, `${SITE_URL}/`);

    if (!url.pathname.endsWith("/")) {
        url.pathname += "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Generate an absolute URL with a trailing slash.
 */
export function absoluteUrl(path = "/"): string {
    return new URL(
        normalizePath(path),
        `${SITE_URL}/`
    ).toString();
}
