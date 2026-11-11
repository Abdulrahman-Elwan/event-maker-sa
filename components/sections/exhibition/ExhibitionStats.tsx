import {
    FiAward,
    FiBriefcase,
    FiGlobe,
    FiUsers,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";
import AnimatedCounter from "@/components/animations/AnimatedCounter";

interface ExhibitionStatsProps {
    locale: Locale;
    exhibition: Exhibition;
    layout?: "row" | "column";
}

const icons = [FiUsers, FiBriefcase, FiAward, FiGlobe];

export default function ExhibitionStats({
    locale,
    exhibition,
    layout = "row",
}: ExhibitionStatsProps) {
    const isArabic = locale === "ar";
    const stats = exhibition.stats?.slice(0, 4) ?? [];

    if (!stats.length) return null;

    const isColumn = layout === "column";

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className={`w-full ${isColumn ? "" : "mt-7 max-w-[620px]"}`}
        >
            <div
                className={
                    isColumn
                        ? "flex flex-col"
                        : "grid grid-cols-2 sm:grid-cols-4"
                }
            >
                {stats.map((stat, index) => {
                    const Icon = icons[index % icons.length];

                    const title = isArabic
                        ? stat.title?.ar
                        : stat.title?.en;

                    const value = String(stat.value ?? "");

                    return (
                        <Reveal
                            key={`${title}-${index}`}
                            delay={index * 120}
                            duration={700}
                            distance={25}
                            threshold={0.25}
                            className={
                                isColumn
                                    ? "flex w-full items-center justify-center gap-4 border-b border-(--theme-secondary)/8 py-4 last:border-b-0"
                                    : `flex min-w-0 flex-col items-center justify-center px-3 py-4 text-center sm:px-4 sm:py-2 ${index % 2 !== 0
                                        ? "border-s border-black/10"
                                        : ""
                                    } ${index >= 2
                                        ? "border-t border-black/10 sm:border-t-0"
                                        : ""
                                    } ${index > 0
                                        ? "sm:border-s sm:border-black/10"
                                        : ""
                                    }`
                            }
                        >
                            {/* Icon */}

                            <div
                                className={
                                    isColumn
                                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--theme-primary)/30 bg-(--theme-primary)/5 text-(--theme-primary)"
                                        : "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--theme-primary)]/40 text-[var(--theme-primary)]"
                                }
                            >
                                <Icon
                                    className={
                                        isColumn
                                            ? "text-[17px]"
                                            : "text-[16px]"
                                    }
                                />
                            </div>

                            {/* Content */}

                            <div
                                className={
                                    isColumn
                                        ? "min-w-0 flex-1"
                                        : "flex flex-col items-center"
                                }
                            >
                                {/* Value */}

                                <div
                                    className={
                                        isColumn
                                            ? "text-xl font-extrabold leading-none tracking-[-0.02em] text-(--theme-secondary)"
                                            : "mt-3 text-2xl font-extrabold leading-none tracking-[-0.02em] text-[var(--theme-secondary)] sm:text-[28px]"
                                    }
                                >
                                    <AnimatedCounter
                                        value={value}
                                        duration={5000}
                                    />
                                </div>

                                {/* Title */}

                                {title && (
                                    <p
                                        className={
                                            isColumn
                                                ? "mt-1.5 text-xs font-medium leading-5 text-(--theme-text)/60"
                                                : "mt-2 max-w-[120px] text-[11px] font-semibold leading-5 text-[var(--theme-text)] opacity-70 sm:text-xs"
                                        }
                                    >
                                        {title}
                                    </p>
                                )}
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}