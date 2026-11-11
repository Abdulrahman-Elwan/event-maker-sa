
import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";
import ExhibitionGalleryClient from "./ExhibitionGalleryClient";

interface ExhibitionGallerySectionProps {
    locale: Locale;
    exhibition: Exhibition;
}

export default function ExhibitionGallerySection({
    locale,
    exhibition,
}: ExhibitionGallerySectionProps) {
    const isArabic = locale === "ar";
    const gallery = exhibition.gallery ?? [];

    if (!gallery.length) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-10 sm:py-18"
        >
            {/* Background decoration */}
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -start-40 top-1/3 h-80 w-80 rounded-full bg-(--theme-primary)/[0.035] blur-3xl" />

                <div className="absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-(--theme-primary)/[0.025] blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                {/* Section Header */}
                <div className="mb-10 flex flex-col gap-5 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <Reveal
                            delay={100}
                            distance={20}
                            threshold={0.15}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--theme-primary) sm:text-xs">
                                    {isArabic
                                        ? "لحظات من المعرض"
                                        : "EXHIBITION MOMENTS"}
                                </span>
                            </div>
                        </Reveal>

                        <Reveal
                            delay={180}
                            distance={25}
                            threshold={0.15}
                        >
                            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-[-0.025em] text-(--theme-secondary) sm:text-4xl lg:text-[2.9rem]">
                                {isArabic
                                    ? "مشاهد تحكي تجربة المعرض"
                                    : "A Visual Story of the Exhibition"}
                            </h2>
                        </Reveal>

                        <Reveal
                            delay={260}
                            distance={20}
                            threshold={0.15}
                        >
                            <p className="mt-4 max-w-xl text-sm leading-7 text-(--theme-text)/60 sm:text-[15px] sm:leading-8">
                                {isArabic
                                    ? "استكشف أبرز اللحظات والتفاصيل التي صنعت تجربة هذا المعرض."
                                    : "Explore the moments and details that shaped the exhibition experience."}
                            </p>
                        </Reveal>
                    </div>
                </div>

                {/* Interactive Gallery */}
                <ExhibitionGalleryClient
                    locale={locale}
                    gallery={gallery}
                    exhibitionTitle={
                        exhibition.title?.[locale] || ""
                    }
                />
            </div>
        </section>
    );
}
