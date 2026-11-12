import Image from "next/image";

import { FiFileText, FiArrowDown } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";
import VideoModal from "@/components/animations/VideoModal";

import ExhibitionStats from "./ExhibitionStats";

interface ExhibitionOverviewProps {
    locale: Locale;
    exhibition: Exhibition;
}

export default function ExhibitionMainOverview({
    locale,
    exhibition,
}: ExhibitionOverviewProps) {
    const isArabic = locale === "ar";
    const description = exhibition.description?.[locale];
    const meta = exhibition.meta?.[locale];
    const portfolioPdf = exhibition.portfolio_pdf?.url;

    const sectionLabel =
        meta ||
        (isArabic
            ? "عن المعرض"
            : "ABOUT THE EXHIBITION");

    const sectionTitle = isArabic
        ? "تجربة تتجاوز حدود المعرض"
        : "An Experience Beyond the Exhibition";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-7"
        >
            {/* Decorative Background */}

            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -end-56 top-20 h-125 w-125 rounded-full bg-(--theme-primary)/[0.035] blur-[120px]" />

                <div className="absolute -start-56 bottom-20 h-125 w-125 rounded-full bg-(--theme-primary)/[0.025] blur-[120px]" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* Content */}
                <div className="relative mx-auto mt-12 max-w-6xl sm:mt-14 lg:mt-16">
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                        {/* Description */}

                        <Reveal
                            delay={100}
                            distance={30}
                            threshold={0.1}
                        >
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-8 w-1 rounded-full bg-(--theme-primary)" />

                                    <div>
                                        <h3 className="text-xl font-bold text-(--theme-primary) sm:text-2xl">
                                            {isArabic
                                                ? "عن المعرض"
                                                : "About the Exhibition"}
                                        </h3>
                                    </div>
                                </div>

                                {description && (
                                    <div
                                        className="
                                            text-sm leading-8 text-(--theme-text)/65
                                            sm:text-[15px] sm:leading-9
                                            [&_p]:mb-4
                                            [&_p:last-child]:mb-0
                                            [&_strong]:font-bold
                                            [&_strong]:text-(--theme-secondary)
                                            [&_a]:font-semibold
                                            [&_a]:text-(--theme-primary)
                                            [&_ul]:my-5
                                            [&_ul]:list-disc
                                            [&_ul]:space-y-2
                                            [&_ul]:ps-5
                                            [&_ol]:my-5
                                            [&_ol]:list-decimal
                                            [&_ol]:space-y-2
                                            [&_ol]:ps-5
                                            [&_li]:ps-1
                                        "
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    />
                                )}
                            </div>
                        </Reveal>

                        {/* Exhibition Information */}

                        <Reveal
                            delay={180}
                            distance={30}
                            threshold={0.1}
                        >
                            <div className="lg:pt-1 max-w-[300px] mx-auto">
                                <div className="rounded-[1.75rem] border border-(--theme-secondary)/10 bg-white/60 p-5 shadow-[0_15px_50px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6">
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--theme-primary)">
                                                {isArabic
                                                    ? "أرقام المعرض"
                                                    : "EXHIBITION FIGURES"}
                                            </p>

                                            <h3 className="mt-1 text-lg font-bold text-(--theme-secondary)">
                                                {isArabic
                                                    ? "أبرز المؤشرات"
                                                    : "Key Highlights"}
                                            </h3>
                                        </div>

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--theme-primary)/10 text-(--theme-primary)">
                                            <FiArrowDown className="text-lg" />
                                        </div>
                                    </div>

                                    {exhibition.stats?.length > 0 ? (
                                        <ExhibitionStats
                                            locale={locale}
                                            exhibition={exhibition}
                                            layout="column"
                                        />
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-(--theme-secondary)/10 px-4 py-6 text-center text-xs text-(--theme-text)/40">
                                            {isArabic
                                                ? "لا توجد إحصائيات متاحة حاليًا."
                                                : "No statistics are currently available."}
                                        </div>
                                    )}

                                    {portfolioPdf && (
                                        <div className="mt-6 border-t border-(--theme-secondary)/8 pt-5">
                                            <a
                                                href={portfolioPdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--theme-primary) px-5 py-3 text-sm font-bold text-(--theme-secondary) transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                                            >
                                                <FiFileText className="text-[17px]" />

                                                <span>
                                                    {isArabic
                                                        ? "تحميل ملف المعرض"
                                                        : "Download Exhibition Portfolio"}
                                                </span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
