import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { BlogHero as BlogHeroData } from "@/types/blog";

interface BlogHeroProps {
    locale: Locale;
    hero: BlogHeroData;
}

export default function BlogHero({
    locale,
    hero,
}: BlogHeroProps) {
    const isArabic = locale === "ar";

    const title =
        hero.title[locale] ||
        hero.title[isArabic ? "en" : "ar"];

    const description =
        hero.description[locale] ||
        hero.description[isArabic ? "en" : "ar"];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate min-h-[62vh] overflow-hidden bg-(--theme-secondary)"
        >
            {hero.image.url && (
                <Image
                    src={hero.image.url}
                    alt={
                        hero.image.alt[locale] ||
                        title
                    }
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            )}

            <div className="absolute inset-0 bg-black/65" />

            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/45 to-black/80" />

            <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-7xl items-end px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
                <div className="max-w-3xl">
                    <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-6 max-w-2xl text-sm leading-8 text-white/70 sm:text-base sm:leading-9">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}