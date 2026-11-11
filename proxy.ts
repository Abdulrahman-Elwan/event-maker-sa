// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ar", "en"] as const;

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore Next.js internals and public files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    let locale = "ar";

    // English URLs
    if (pathname === "/en" || pathname.startsWith("/en/")) {
        locale = "en";
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);

    // English already matches the [locale] route
    if (locale === "en") {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Arabic is the default locale.
    // Rewrite the public Arabic URL internally to /ar/...
    const url = request.nextUrl.clone();

    if (pathname === "/") {
        url.pathname = "/ar";
    } else {
        url.pathname = `/ar${pathname}`;
    }

    return NextResponse.rewrite(url, {
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};