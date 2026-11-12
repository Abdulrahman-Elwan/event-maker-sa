
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
}

export const SITE_URL = siteUrl.replace(/\/+$/, "");

export function absoluteUrl(path = ""): string {
    return new URL(path, `${SITE_URL}/`).toString();
}
