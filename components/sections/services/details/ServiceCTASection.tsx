import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";
import Reveal from "@/components/animations/Reveal";

interface ServiceCTASectionProps {
    locale: Locale;
    service: ServiceItem;
}

export default function ServiceCTASection({
    locale,
    service,
}: ServiceCTASectionProps) {
    const isArabic = locale === "ar";

    const title = service.content?.main?.cta?.[locale];

    if (!title) {
        return null;
    }

    const contactHref = isArabic ? "/contact/" : "/en/contact/";
    const servicesHref = isArabic ? "/services/" : "/en/services/";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden mb-7 bg-(--theme-background)"
        >
            <div className="container mx-auto px-5 sm:px-7 lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] bg-(--theme-primary) px-7 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                    <div
                        className={`pointer-events-none absolute -top-32 h-96 w-96 rounded-full bg-white/20 blur-[110px] ${
                            isArabic ? "-start-32" : "-end-32"
                        }`}
                    />

                    <div className="pointer-events-none absolute inset-5 rounded-[1.5rem] border border-(--theme-secondary)/10 sm:inset-7" />

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <Reveal delay={80} distance={20}>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--theme-secondary)/60 sm:text-xs">
                                {isArabic
                                    ? "لنبدأ مشروعك القادم"
                                    : "LET'S BUILD YOUR NEXT EXPERIENCE"}
                            </span>
                        </Reveal>

                        <Reveal delay={180} distance={25}>
                            <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-(--theme-secondary) sm:text-4xl md:text-5xl lg:text-6xl">
                                {title}
                            </h2>
                        </Reveal>

                        <Reveal delay={300} distance={20}>
                            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href={contactHref}
                                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-(--theme-secondary) px-7 py-4 text-sm font-bold text-white shadow-xl shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    <span>
                                        {isArabic
                                            ? "تواصل معنا"
                                            : "Get in Touch"}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    >
                                        {isArabic ? "←" : "→"}
                                    </span>
                                </Link>

                                <Link
                                    href={servicesHref}
                                    className="inline-flex items-center justify-center rounded-full border border-(--theme-secondary)/20 bg-white/15 px-7 py-4 text-sm font-semibold text-(--theme-secondary) transition-all duration-300 hover:bg-white/25"
                                >
                                    {isArabic
                                        ? "استكشف خدماتنا"
                                        : "Explore Our Services"}
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}