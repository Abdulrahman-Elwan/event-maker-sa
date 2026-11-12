
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type {
    Exhibition,
    ExhibitionMedia,
} from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

import PreviousEditionStoryTrigger from "./Animated/PreviousEditionStoryTrigger";
import PreviousEditionStoryViewer from "./Animated/PreviousEditionStoryViewer";

interface PreviousEditionsSectionProps {
    locale: Locale;
    exhibitions: Exhibition[];
}

function getText(
    value?: { ar?: string; en?: string } | null,
    locale?: Locale
) {
    if (!value) return "";

    return value[locale || "ar"] || value.en || value.ar || "";
}

function getMedia(exhibition: Exhibition): ExhibitionMedia[] {
    if (exhibition.gallery?.length > 0) {
        return exhibition.gallery;
    }

    if (exhibition.main_image?.url) {
        return [{ ...exhibition.main_image, type: "image" }];
    }

    return [];
}

function getCover(exhibition: Exhibition) {
    const image = exhibition.gallery?.find(
        (media) => media.type === "image"
    );

    return image?.url || exhibition.main_image?.url || null;
}

function getYear(date: string, locale: Locale) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-US",
        { year: "numeric" }
    );
}

export default function PreviousEditionsSection({
    locale,
    exhibitions,
}: PreviousEditionsSectionProps) {
    if (!exhibitions?.length) return null;

    const isArabic = locale === "ar";

    const gridLayout =
        exhibitions.length === 1
            ? "mx-auto max-w-[360px] grid-cols-1"
            : exhibitions.length === 2
                ? "mx-auto max-w-[760px] grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

    const allExhibitionsHref = locale === "ar" ? "/exhibitions/" : "/en/exhibitions/";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full overflow-hidden bg-[var(--theme-background)] py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <Reveal>
                    <div className="mb-9 flex flex-col gap-6 border-b border-[var(--theme-secondary)]/10 pb-7 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:pb-9">

                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2.5">
                                <span className="h-[2px] w-8 rounded-full bg-[var(--theme-primary)]" />

                                <span className="text-xs font-bold tracking-[0.16em] text-[var(--theme-primary)] sm:text-sm">
                                    {isArabic
                                        ? "النسخ السابقة"
                                        : "PREVIOUS EDITIONS"}
                                </span>
                            </div>

                            <h2 className="text-2xl font-extrabold leading-snug text-[var(--theme-secondary)] sm:text-3xl lg:text-4xl">
                                {isArabic
                                    ? "رحلة من النجاحات والإنجازات"
                                    : "A Journey of Success and Achievements"}
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--theme-text)]/65 sm:text-base">
                                {isArabic
                                    ? "استرجع أبرز اللحظات والمحطات التي صنعت نجاح هذا المعرض عبر نسخه السابقة."
                                    : "Explore the memorable moments and milestones that shaped the success of this exhibition."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 sm:pb-1">
                            <span className="text-3xl font-extrabold tabular-nums text-[var(--theme-primary)] sm:text-4xl">
                                {String(exhibitions.length).padStart(2, "0")}
                            </span>

                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[var(--theme-secondary)] sm:text-sm">
                                    {isArabic
                                        ? "نسخة سابقة"
                                        : "Previous Editions"}
                                </span>

                                <span className="mt-0.5 text-[11px] text-[var(--theme-text)]/50">
                                    {isArabic
                                        ? "من تاريخ المعرض"
                                        : "From exhibition history"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Previous Editions Slider / Grid */}
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                    className={`
        ${exhibitions.length > 1
                            ? "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none lg:gap-7"
                            : "grid grid-cols-1"
                        }
        ${gridLayout.replace("grid-cols-1", "lg:grid-cols-1").replace("sm:grid-cols-2", "lg:grid-cols-2").replace("lg:grid-cols-3", "lg:grid-cols-3")}
    `}
                >
                    {exhibitions.map((exhibition, index) => {
                        const cover = getCover(exhibition);
                        const media = getMedia(exhibition);

                        const location = getText(
                            exhibition.location?.address,
                            locale
                        );

                        const title = getText(exhibition.title, locale);

                        return (
                            <div
                                key={exhibition.id}
                                className={`
                    min-w-0
                    ${exhibitions.length > 1
                                        ? "flex-[0_0_82%] snap-start sm:flex-[0_0_60%] lg:flex-none"
                                        : "mx-auto w-full max-w-[380px]"
                                    }
                    ${exhibitions.length === 1 ? "lg:max-w-[360px]" : ""}
                `}
                            >
                                <Reveal
                                    // delay={index * 120}
                                    distance={30}
                                    className="h-full"
                                >
                                    <PreviousEditionStoryTrigger
                                        index={index}
                                        ariaLabel={`${isArabic ? "عرض" : "View"} ${title}`}
                                        className="group relative block h-full w-full overflow-hidden rounded-2xl text-start shadow-[0_8px_30px_rgba(15,68,93,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(15,68,93,0.18)]"
                                    >
                                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--theme-secondary)]">

                                            {cover ? (
                                                <Image
                                                    src={cover}
                                                    alt={title}
                                                    fill
                                                    sizes="(max-width: 640px) 82vw, (max-width: 1023px) 60vw, 380px"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center p-6 text-center text-white">
                                                    <span className="text-lg font-bold">{title}</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-[#082C40]/95 via-[#082C40]/15 to-black/10 transition-opacity duration-500 group-hover:from-[#082C40]/90" />

                                            {/* Top Information */}

                                            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                                                <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                                                    {isArabic
                                                        ? `النسخة ${exhibition.version || index + 1}`
                                                        : `EDITION ${exhibition.version || index + 1}`}
                                                </span>

                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[var(--theme-primary)] group-hover:bg-[var(--theme-primary)]">
                                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                                        <path
                                                            d={isArabic ? "M7 17L17 7M7 7H17V17" : "M17 17L7 7M17 7H7V17"}
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>

                                            {/* Bottom Information */}

                                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--theme-primary)]" />

                                                    <span className="text-sm font-bold tracking-wide text-[var(--theme-primary)]">
                                                        {getYear(exhibition.start_date, locale)}
                                                    </span>

                                                    {location && (
                                                        <>
                                                            <span className="h-1 w-1 flex-none rounded-full bg-white/50" />
                                                            <span className="line-clamp-1 text-xs text-white/75">
                                                                {location}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <h3 className="line-clamp-2 text-lg font-extrabold leading-7 text-white sm:text-xl">
                                                    {title}
                                                </h3>

                                                <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                                                    <span className="text-xs font-medium text-white/70">
                                                        {isArabic ? "استكشف الذكريات" : "Explore memories"}
                                                    </span>

                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white transition-transform duration-300 group-hover:scale-110">
                                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                                            <path
                                                                d={isArabic ? "M19 12H5M5 12L11 18M5 12L11 6" : "M5 12H19M19 12L13 18M19 12L13 6"}
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Media Count */}

                                            <div className="absolute bottom-[116px] end-5 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur-md sm:bottom-[124px]">
                                                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                                                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                {media.length}
                                            </div>
                                        </div>
                                    </PreviousEditionStoryTrigger>
                                </Reveal>
                            </div>
                        );
                    })}
                </div>

                {/* Discover All Exhibitions */}
                <Reveal delay={exhibitions.length * 120}>
                    <div className="mt-10 flex justify-center sm:mt-12">
                        <Link
                            href={allExhibitionsHref}
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[var(--theme-primary)] px-7 py-3 text-sm font-bold text-[var(--theme-primary)] transition-all duration-300 hover:bg-[var(--theme-primary)] hover:text-white sm:px-9 sm:text-base"
                        >
                            <span>
                                {isArabic
                                    ? "اكتشف جميع المعارض"
                                    : "Discover All Exhibitions"}
                            </span>

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12H19M19 12L13 6M19 12L13 18"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </Reveal>
            </div>

            {/* Interactive Stories */}
            <PreviousEditionStoryViewer
                locale={locale}
                exhibitions={exhibitions}
            />
        </section>
    );
}
