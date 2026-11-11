import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { ServicesHero as ServicesHeroData } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";

interface ServicesHeroProps {
    locale: Locale;
    hero: ServicesHeroData;
}

export default function ServicesHero({
    locale,
    hero,
}: ServicesHeroProps) {
    const isArabic = locale === "ar";

    const title = hero.title[locale];
    const description = hero.description[locale];

    const contactHref = isArabic
        ? "/contact"
        : "/en/contact";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate flex min-h-100 items-center overflow-hidden bg-(--theme-secondary)"
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

            {/* Main Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />

            {/* Bottom Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

            {/* Theme Glow */}
            <div className="pointer-events-none absolute -start-32 top-1/4 -z-10 h-80 w-80 rounded-full bg-(--theme-primary)/15 blur-[120px]" />

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-7 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="max-w-3xl">

                    {/* Eyebrow */}
                    <Reveal
                        delay={100}
                        distance={20}
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-(--theme-primary)" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-(--theme-primary) sm:text-sm">
                                {isArabic
                                    ? "إيفنت ميكر"
                                    : "EVENT MAKER"}
                            </span>

                            <span className="h-px w-8 bg-(--theme-primary)" />
                        </div>
                    </Reveal>

                    {/* Title */}
                    <Reveal
                        delay={220}
                        distance={30}
                    >
                        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal
                        delay={360}
                        distance={25}
                    >
                        <p className="mt-6 max-w-2xl text-sm leading-8 text-white/75 sm:text-base sm:leading-9">
                            {description}
                        </p>
                    </Reveal>

                    {/* Actions */}
                    <Reveal
                        delay={500}
                        distance={20}
                    >
                        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">

                            {/* Explore Services */}
                            <Link
                                href="#services-list"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-(--theme-primary) px-6 py-3.5 text-sm font-bold text-(--theme-secondary) shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {isArabic
                                    ? "استكشف خدماتنا"
                                    : "Explore Our Services"}

                                <span aria-hidden="true">
                                    {isArabic ? "←" : "→"}
                                </span>
                            </Link>

                            {/* Contact */}
                            <Link
                                href={contactHref}
                                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
                            >
                                {isArabic
                                    ? "تواصل معنا"
                                    : "Contact Us"}
                            </Link>

                        </div>
                    </Reveal>

                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </section>
    );
}