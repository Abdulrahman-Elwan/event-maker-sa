
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import Reveal from "@/components/animations/Reveal";

interface LocalizedText {
    ar: string;
    en: string;
}

interface AboutHeroProps {
    locale: Locale;
    hero: {
        title: LocalizedText;
        description: LocalizedText;
        image: {
            url: string;
            public_id: string;
        };
    };
}

export default function AboutHero({
    locale,
    hero,
}: AboutHeroProps) {
    const isArabic = locale === "ar";

    const title = hero.title[locale];
    const description = hero.description[locale];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-[#0D172B] sm:min-h-[540px] lg:min-h-[580px]"
        >
            {/* Background Image */}
            {hero.image?.url && (
                <Image
                    src={hero.image.url}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="absolute inset-0 -z-20 object-cover"
                />
            )}

            {/* Background Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#081225] via-[#081225]/85 to-[#081225]/20" />

            {/* Additional Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#081225]/75 via-transparent to-[#081225]/25" />

            {/* Decorative Glow */}
            <div className="pointer-events-none absolute -start-32 top-1/4 -z-10 h-80 w-80 rounded-full bg-[var(--theme-primary)]/10 blur-[120px]" />

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-7 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="max-w-2xl">

                    {/* Eyebrow */}
                    <Reveal delay={100} distance={20}>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[var(--theme-primary)]" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)] sm:text-sm">
                                {isArabic ? "إيفنت ميكر" : "EVENT MAKER"}
                            </span>

                            <span className="h-px w-8 bg-[var(--theme-primary)]" />
                        </div>
                    </Reveal>

                    {/* Title */}
                    <Reveal delay={220} distance={30}>
                        <h1 className="max-w-xl text-4xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal delay={360} distance={25}>
                        <p className="mt-6 max-w-lg text-sm leading-8 text-white/75 sm:text-base sm:leading-9">
                            {description}
                        </p>
                    </Reveal>

                    {/* Actions */}
                    <Reveal delay={500} distance={20}>
                        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                            <Link
                                href="#about-story"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--theme-primary)] px-6 py-3.5 text-sm font-bold text-[#111827] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {isArabic ? "اكتشف قصتنا" : "Explore Our Story"}

                                <span aria-hidden="true">
                                    {isArabic ? "←" : "→"}
                                </span>
                            </Link>

                            <Link
                                href={isArabic ? "/contact" : "/en/contact"}
                                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
                            >
                                {isArabic ? "تواصل معنا" : "Contact Us"}
                            </Link>
                        </div>
                    </Reveal>

                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0D172B]/50 to-transparent" />
        </section>
    );
}
