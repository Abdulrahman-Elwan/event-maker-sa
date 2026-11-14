export type ExhibitionStatus =
    | "all"
    | "ongoing"
    | "upcoming"
    | "finished";

export interface ExhibitionDateRange {
    start_date: string;
    end_date: string;
}

export function normalizeExhibitionDate(
    value: string,
): string {
    if (!value) return "";

    // Exhibition dates are date-only values: YYYY-MM-DD.
    return value.slice(0, 10);
}

export function getExhibitionStatus(
    exhibition: ExhibitionDateRange,
    today: string,
): Exclude<ExhibitionStatus, "all"> {
    const startDate = normalizeExhibitionDate(
        exhibition.start_date,
    );

    const endDate = normalizeExhibitionDate(
        exhibition.end_date,
    );

    if (!startDate || !endDate) {
        return "finished";
    }

    if (startDate > today) {
        return "upcoming";
    }

    if (endDate >= today) {
        return "ongoing";
    }

    return "finished";
}