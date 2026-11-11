export interface SocialLink {
    id: string;
    label: string;
    platform: string;
    url: string;
    active: boolean;
}

export interface SocialSettings {
    socials: SocialLink[];
}

export interface LocalizedText {
    ar: string;
    en: string;
}

export interface ContactPhone {
    id: string;
    label: string;
    number: string;
    active: boolean;
}

export interface ContactEmail {
    id: string;
    label: string;
    email: string;
    active: boolean;
    location?: LocalizedText;
    mapUrl?: string;
}

export interface ContactSettings {
    phones: ContactPhone[];
    emails: ContactEmail[];
    workingHours: LocalizedText;
}