
"use client";

import { FiUser, FiBriefcase } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";

type BookingType = "visitor" | "exhibitor";

interface BookingTypeSelectorProps {
    locale: Locale;
    value: BookingType;
    onChange: (value: BookingType) => void;
}

export default function BookingTypeSelector({
    locale,
    value,
    onChange,
}: BookingTypeSelectorProps) {
    const isArabic = locale === "ar";

    const options = [
        {
            id: "visitor" as const,
            icon: FiUser,
            label: isArabic ? "تسجيل زائر" : "Visitor Registration",
            description: isArabic
                ? "اكتشف المعرض والفرص المتاحة"
                : "Explore the exhibition and its opportunities",
        },
        {
            id: "exhibitor" as const,
            icon: FiBriefcase,
            label: isArabic ? "تسجيل عارض" : "Exhibitor Registration",
            description: isArabic
                ? "شارك بمنتجاتك وخدماتك في المعرض"
                : "Showcase your products and services",
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((option) => {
                const Icon = option.icon;
                const isActive = value === option.id;

                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        aria-pressed={isActive}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-start transition ${
                            isActive
                                ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/[0.06]"
                                : "border-[var(--theme-text)]/10 bg-white hover:border-[var(--theme-primary)]/40"
                        }`}
                    >
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                                ? "bg-[var(--theme-primary)] text-white"
                                : "bg-slate-100 text-[var(--theme-text)]/55"
                        }`}>
                            <Icon size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className={`block text-xs font-bold ${
                                isActive
                                    ? "text-[var(--theme-primary)]"
                                    : "text-[var(--theme-text)]"
                            }`}>
                                {option.label}
                            </span>

                            <span className="mt-1 block text-[10px] leading-5 text-[var(--theme-text)]/50">
                                {option.description}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
