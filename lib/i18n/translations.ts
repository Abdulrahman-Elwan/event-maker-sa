// lib\i18n\translations.ts
import type { Locale } from "./config";

const translations = {
    ar: {
        nav: {
            home: "الرئيسية",
            about: "من نحن",
            services: "خدماتنا",
            exhibitions: "المعارض",
            blog: "المدونة",
            contact: "تواصل معنا",
            language: "En",
        },
    },

    en: {
        nav: {
            home: "Home",
            about: "About Us",
            services: "Services",
            exhibitions: "Exhibitions",
            blog: "Blog",
            contact: "Contact Us",
            language: "Ar",
        },
    },
} as const;

export function getTranslations(locale: Locale) {
    return translations[locale];
}