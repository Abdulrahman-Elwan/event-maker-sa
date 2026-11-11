export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ExhibitionSector {
    id: string;
    slug: string;
    title: LocalizedText;
    meta_description: LocalizedText;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
}