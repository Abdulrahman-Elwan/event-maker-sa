
"use client";

import {
    Children,
    isValidElement,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { FiSliders } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionStatus } from "@/lib/utils/exhibition";

import ExhibitionFilter from "@/components/exhibitions/ExhibitionFilter";

interface FilterExhibition {
    id: string;
    status: ExhibitionStatus;
}

interface ExhibitionsFilterClientProps {
    locale: Locale;
    header: ReactNode;
    filterExhibitions: FilterExhibition[];
    children: ReactNode;
}

interface ExhibitionCardElementProps {
    "data-exhibition-status"?: ExhibitionStatus;
}

export default function ExhibitionsFilterClient({
    locale,
    header,
    filterExhibitions,
    children,
}: ExhibitionsFilterClientProps) {
    const isArabic = locale === "ar";

    const [status, setStatus] =
        useState<ExhibitionStatus>("all");

    const filteredChildren = useMemo(() => {
        return Children.toArray(children).filter((child) => {
            if (status === "all") {
                return true;
            }

            if (!isValidElement<ExhibitionCardElementProps>(child)) {
                return true;
            }

            return (
                child.props["data-exhibition-status"] === status
            );
        });
    }, [children, status]);

    const hasResults = filteredChildren.length > 0;

    return (
        <>
            {/* Header & Filter */}
            <div className="flex flex-col mb-10 gap-7 lg:flex-row lg:items-end lg:justify-between">
                {header}

                <ExhibitionFilter
                    locale={locale}
                    value={status}
                    onChange={setStatus}
                    variant="light"
                />
            </div>

            {/* Exhibitions Grid */}
            {hasResults ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {filteredChildren}
                </div>
            ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.75rem] border border-(--theme-secondary)/10 bg-white px-6 text-center shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--theme-primary)/10 text-(--theme-primary)">
                        <FiSliders className="text-xl" />
                    </div>

                    <p className="mt-5 text-sm font-semibold text-(--theme-secondary)">
                        {isArabic
                            ? "لا توجد معارض في هذه الفئة"
                            : "No exhibitions found in this category"}
                    </p>

                    <p className="mt-2 max-w-md text-xs leading-6 text-(--theme-text)/45">
                        {isArabic
                            ? "جرّب اختيار تصنيف آخر لاستعراض المزيد من المعارض والفعاليات."
                            : "Try selecting another category to explore more exhibitions and events."}
                    </p>

                    {status !== "all" && (
                        <button
                            type="button"
                            onClick={() => setStatus("all")}
                            className="mt-5 cursor-pointer rounded-full bg-(--theme-secondary) px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-(--theme-primary)"
                        >
                            {isArabic
                                ? "عرض كل المعارض"
                                : "View all exhibitions"}
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
