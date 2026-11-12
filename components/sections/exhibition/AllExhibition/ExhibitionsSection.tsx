
import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import {
    getExhibitionStatus,
} from "@/lib/utils/exhibition";

import ExhibitionCard from "@/components/exhibitions/ExhibitionCard";
import Reveal from "@/components/animations/Reveal";

import ExhibitionsFilterClient from "./ExhibitionsFilterClient";

interface ExhibitionsSectionProps {
    locale: Locale;
    exhibitions: Exhibition[];
    currentPage: number;
    today: string;
    totalPages: number;
}

export default function ExhibitionsSection({
    locale,
    exhibitions,
    currentPage,
    today,
    totalPages,
}: ExhibitionsSectionProps) {
    const isArabic = locale === "ar";

    const getPageHref = (page: number) => {
        return isArabic
            ? `/exhibitions?page=${page}/`
            : `/en/exhibitions?page=${page}/`;
    };

    return (
        <section
            id="exhibitions-list"
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-16 sm:py-20 lg:py-24"
        >
            <div className="pointer-events-none absolute -top-48 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-(--theme-primary)/[0.06] blur-[120px]" />

            <div className="pointer-events-none absolute -bottom-40 -start-40 h-80 w-80 rounded-full bg-(--theme-primary)/[0.04] blur-[100px]" />

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
                <ExhibitionsFilterClient
                    locale={locale}
                    header={
                        <div className="flex flex-col mb-10 gap-7 lg:flex-row lg:items-end lg:justify-between">
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

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--theme-secondary) sm:text-4xl lg:text-5xl">
                                    {isArabic
                                        ? "نصنع تجارب تُترك في الذاكرة"
                                        : "We Create Experiences That Leave a Lasting Impression"}
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-(--theme-secondary)/55 sm:text-base">
                                    {isArabic
                                        ? "استكشف أبرز المعارض والفعاليات التي نفذناها، وتعرّف على تجاربنا في صناعة الأحداث الاستثنائية."
                                        : "Explore our featured exhibitions and events, and discover the experiences we create to deliver exceptional moments for brands, partners, and visitors."}
                                </p>
                            </div>
                        </div>
                    }
                    filterExhibitions={exhibitions.map((exhibition) => ({
                        id: exhibition.id,
                        status: getExhibitionStatus(exhibition, today),
                    }))}
                >
                    {exhibitions.map((exhibition, index) => {
                        const status = getExhibitionStatus(
                            exhibition,
                            today
                        );

                        return (
                            <div
                                key={exhibition.id}
                                data-exhibition-status={status}
                            >
                                <Reveal
                                    delay={80 + index * 60}
                                    distance={20}
                                >
                                    <ExhibitionCard
                                        exhibition={exhibition}
                                        locale={locale}
                                        today={today}
                                        variant="light"
                                    />
                                </Reveal>
                            </div>
                        );
                    })}
                </ExhibitionsFilterClient>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Reveal
                        delay={300}
                        distance={15}
                    >
                        <div className="mt-12 border-t border-(--theme-secondary)/8 pt-8 sm:mt-14 sm:pt-10">
                            <nav
                                aria-label={
                                    isArabic
                                        ? "صفحات المعارض"
                                        : "Exhibitions pagination"
                                }
                                className="flex flex-col items-center justify-between gap-5 sm:flex-row"
                            >
                                <p className="text-xs text-(--theme-text)/40">
                                    {isArabic
                                        ? `الصفحة ${currentPage} من ${totalPages}`
                                        : `Page ${currentPage} of ${totalPages}`}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={getPageHref(
                                            Math.max(currentPage - 1, 1)
                                        )}
                                        aria-label={
                                            isArabic
                                                ? "الصفحة السابقة"
                                                : "Previous page"
                                        }
                                        aria-disabled={currentPage === 1}
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                                            currentPage === 1
                                                ? "pointer-events-none border-(--theme-secondary)/5 text-(--theme-secondary)/20"
                                                : "border-(--theme-secondary)/10 bg-white text-(--theme-secondary) hover:border-(--theme-primary)/30 hover:bg-(--theme-primary) hover:text-white"
                                        }`}
                                    >
                                        {isArabic ? (
                                            <FiArrowRight />
                                        ) : (
                                            <FiArrowLeft />
                                        )}
                                    </Link>

                                    <div className="flex items-center gap-1.5">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => index + 1
                                        ).map((page) => (
                                            <Link
                                                key={page}
                                                href={getPageHref(page)}
                                                aria-current={
                                                    page === currentPage
                                                        ? "page"
                                                        : undefined
                                                }
                                                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-all duration-300 ${
                                                    page === currentPage
                                                        ? "bg-(--theme-secondary) text-white shadow-sm"
                                                        : "border border-(--theme-secondary)/10 bg-white text-(--theme-secondary)/60 hover:border-(--theme-primary)/30 hover:bg-(--theme-primary)/5 hover:text-(--theme-secondary)"
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href={getPageHref(
                                            Math.min(
                                                currentPage + 1,
                                                totalPages
                                            )
                                        )}
                                        aria-label={
                                            isArabic
                                                ? "الصفحة التالية"
                                                : "Next page"
                                        }
                                        aria-disabled={
                                            currentPage === totalPages
                                        }
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? "pointer-events-none border-(--theme-secondary)/5 text-(--theme-secondary)/20"
                                                : "border-(--theme-secondary)/10 bg-white text-(--theme-secondary) hover:border-(--theme-primary)/30 hover:bg-(--theme-primary) hover:text-white"
                                        }`}
                                    >
                                        {isArabic ? (
                                            <FiArrowLeft />
                                        ) : (
                                            <FiArrowRight />
                                        )}
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
