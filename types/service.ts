export interface ServiceImage {
    public_id: string;
    url: string;
}

export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ServiceFeature {
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
}

export interface ServiceUsageField {
    items: LocalizedText[];
    images: ServiceImage[];
}

export interface Service {
    id: string;
    slug: string;
    order: number;

    title: LocalizedText;
    shortDescription: LocalizedText;
    mainDescription: LocalizedText;

    coverImage: ServiceImage | null;

    content: {
        main: {
            cta: LocalizedText;
            features: {
                title: LocalizedText;
                description: LocalizedText;
                items: LocalizedText[];
            };
        };
        introduction: {
            title: LocalizedText;
            description: LocalizedText;
            images: ServiceImage[];
        };
        usageFields: ServiceUsageField;
    };

    gallery: ServiceImage[];

    usageFields: {
        items: LocalizedText[];
        images: ServiceImage[];
    };
}