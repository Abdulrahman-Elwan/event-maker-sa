
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStorySection from "@/components/sections/about/AboutStorySection";
import AboutWhyUsSection from "@/components/sections/about/AboutWhyUsSection";
import AboutStatsSection from "@/components/sections/about/AboutStatsSection";
import OurTeamSection from "@/components/sections/about/OurTeamSection";
import PartnersSection from "@/components/sections/home/PartnersSection";

import { getAboutData } from "@/lib/data/about/getAboutData";

import {
    locales,
    type Locale,
} from "@/lib/i18n/config";

interface AboutPageProps {
    params: Promise<{
        locale: string;
    }>;
}

// Fallback metadata used only when Firebase SEO data is unavailable.
const ABOUT_SEO_FALLBACK: Record<
    Locale,
    {
        title: string;
        description: string;
        keywords: string[];
    }
> = {
    ar: {
        title: "من نحن | Event Maker",
        description:
            "تعرف على Event Maker وخبرتنا في تنظيم وإدارة المعارض والمؤتمرات والفعاليات.",
        keywords: [
            "Event Maker",
            "من نحن",
            "تنظيم المعارض",
            "إدارة المؤتمرات",
            "تنظيم الفعاليات",
        ],
    },
    en: {
        title: "About Us | Event Maker",
        description:
            "Learn more about Event Maker and our experience in organizing and managing exhibitions, conferences, and events.",
        keywords: [
            "Event Maker",
            "About Us",
            "Exhibition Management",
            "Conference Management",
            "Event Management",
        ],
    },
};

function getValidSocialImage(value: unknown): string | undefined {
    if (typeof value !== "string" || !value.trim()) {
        return undefined;
    }

    try {
        const url = new URL(value.trim());

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            return undefined;
        }

        return url.toString();
    } catch {
        return undefined;
    }
}

export async function generateMetadata({
    params,
}: AboutPageProps): Promise<Metadata> {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        return {};
    }

    const currentLocale = locale as Locale;
    const isArabic = currentLocale === "ar";

    let about: Awaited<ReturnType<typeof getAboutData>> | null = null;

    try {
        about = await getAboutData();
    } catch (error) {
        console.error(
            "[About Metadata] Failed to fetch About SEO data:",
            error
        );
    }

    const fallback = ABOUT_SEO_FALLBACK[currentLocale];

    const seo = about?.seo;

    const title =
        typeof seo?.title?.[currentLocale] === "string" &&
            seo.title[currentLocale].trim()
            ? seo.title[currentLocale].trim()
            : fallback.title;

    const description =
        typeof seo?.description?.[currentLocale] === "string" &&
            seo.description[currentLocale].trim()
            ? seo.description[currentLocale].trim()
            : fallback.description;

    const firebaseKeywords = seo?.keywords?.[currentLocale];

    const keywords =
        typeof firebaseKeywords === "string" &&
            firebaseKeywords.trim()
            ? firebaseKeywords.trim()
            : fallback.keywords;

    const ABOUT_URLS = {
        ar: absoluteUrl("/about"),
        en: absoluteUrl("/en/about"),
    } as const;

    const canonicalUrl = ABOUT_URLS[currentLocale];

    const socialImage = getValidSocialImage(
        about?.hero?.image?.url
    );

    return {
        title,
        description,
        keywords,

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: ABOUT_URLS.ar,
                en: ABOUT_URLS.en,
                "x-default": ABOUT_URLS.ar,
            },
        },

        openGraph: {
            type: "website",
            siteName: "Event Maker",
            url: canonicalUrl,
            title,
            description,
            locale: isArabic ? "ar_SA" : "en_SA",
            alternateLocale: isArabic
                ? ["en_SA"]
                : ["ar_SA"],

            ...(socialImage
                ? {
                    images: [
                        {
                            url: socialImage,
                            alt: title,
                        },
                    ],
                }
                : {}),
        },

        twitter: {
            card: socialImage
                ? "summary_large_image"
                : "summary",
            title,
            description,

            ...(socialImage
                ? {
                    images: [socialImage],
                }
                : {}),
        },
    };
}

export default async function AboutPage({
    params,
}: AboutPageProps) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;

    const about = await getAboutData();

    if (!about) {
        notFound();
    }

    return (
        <main>
            <AboutHero
                locale={currentLocale}
                hero={about.hero}
            />

            <AboutStorySection
                locale={currentLocale}
                content={about.content}
            />

            <AboutWhyUsSection
                locale={currentLocale}
                whyUs={about.whyUs}
            />

            <AboutStatsSection
                locale={currentLocale}
                stats={about.stats}
            />

            <OurTeamSection
                locale={currentLocale}
                team={about.team}
            />

            <PartnersSection
                locale={currentLocale}
                partners={about.partners}
            />
        </main>
    );
}
