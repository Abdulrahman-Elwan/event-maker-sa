// components\sections\home\ExhibitionsSection.tsx
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionCardData } from "@/types/landingPage/exhibition";
import type { HomepageExhibitionsResult } from "@/lib/data/landingPage/exhibitions";

import ExhibitionCard from "@/components/exhibitions/ExhibitionCard";
import Reveal from "@/components/animations/Reveal";

import ExhibitionsFilterClient from "./ExhibitionsFilterClient";
import { getExhibitionStatus } from "@/lib/utils/exhibition";

interface ExhibitionsSectionProps {
    locale: Locale;
    today: string;
    exhibitions: ExhibitionCardData[];
    totalCount: number;
    statusCounts: HomepageExhibitionsResult["statusCounts"];
}

export default function ExhibitionsSection({
    locale,
    today,
    exhibitions,
    totalCount,
    statusCounts,
}: ExhibitionsSectionProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-[var(--theme-secondary)] py-12 sm:py-15 lg:py-18"
        >
            <div
                className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full opacity-10 blur-3xl"
                style={{
                    backgroundColor: "var(--theme-primary)",
                }}
            />

            <div
                className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full opacity-5 blur-3xl"
                style={{
                    backgroundColor: "var(--theme-primary)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <ExhibitionsFilterClient
                    locale={locale}
                    totalCount={totalCount}
                    statusCounts={statusCounts}
                    emptyMessage={
                        isArabic
                            ? "لا توجد معارض في هذه الفئة حاليًا."
                            : "There are no exhibitions in this category at the moment."
                    }
                    header={
                        <Reveal
                            distance={35}
                            duration={850}
                            delay={200}
                            threshold={0.05}
                        >
                            <div className="max-w-2xl">
                                <span
                                    className="text-xl font-semibold tracking-wide"
                                    style={{
                                        color: "var(--theme-primary)",
                                    }}
                                >
                                    {isArabic
                                        ? "فعالياتنا"
                                        : "Our Exhibitions"}
                                </span>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                    {isArabic
                                        ? "نصنع تجارب تُترك في الذاكرة"
                                        : "We Create Experiences That Leave a Lasting Impression"}
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                                    {isArabic
                                        ? "استكشف أبرز المعارض والفعاليات التي نفذناها، وتعرّف على تجاربنا في صناعة الأحداث الاستثنائية."
                                        : "Explore our featured exhibitions and events, and discover the experiences we create to deliver exceptional moments for brands, partners, and visitors."}
                                </p>
                            </div>
                        </Reveal>
                    }
                >
                    <div
                        data-exhibitions-grid
                        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {exhibitions.map((exhibition, index) => (
                            <div
                                key={exhibition.id}
                                data-exhibition-status={
                                    getExhibitionStatus(exhibition, today)
                                }
                            >
                                <Reveal
                                    distance={40}
                                    duration={800}
                                    delay={Math.min(index * 200, 480)}
                                    threshold={0.05}
                                >
                                    <ExhibitionCard
                                        exhibition={exhibition}
                                        locale={locale}
                                        today={today}
                                    />
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </ExhibitionsFilterClient>

                <Reveal
                    distance={25}
                    duration={750}
                    delay={200}
                    threshold={0.05}
                >
                    <div className="mt-10 flex justify-center">
                        <Link
                            href={
                                isArabic
                                    ? "/exhibitions/"
                                    : "/en/exhibitions/"
                            }
                            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--theme-primary)] hover:bg-white/[0.06]"
                        >
                            <span>
                                {isArabic
                                    ? "عرض المزيد من المعارض"
                                    : "View More Exhibitions"}
                            </span>

                            {isArabic ? (
                                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                            ) : (
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            )}
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}