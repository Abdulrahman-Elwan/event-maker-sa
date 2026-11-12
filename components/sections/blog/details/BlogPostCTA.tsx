import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";

interface BlogPostCTAProps {
    locale: Locale;
}

export default function BlogPostCTA({
    locale,
}: BlogPostCTAProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-secondary) py-20 text-white sm:py-24"
        >
            <div className="absolute -start-20 top-1/2 size-80 -translate-y-1/2 rounded-full border border-(--theme-primary)/20" />
            <div className="absolute -end-32 -bottom-40 size-96 rounded-full border border-(--theme-primary)/15" />

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 text-center sm:px-8 lg:flex-row lg:text-start lg:px-10">
                <div>
                    <p className="mb-3 text-sm font-medium text-(--theme-primary)">
                        {isArabic
                            ? "جاهزون لصناعة تجربة استثنائية؟"
                            : "Ready to create something exceptional?"}
                    </p>

                    <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                        {isArabic
                            ? "لنصنع معًا تجربة استثنائية في عالم المعارض"
                            : "Let's create an exceptional exhibition experience together"}
                    </h2>
                </div>

                <Link
                    href={
                        isArabic
                            ? "/contact/"
                            : "/en/contact/"
                    }
                    className="inline-flex shrink-0 items-center gap-3 rounded-full bg-(--theme-primary) px-7 py-4 text-sm font-bold text-(--theme-secondary) transition hover:scale-[1.02]"
                >
                    {isArabic
                        ? "تواصل معنا"
                        : "Contact Us"}

                    {isArabic ? (
                        <FiArrowLeft />
                    ) : (
                        <FiArrowRight />
                    )}
                </Link>
            </div>
        </section>
    );
}