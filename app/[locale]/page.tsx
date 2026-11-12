import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CompanyHome from "@/components/home/CompanyHome";
import ExhibitionLanding from "@/components/home/ExhibitionLanding";
import { getHomepageData, getHomeSEO, } from "@/lib/data/homepage";
import {
    locales,
    type Locale,
} from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site";

interface HomePageProps {
    params: Promise<{
        locale: string;
    }>;
}


/* Metadata */
export async function generateMetadata({ params, }: HomePageProps): Promise<Metadata> {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        return {};
    }

    const currentLocale = locale as Locale;
    const isArabic = currentLocale === "ar";
    const canonicalUrl = isArabic ? absoluteUrl("/") : absoluteUrl("/en");
    const homepage = await getHomepageData();

    let title: string | undefined;
    let description: string | undefined;
    let keywords: string | undefined;

    if (homepage.mode === "company") {
        const seo = await getHomeSEO();

        if (seo) {
            title = seo.title[currentLocale];
            description = seo.description[currentLocale];

            const localizedKeywords = seo.keywords?.[currentLocale];

            if (localizedKeywords?.trim()) {
                keywords = localizedKeywords.trim();
            }
        }
    } else {
        const exhibition = homepage.exhibition;

        if (exhibition) {
            title = exhibition.title[currentLocale];
            description = exhibition.description[currentLocale];
        }
    }

    return {
        ...(title?.trim() && {
            title: title.trim(),
        }),

        ...(description?.trim() && {
            description: description.trim(),
        }),

        ...(keywords && {
            keywords,
        }),

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: absoluteUrl("/"),
                en: absoluteUrl("/en"),
                "x-default": absoluteUrl("/"),
            },
        },

        openGraph: {
            type: "website",
            url: canonicalUrl,
            ...(title?.trim() && {
                title: title.trim(),
            }),
            ...(description?.trim() && {
                description: description.trim(),
            }),
            locale: isArabic ? "ar" : "en",
            alternateLocale: isArabic ? ["en"] : ["ar"],
        },

        twitter: {
            card: "summary_large_image",
            ...(title?.trim() && {
                title: title.trim(),
            }),
            ...(description?.trim() && {
                description: description.trim(),
            }),
        },
    };
}

/* Homepage */
export default async function HomePage({
    params,
}: HomePageProps) {

    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;
    const homepage = await getHomepageData();

    if (
        homepage.mode === "exhibition" &&
        homepage.exhibition
    ) {
        return (
            <ExhibitionLanding
                locale={currentLocale}
                exhibition={homepage.exhibition}
            />
        );
    }

    return (
        <CompanyHome locale={currentLocale} />
    );
}