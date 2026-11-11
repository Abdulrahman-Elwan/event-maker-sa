// types\services\services.ts
export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ServiceImage {
    url: string;
    public_id: string;
}

export interface ServiceGalleryItem extends ServiceImage {
    type: "image" | string;
}

export interface ServiceFeatures {
    title: LocalizedText;
    description: LocalizedText;
    items: LocalizedText[];
}

export interface ServiceMainContent {
    cta: LocalizedText;
    features: ServiceFeatures;
    gallery: ServiceGalleryItem[];
    introduction: ServiceIntroduction;
    usageFields: ServiceUsageFields;
}

export interface ServiceIntroduction {
    title: LocalizedText;
    description: LocalizedText;
    images: ServiceImage[];
}

export interface ServiceUsageFields {
    items: LocalizedText[];
    images: ServiceImage[];
}

export interface ServiceItem {
    id: string;
    order: number;
    slug: string;

    title: LocalizedText;
    shortDescription: LocalizedText;
    mainDescription: LocalizedText;

    coverImage: ServiceImage;

    content: {
        main: ServiceMainContent;
    };
}

export interface ServicesHero {
    title: LocalizedText;
    description: LocalizedText;
    image: ServiceImage;
}

export interface ServicesContent {
    content_ar: string;
    content_en: string;

    main_image: ServiceImage;

    secondary_image_1: ServiceImage;
    secondary_image_2: ServiceImage;
}

export interface ServicesWhyUsFeature {
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
}

export interface ServicesWhyUs {
    title: LocalizedText;
    description: LocalizedText;
    features: ServicesWhyUsFeature[];
}

export interface ServicesSeo {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText;
}

export interface ServicesData {
    hero: ServicesHero;

    content: ServicesContent;

    services: ServiceItem[];

    whyUs: ServicesWhyUs;

    seo: ServicesSeo;

    updated_at?: unknown;
}