
"use client";

import { useEffect } from "react";

interface GoogleFontsLoaderProps {
    href: string;
}

export default function GoogleFontsLoader({ href, }: GoogleFontsLoaderProps) {
    useEffect(() => {
        if (!href) return;

        const existingLink = document.querySelector(
            'link[data-google-fonts="true"]'
        ) as HTMLLinkElement | null;

        if (existingLink?.href === href) return;

        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = href;
        link.dataset.googleFonts = "true";

        document.head.appendChild(link);

        return () => {
            link.remove();
        };
    }, [href]);

    return null;
}
