export type ExhibitionStatus =
    | "all"
    | "ongoing"
    | "upcoming"
    | "finished";

interface ExhibitionDateRange {
    start_date: string;
    end_date: string;
}

export function getExhibitionStatus(
    exhibition: ExhibitionDateRange,
    today: string
): Exclude<ExhibitionStatus, "all"> {
    if (exhibition.start_date > today) {
        return "upcoming";
    }

    if (
        exhibition.start_date <= today &&
        exhibition.end_date >= today
    ) {
        return "ongoing";
    }

    return "finished";
}