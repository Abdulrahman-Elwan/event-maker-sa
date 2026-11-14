// components\exhibitions\ExhibitionCard.tsx
import Image from "next/image";
import Link from "next/link";
import {
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
    FiMapPin,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import { getExhibitionStatus } from "@/lib/utils/exhibition";
import type { ExhibitionCardData } from "@/types/landingPage/exhibition";

interface ExhibitionCardProps {
    exhibition: ExhibitionCardData;
    locale: Locale;
    today: string;
    variant?: "dark" | "light";
}

function formatDate(date: string, locale: Locale) {
    if (!date) return "";

    const dateOnly = date.slice(0, 10);

    const parsedDate = new Date(`${dateOnly}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            calendar: "gregory",
            timeZone: "UTC",
        }
    ).format(parsedDate);
}

export default function ExhibitionCard({
    exhibition,
    locale,
    today,
    variant = "dark",
}: ExhibitionCardProps) {
    const isArabic = locale === "ar";
    const isLight = variant === "light";

    const title = exhibition.title[locale];
    const location = exhibition.location?.address?.[locale] ?? "";

    const status = getExhibitionStatus(exhibition, today);

    const isOngoing = status === "ongoing";
    const isUpcoming = status === "upcoming";

    const registerHref = isArabic
        ? `/booking/general/${exhibition.slug}/`
        : `/en/booking/general/${exhibition.slug}/`;

    const detailsHref = isArabic
        ? `/exhibitions/${exhibition.slug}/`
        : `/en/exhibitions/${exhibition.slug}/`;

    return (
        <article
            className={`group overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${isLight
                    ? "border-(--theme-secondary)/10 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] hover:border-(--theme-primary)/30 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                    : "border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.18)] hover:border-white/20"
                }`}
        >
            {/* Image */}
            <div className="relative aspect-[1.45] overflow-hidden">
                {exhibition.main_image?.url ? (
                    <Image
                        src={exhibition.main_image.url}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className={`absolute inset-0 ${isLight ? "bg-slate-100" : "bg-slate-800"
                            }`}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />

                {/* Status */}
                <div className="absolute left-4 top-4">
                    <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${isOngoing
                                ? "bg-emerald-500/90 text-white"
                                : isUpcoming
                                    ? "bg-white/90 text-slate-900"
                                    : "bg-slate-900/80 text-white"
                            }`}
                    >
                        {isArabic
                            ? isOngoing
                                ? "قائم"
                                : isUpcoming
                                    ? "قادم"
                                    : "منتهي"
                            : isOngoing
                                ? "Ongoing"
                                : isUpcoming
                                    ? "Upcoming"
                                    : "Finished"}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div
                dir={isArabic ? "rtl" : "ltr"}
                className="p-5"
            >
                <h3
                    className={`line-clamp-2 min-h-12 text-lg font-bold leading-6 transition-colors duration-300 ${isLight
                            ? "text-(--theme-secondary) group-hover:text-(--theme-primary)"
                            : "text-white group-hover:text-(--theme-primary)"
                        }`}
                >
                    {title}
                </h3>

                <div
                    className={`mt-4 space-y-2.5 text-sm ${isLight
                            ? "text-(--theme-text)/60"
                            : "text-white/55"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <FiCalendar
                            className="shrink-0"
                            style={{ color: "var(--theme-primary)" }}
                        />

                        <span>
                            {formatDate(exhibition.start_date, locale)}
                            {" - "}
                            {formatDate(exhibition.end_date, locale)}
                        </span>
                    </div>

                    {location && (
                        <div className="flex items-center gap-2">
                            <FiMapPin
                                className="shrink-0"
                                style={{ color: "var(--theme-primary)" }}
                            />

                            <span className="line-clamp-1">
                                {location}
                            </span>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div
                    className={`mt-5 flex gap-2 ${isOngoing || isUpcoming
                            ? "items-stretch"
                            : "items-center"
                        }`}
                >
                    {(isOngoing || isUpcoming) && (
                        <Link
                            href={registerHref}
                            className={`inline-flex flex-1 items-center justify-center rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-300 hover:brightness-110 sm:px-4 ${isLight ? "text-white" : "text-slate-950"
                                }`}
                            style={{
                                backgroundColor: "var(--theme-primary)",
                            }}
                        >
                            {isArabic ? "سجل الآن" : "Register Now"}
                        </Link>
                    )}

                    <Link
                        href={detailsHref}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-4 ${isOngoing || isUpcoming ? "flex-1" : "w-full"
                            } ${isLight
                                ? "border border-(--theme-secondary)/15 bg-(--theme-secondary)/[0.03] text-(--theme-secondary) hover:border-(--theme-primary)/40 hover:bg-(--theme-primary)/5"
                                : "border border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                            }`}
                    >
                        {isArabic ? "التفاصيل" : "Details"}

                        {isArabic ? <FiArrowLeft /> : <FiArrowRight />}
                    </Link>
                </div>
            </div>
        </article>
    );
}
