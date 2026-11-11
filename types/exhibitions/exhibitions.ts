export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ExhibitionImage {
    url: string;
    public_id: string;
}

export interface ExhibitionsHero {
    title: LocalizedText;
    description: LocalizedText;
    image: ExhibitionImage;
}

export interface ExhibitionsSeo {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText;
}

export interface ExhibitionsData {
    hero: ExhibitionsHero;
    seo: ExhibitionsSeo;
    updated_at?: Date | null;
}