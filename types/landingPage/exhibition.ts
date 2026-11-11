// types\landingPage\exhibition.ts
export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ExhibitionImage {
    public_id: string;
    url: string;
}

export interface ExhibitionMedia extends ExhibitionImage {
    type: "image" | "video";
}

export interface ExhibitionLocation {
    address: LocalizedText;
    google_map: string;
}

export interface ExhibitionStat {
    value: string;
    title: LocalizedText;
}

export interface ExhibitionAboutCard {
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
}

export interface ExhibitionAboutSection {
    cards: ExhibitionAboutCard[];
}

export interface ExhibitionSpeaker {
    id?: string;
    name: LocalizedText;
    title: LocalizedText;
    image?: ExhibitionImage | null;
}

export interface ExhibitionPartner {
    id?: string;
    name?: LocalizedText;
    logo: ExhibitionImage;
}

export interface Exhibition {
    id: string;

    slug: string;

    title: LocalizedText;

    description: LocalizedText;

    meta: LocalizedText;

    start_date: string;

    end_date: string;

    location: ExhibitionLocation;

    category_ids: string[];

    series_id: string;

    sector_ids: string[];

    speakers: ExhibitionSpeaker[];

    partners: ExhibitionPartner[];

    stats: ExhibitionStat[];

    about_section: ExhibitionAboutSection;

    main_image: ExhibitionImage | null;

    main_video: ExhibitionImage | null;

    exhibition_logo: ExhibitionImage | null;

    portfolio_pdf: {
        public_id: string;
        url: string;
        original_filename?: string;
        format?: string;
        bytes?: number;
    } | null;

    gallery: ExhibitionMedia[];

    is_active: boolean;

    version: string;

    created_at: string | null;

    updated_at: string | null;
}
