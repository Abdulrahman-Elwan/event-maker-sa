// components\sections\home\ExhibitionsFilterClient.tsx
"use client";
import { useState, type ReactNode } from "react";
import ExhibitionFilter from "@/components/exhibitions/ExhibitionFilter";
import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionStatus } from "@/lib/utils/exhibition";

interface ExhibitionsFilterClientProps {
    locale: Locale;
    children: ReactNode;
    header: ReactNode;
    emptyMessage: string;
    totalCount: number;

    statusCounts: Record<
        Exclude<ExhibitionStatus, "all">,
        number
    >;
}

export default function ExhibitionsFilterClient({
    locale,
    header,
    children,
    emptyMessage,
    totalCount,
    statusCounts,
}: ExhibitionsFilterClientProps) {
    const [status, setStatus] = useState<ExhibitionStatus>("all");

    // Determine whether the selected filter has results
    const hasResults =
        status === "all"
            ? totalCount > 0
            : statusCounts[status] > 0;

    return (
        <div data-exhibitions-filter={status}>

            {/* Header & Filter */}
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                {header}

                <ExhibitionFilter
                    locale={locale}
                    value={status}
                    onChange={setStatus}
                />
            </div>

            {/* Server Rendered Exhibitions */}
            {children}

            {/* Empty State */}
            {!hasResults && (
                <div
                    className="mt-10 flex min-h-60 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]"
                    aria-live="polite"
                >
                    <p className="text-sm text-white/50">
                        {emptyMessage}
                    </p>
                </div>
            )}

            {/* Filtering Styles */}
            <style jsx global>{`

                /* Show maximum 6 exhibitions */
                [data-exhibitions-filter="all"]
                [data-exhibitions-grid]
                > [data-exhibition-status]:nth-child(n + 7) {
                    display: none !important;
                }

                /* Ongoing */
                [data-exhibitions-filter="ongoing"]
                [data-exhibitions-grid]
                > [data-exhibition-status]:not([data-exhibition-status="ongoing"]) {
                    display: none !important;
                }

                [data-exhibitions-filter="ongoing"]
                [data-exhibitions-grid]
                > [data-exhibition-status="ongoing"]:nth-child(n + 7 of [data-exhibition-status="ongoing"]) {
                    display: none !important;
                }

                /* Upcoming */
                [data-exhibitions-filter="upcoming"]
                [data-exhibitions-grid]
                > [data-exhibition-status]:not([data-exhibition-status="upcoming"]) {
                    display: none !important;
                }

                [data-exhibitions-filter="upcoming"]
                [data-exhibitions-grid]
                > [data-exhibition-status="upcoming"]:nth-child(n + 7 of [data-exhibition-status="upcoming"]) {
                    display: none !important;
                }

                /* Finished */
                [data-exhibitions-filter="finished"]
                [data-exhibitions-grid]
                > [data-exhibition-status]:not([data-exhibition-status="finished"]) {
                    display: none !important;
                }

                [data-exhibitions-filter="finished"]
                [data-exhibitions-grid]
                > [data-exhibition-status="finished"]:nth-child(n + 7 of [data-exhibition-status="finished"]) {
                    display: none !important;
                }

            `}</style>
        </div>
    );
}