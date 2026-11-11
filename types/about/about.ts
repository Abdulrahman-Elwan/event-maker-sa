
export interface LocalizedText {
    ar: string;
    en: string;
}

export interface AboutImage {
    url: string;
    public_id: string;
}

export interface AboutHero {
    title: LocalizedText;
    description: LocalizedText;
    image: AboutImage;
}

export interface AboutContent {
    content_ar: string;
    content_en: string;
    main_image: AboutImage;
    secondary_image_1: AboutImage;
    secondary_image_2: AboutImage;
}

export interface AboutPartners {
    title: LocalizedText;
    description: LocalizedText;
    official: string[];
    others: string[];
}

export interface AboutStat {
    title: LocalizedText;
    value: string;
}

export interface AboutStats {
    title: LocalizedText;
    description: LocalizedText;
    stats: AboutStat[];
}

export interface AboutTeamMember {
    image: string;
    name: LocalizedText;
    position: LocalizedText;
}

export interface AboutTeam {
    title: LocalizedText;
    description: LocalizedText;
    members: AboutTeamMember[];
}

export interface AboutWhyUsFeature {
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
}

export interface AboutWhyUs {
    title: LocalizedText;
    description: LocalizedText;
    features: AboutWhyUsFeature[];
}

export interface AboutSEO {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText;
}

export interface AboutData {
    hero: AboutHero;
    content: AboutContent;
    partners: AboutPartners;
    stats: AboutStats;
    team: AboutTeam;
    whyUs: AboutWhyUs;
    seo: AboutSEO;
    updated_at: Date | null;
}
