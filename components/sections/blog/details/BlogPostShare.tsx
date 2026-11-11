import {
    FiFacebook,
    FiLinkedin,
    FiLink,
    FiTwitter,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import { FaWhatsapp } from "react-icons/fa6";

interface BlogPostShareProps {
    locale: Locale;
    slug: string;
    title: string;
}

export default function BlogPostShare({ locale, slug, title, }: BlogPostShareProps) {
    const isArabic = locale === "ar";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://event-maker.sa";
    const url = `${siteUrl}/${locale === "ar" ? "" : "en/"}${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            label: "WhatsApp",
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            className:
                "hover:border-green-500 hover:bg-green-500 hover:text-white",
            icon: "whatsapp",
        },
        {
            label: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            className:
                "hover:border-blue-500 hover:bg-blue-500 hover:text-white",
            icon: "linkedin",
        },
        {
            label: "X",
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            className:
                "hover:border-white hover:bg-white hover:text-(--theme-secondary)",
            icon: "x",
        },
        {
            label: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className:
                "hover:border-blue-600 hover:bg-blue-600 hover:text-white",
            icon: "facebook",
        },
    ];

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 lg:px-10"
        >
            <div className="relative overflow-hidden rounded-3xl bg-(--theme-secondary) px-6 py-7 text-white sm:px-8">
                <div className="absolute -end-16 -top-20 size-48 rounded-full border border-(--theme-primary)/15" />
                <div className="absolute -start-20 -bottom-24 size-56 rounded-full border border-(--theme-primary)/10" />

                <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className={isArabic ? "text-right" : "text-left"}>
                        <p className="text-sm font-semibold text-white">
                            {isArabic
                                ? "شارك المقال"
                                : "Share this article"}
                        </p>

                        <p className="mt-1 text-xs text-white/50">
                            {isArabic
                                ? "شارك المحتوى مع من قد يهمه"
                                : "Share this article with others"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {shareLinks.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.label}
                                className={`flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition ${item.className}`}
                            >
                                {item.icon === "linkedin" && (
                                    <FiLinkedin />
                                )}

                                {item.icon === "x" && (
                                    <FiTwitter />
                                )}

                                {item.icon === "facebook" && (
                                    <FiFacebook />
                                )}

                                {item.icon === "whatsapp" && (
                                    <FaWhatsapp />
                                )}
                            </a>
                        ))}

                        <a
                            href={url}
                            aria-label={
                                isArabic
                                    ? "نسخ الرابط"
                                    : "Copy link"
                            }
                            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-(--theme-primary) hover:bg-(--theme-primary) hover:text-(--theme-secondary)"
                        >
                            <FiLink />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}