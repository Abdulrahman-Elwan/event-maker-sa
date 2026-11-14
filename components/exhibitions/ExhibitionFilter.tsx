// components/exhibitions/ExhibitionFilter.tsx
"use client";
import type { ExhibitionStatus } from "@/lib/utils/exhibition";

interface ExhibitionFilterProps {
    locale: "ar" | "en";
    value: ExhibitionStatus;
    onChange: (status: ExhibitionStatus) => void;
    variant?: "dark" | "light";
}

export default function ExhibitionFilter({
    locale,
    value,
    onChange,
    variant = "dark",
}: ExhibitionFilterProps) {
    const isArabic = locale === "ar";
    const isLight = variant === "light";

    const filters: {
        value: ExhibitionStatus;
        ar: string;
        en: string;
    }[] = [
            {
                value: "all",
                ar: "الكل",
                en: "All",
            },
            {
                value: "ongoing",
                ar: "قائم",
                en: "Ongoing",
            },
            {
                value: "upcoming",
                ar: "قادم",
                en: "Upcoming",
            },
            {
                value: "finished",
                ar: "منتهي",
                en: "Finished",
            },
        ];

    return (
        <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label={isArabic ? "فلترة المعارض" : "Exhibition filters"}
        >
            {filters.map((filter) => {
                const isActive = value === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => onChange(filter.value)}
                        role="tab"
                        aria-selected={isActive}
                        className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${isActive
                                ? "border-transparent text-white shadow-sm"
                                : isLight
                                    ? "border-(--theme-secondary)/10 bg-(--theme-secondary)/[0.03] text-(--theme-secondary)/70 hover:border-(--theme-primary)/25 hover:bg-(--theme-primary)/[0.06] hover:text-(--theme-secondary)"
                                    : "border-white/15 bg-white/5 text-white/65 hover:border-white/30 hover:bg-white/10 hover:text-white"
                            }`}
                        style={
                            isActive
                                ? {
                                    backgroundColor:
                                        "var(--theme-primary)",
                                }
                                : undefined
                        }
                    >
                        {isArabic ? filter.ar : filter.en}
                    </button>
                );
            })}
        </div>
    );
}