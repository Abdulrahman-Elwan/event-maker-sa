
import Image from "next/image";
import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
    FiMapPin,
    FiUserPlus,
    FiBriefcase,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import { getExhibitionStatus } from "@/lib/utils/exhibition";
import Reveal from "@/components/animations/Reveal";

interface ExhibitionHeroProps {
    locale: Locale;
    exhibition: Exhibition;
    today: string;
}

function formatDate(date: string, locale: Locale) {
    if (!date) return "";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    ).format(parsedDate);
}

function stripHtml(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function ExhibitionHero({
    locale,
    exhibition,
    today,
}: ExhibitionHeroProps) {
    const isArabic = locale === "ar";

    const title = exhibition.title[locale];
    const description = exhibition.description[locale];
    const cleanDescription = stripHtml(description);

    const location =
        exhibition.location?.address?.[locale] ?? "";

    const startDate = formatDate(
        exhibition.start_date,
        locale,
    );

    const endDate = formatDate(
        exhibition.end_date,
        locale,
    );

    const status = getExhibitionStatus(exhibition, today);

    const isOngoing = status === "ongoing";
    const isUpcoming = status === "upcoming";

    const videoSrc = exhibition.main_video?.url;
    const poster = exhibition.main_image?.url;

    const visitorRegisterUrl = isArabic
        ? `/booking/visitor/${exhibition.slug}/`
        : `/en/booking/visitor/${exhibition.slug}/`;

    const exhibitorRegisterUrl = isArabic
        ? `/booking/exhibitor/${exhibition.slug}/`
        : `/en/booking/exhibitor/${exhibition.slug}/`;

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate min-h-svh overflow-hidden bg-(--theme-secondary) text-white"
        >
            {/* Background */}
            <div className="absolute inset-0 -z-30 overflow-hidden bg-(--theme-secondary)">
                {videoSrc ? (
                    <video
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        src={videoSrc}
                        poster={poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        aria-hidden="true"
                        disablePictureInPicture
                    />
                ) : poster ? (
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                ) : null}
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 -z-20 bg-black/55" />
            <div className="absolute inset-0 -z-10 bg-(--theme-secondary)/65" />

            {/* Content */}
            <div className="relative z-10 flex min-h-svh items-center justify-center px-5 pb-14 pt-28 sm:px-8 sm:pb-16 lg:px-12">
                <div className="mx-auto flex w-full max-w-220 flex-col items-center justify-center text-center">

                    {/* Status */}
                    <Reveal
                        delay={100}
                        duration={700}
                        distance={25}
                        threshold={0.15}
                    >
                        <div className="mb-5 flex justify-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[11px] font-semibold text-white/90 shadow-lg backdrop-blur-md sm:text-xs">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentColor] ${
                                        isOngoing
                                            ? "bg-emerald-400 text-emerald-400"
                                            : isUpcoming
                                                ? "bg-(--theme-primary) text-(--theme-primary)"
                                                : "bg-white/50 text-white/50"
                                    }`}
                                />

                                {isArabic
                                    ? isOngoing
                                        ? "المعرض قائم حاليًا"
                                        : isUpcoming
                                            ? "معرض قادم"
                                            : "انتهى المعرض"
                                    : isOngoing
                                        ? "Currently Ongoing"
                                        : isUpcoming
                                            ? "Upcoming Exhibition"
                                            : "Exhibition Ended"}
                            </span>
                        </div>
                    </Reveal>

                    {/* Title */}
                    <Reveal
                        delay={180}
                        duration={700}
                        distance={30}
                        threshold={0.15}
                    >
                        <h1 className="max-w-200 text-[36px] font-extrabold leading-[1.08] tracking-[-0.025em] text-(--theme-primary) drop-shadow-[0_3px_15px_rgba(0,0,0,0.4)] sm:text-[46px] md:text-[54px] lg:text-[64px] xl:text-[72px]">
                            {title}
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal
                        delay={260}
                        duration={700}
                        distance={25}
                        threshold={0.15}
                    >
                        {cleanDescription && (
                            <p
                                className="mt-5 max-w-175 text-center text-sm leading-7 text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-base sm:leading-8"
                                style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                    overflow: "hidden",
                                }}
                            >
                                {cleanDescription}
                            </p>
                        )}
                    </Reveal>

                    {/* Registration Buttons */}
                    {(isOngoing || isUpcoming) && (
                        <Reveal
                            delay={340}
                            duration={700}
                            distance={25}
                            threshold={0.15}
                        >
                            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
                                <Link
                                    href={visitorRegisterUrl}
                                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-(--theme-primary) px-6 py-3 text-sm font-bold text-(--theme-secondary) shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:px-7"
                                >
                                    <FiUserPlus className="text-[17px]" />

                                    <span>
                                        {isArabic
                                            ? "تسجيل زائر"
                                            : "Visitor Registration"}
                                    </span>

                                    {isArabic ? (
                                        <FiArrowLeft className="text-[16px] transition-transform duration-300 group-hover:-translate-x-1" />
                                    ) : (
                                        <FiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                                    )}
                                </Link>

                                <Link
                                    href={exhibitorRegisterUrl}
                                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-(--theme-secondary) sm:px-7"
                                >
                                    <FiBriefcase className="text-[17px]" />

                                    <span>
                                        {isArabic
                                            ? "تسجيل العارض"
                                            : "Exhibitor Registration"}
                                    </span>
                                </Link>
                            </div>
                        </Reveal>
                    )}

                    {/* Event Information */}
                    <Reveal
                        delay={420}
                        duration={700}
                        distance={25}
                        threshold={0.15}
                    >
                        <div
                            className={`mt-8 grid w-full max-w-190 grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:mt-9 sm:pt-7 ${
                                exhibition.exhibition_logo?.url
                                    ? "sm:grid-cols-3"
                                    : "sm:grid-cols-2"
                            }`}
                        >
                            {/* Date */}
                            <div className="flex items-center justify-center gap-3 text-start">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--theme-primary)/40 bg-black/20 text-(--theme-primary) backdrop-blur-md">
                                    <FiCalendar className="text-lg" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-white/50 sm:text-[11px]">
                                        {isArabic
                                            ? "تاريخ المعرض"
                                            : "Exhibition Date"}
                                    </p>

                                    <p className="mt-1 text-xs font-semibold leading-5 text-white sm:text-sm">
                                        {startDate}

                                        <span className="mx-1.5 text-white/40">
                                            {isArabic ? "إلى" : "—"}
                                        </span>

                                        {endDate}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center justify-center gap-3 border-white/15 text-start sm:border-s">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--theme-primary)/40 bg-black/20 text-(--theme-primary) backdrop-blur-md">
                                    <FiMapPin className="text-lg" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-white/50 sm:text-[11px]">
                                        {isArabic
                                            ? "موقع المعرض"
                                            : "Exhibition Location"}
                                    </p>

                                    <p className="mt-1 max-w-70 text-xs font-semibold leading-5 text-white sm:text-sm">
                                        {location}
                                    </p>
                                </div>
                            </div>

                            {/* Exhibition Logo */}
                            {exhibition.exhibition_logo?.url && (
                                <div className="flex items-center justify-center border-white/15 pt-2 sm:border-s sm:pt-0">
                                    <div className="flex min-h-16 items-center justify-center rounded-2xl bg-white px-5 py-2 shadow-lg">
                                        <Image
                                            src={exhibition.exhibition_logo.url}
                                            alt={title}
                                            width={220}
                                            height={80}
                                            className="max-h-14 w-auto max-w-52 object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
