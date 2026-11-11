
import Image from "next/image";
import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
    FiFileText,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

import ExhibitionStats from "./ExhibitionStats";
import VideoModal from "@/components/animations/VideoModal";

interface ExhibitionOverviewProps {
    locale: Locale;
    exhibition: Exhibition;
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function ExhibitionOverview({
    locale,
    exhibition,
}: ExhibitionOverviewProps) {
    const isArabic = locale === "ar";

    const title = isArabic ? exhibition.title?.ar : exhibition.title?.en;
    const description = isArabic
        ? exhibition.description?.ar
        : exhibition.description?.en;

    const image = exhibition.main_image?.url;
    const video = exhibition.main_video?.url;
    const portfolioPdf = exhibition.portfolio_pdf?.url;

    const displayTitle =
        title ||
        (isArabic
            ? "فرص حقيقية.. لآفاق أوسع"
            : "Real Opportunities. Broader Horizons");

    const displayDescription = stripHtml(description || "");
    const exhibitionUrl = isArabic ? `/exhibitions/${exhibition.slug}` : `/en/exhibitions/${exhibition.slug}`;

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-16"
        >
            {/* Decorative Background */}

            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-(--theme-primary) opacity-[0.035] blur-3xl" />
                <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-(--theme-primary) opacity-[0.025] blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-18">
                    {/* Media */}

                    <Reveal
                        className="relative order-2 lg:order-1"
                        delay={100}
                        distance={35}
                        threshold={0.2}
                    >
                        <div className="relative aspect-16/10 overflow-hidden rounded-[20px] border border-black/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-white/10">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={displayTitle}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : video ? (
                                <video
                                    className="h-full w-full object-cover"
                                    src={video}
                                    playsInline
                                    preload="metadata"
                                    controls
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-(--theme-secondary)" />
                            )}

                            {/* Media Overlay */}

                            {video && (
                                <>
                                    <div className="pointer-events-none absolute inset-0 bg-black/15" />
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/75 to-transparent" />
                                    <VideoModal video={video} playLabel={locale === "ar" ? "تشغيل فيديو المعرض" : "Play exhibition video"} closeLabel={locale === "ar" ? "إغلاق الفيديو" : "Close video"} modalLabel={locale === "ar" ? "فيديو المعرض" : "Exhibition video"} />
                                </>
                            )}
                        </div>
                    </Reveal>

                    {/* Content */}

                    <div className="order-1 lg:order-2">
                        <Reveal delay={250} distance={35}>
                            <h2
                                className={`max-w-150 ${isArabic ? "text-5xl" : "text-3xl"} font-extrabold leading-tight tracking-[-0.02em] text-(--theme-secondaryColor) sm:text-4xl lg:text-[42px]`}
                            >
                                {displayTitle}
                            </h2>
                        </Reveal>

                        {displayDescription && (
                            <Reveal delay={350} distance={35}>
                                <p
                                    className="mt-5 max-w-155 overflow-hidden text-sm leading-7 text-(--theme-text) opacity-70 sm:text-[15px] sm:leading-8"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 4,
                                    }}
                                >
                                    {displayDescription}
                                </p>
                            </Reveal>
                        )}

                        {/* Exhibition Stats */}

                        {exhibition.stats?.length > 0 && (
                            <Reveal delay={450} distance={35}>
                                <ExhibitionStats
                                    locale={locale}
                                    exhibition={exhibition}
                                />
                            </Reveal>
                        )}

                        {/* Action Buttons */}

                        <Reveal delay={550} distance={35}>
                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                {portfolioPdf && (
                                    <a
                                        href={portfolioPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-5 py-3 text-sm font-bold text-[var(--theme-secondary)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:px-6"
                                    >
                                        <FiFileText className="text-[17px]" />
                                        <span>
                                            {isArabic
                                                ? "ملف المعرض"
                                                : "Exhibition Portfolio"}
                                        </span>
                                    </a>
                                )}

                                <Link
                                    href={exhibitionUrl}
                                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--theme-secondary)]/20 bg-transparent px-5 py-3 text-sm font-semibold text-[var(--theme-secondary)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)] hover:text-white sm:px-6"
                                >
                                    <span>
                                        {isArabic
                                            ? "المزيد عن المعرض"
                                            : "More About Exhibition"}
                                    </span>

                                    {isArabic ? (
                                        <FiArrowLeft className="text-[16px] transition-transform duration-300 group-hover:-translate-x-1" />
                                    ) : (
                                        <FiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                                    )}
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
