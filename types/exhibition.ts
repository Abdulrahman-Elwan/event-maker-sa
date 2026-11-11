// types\exhibition.ts
export interface ExhibitionImage {
    public_id: string;
    url: string;
}

export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ExhibitionLocation {
    address: LocalizedText;
    google_map: string;
}

export interface Exhibition {
    id: string;
    slug: string;

    title: LocalizedText;
    description: LocalizedText;
    meta: LocalizedText;

    start_date: string;
    end_date: string;

    is_active: boolean;

    main_image: ExhibitionImage | null;
    main_video: string | null;

    gallery: ExhibitionImage[];
    partners: ExhibitionImage[];

    location: ExhibitionLocation;

    category_ids: string[];
    sector_ids: string[];

    speakers: unknown[];
    stats: {
        title: LocalizedText;
        value: string;
    }[];

    about_section: {
        cards: {
            title: LocalizedText;
            description: LocalizedText;
            icon: string;
        }[];
    };

    created_at: string | null;
    updated_at: string | null;
    version: string | null;
}