import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";

interface ServiceHeroProps {
    locale: Locale;
    service: ServiceItem;
}

export default function ServiceHero({
    locale,
    service,
}: ServiceHeroProps) {
    const isArabic = locale === "ar";

    const title = service.title[locale];
    const description = service.shortDescription[locale];

    const servicesHref = isArabic
        ? "/services/"
        : "/en/services/";

    const contactHref = isArabic
        ? "/contact/"
        : "/en/contact/";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-(--theme-secondary) sm:min-h-[75vh] lg:min-h-[80vh]"
        >
            {/* Background Image */}
            {service.coverImage?.url && (
                <Image
                    src={service.coverImage.url}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="absolute inset-0 -z-30 object-cover"
                />
            )}

            {/* Main Overlay */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black/95 via-black/70 to-black/25" />

            {/* Bottom Depth */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

            {/* Theme Glow */}
            <div
                className={`pointer-events-none absolute -z-10 h-96 w-96 rounded-full bg-(--theme-primary)/15 blur-[130px] ${
                    isArabic
                        ? "-start-32 top-1/4"
                        : "-end-32 top-1/4"
                }`}
            />

            {/* Decorative Frame */}
            <div className="pointer-events-none absolute inset-5 -z-10 border border-white/10 sm:inset-7 lg:inset-8" />

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-7 sm:pb-18 lg:px-8 lg:pb-24">
                <div className="max-w-4xl">
                    {/* Breadcrumb */}
                    <Reveal delay={80} distance={15}>
                        <nav
                            aria-label={
                                isArabic
                                    ? "مسار التنقل"
                                    : "Breadcrumb"
                            }
                            className="mb-7 flex items-center gap-2 text-xs text-white/50"
                        >
                            <Link
                                href={servicesHref}
                                className="transition-colors duration-300 hover:text-white"
                            >
                                {isArabic
                                    ? "خدماتنا"
                                    : "Our Services"}
                            </Link>

                            <span
                                aria-hidden="true"
                                className="text-white/30"
                            >
                                /
                            </span>

                            <span className="max-w-60 truncate text-white/75">
                                {title}
                            </span>
                        </nav>
                    </Reveal>

                    {/* Title */}
                    <Reveal delay={260} distance={30}>
                        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            {title}
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal delay={400} distance={25}>
                        <p className="mt-6 max-w-3xl text-sm leading-8 text-white/75 sm:text-base sm:leading-9 md:text-lg">
                            {description}
                        </p>
                    </Reveal>

                    {/* Actions */}
                    <Reveal delay={520} distance={20}>
                        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                            <Link
                                href={contactHref}
                                className="group inline-flex items-center justify-center gap-3 rounded-full bg-(--theme-primary) px-6 py-3.5 text-sm font-bold text-(--theme-secondary) shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <span>
                                    {isArabic
                                        ? "اطلب الخدمة"
                                        : "Request This Service"}
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                                >
                                    {isArabic ? "←" : "→"}
                                </span>
                            </Link>

                            <Link
                                href={servicesHref}
                                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                            >
                                {isArabic
                                    ? "كل الخدمات"
                                    : "All Services"}
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Service Number */}
            <Reveal
                delay={650}
                distance={15}
                className={`pointer-events-none absolute bottom-8 hidden select-none lg:block ${
                    isArabic ? "end-10" : "start-10"
                }`}
            >
                <span className="text-[clamp(5rem,10vw,9rem)] font-black leading-none tracking-tighter text-white/[0.06]">
                    {String(service.order + 1).padStart(2, "0")}
                </span>
            </Reveal>

            {/* Bottom Accent */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-(--theme-primary)/40" />
        </section>
    );
}