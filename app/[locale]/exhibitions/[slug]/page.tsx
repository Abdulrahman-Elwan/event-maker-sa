
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

import {
    getExhibitionBySlug,
    getExhibitions,
    getPreviousEditions,
} from "@/lib/data/landingPage/exhibitions";

import ExhibitionHero from "@/components/sections/exhibition/ExhibitionHero";
import ExhibitionAbout from "@/components/sections/exhibition/ExhibitionAbout";
import PreviousEditionsSection from "@/components/sections/exhibition/PreviousEditionsSection";
import ExhibitionSpeakersSection from "@/components/sections/exhibition/ExhibitionSpeakersSection";
import ExhibitionPartnersSection from "@/components/sections/exhibition/ExhibitionPartnersSection";
import RegistrationSection from "@/components/registration/RegistrationSection";
import ExhibitionMainOverview from "@/components/sections/exhibition/ExhibitionMainOverview";
import ExhibitionGallerySection from "@/components/sections/exhibition/ExhibitionGallerySection";
import ExhibitionSectorsSection from "@/components/sections/exhibition/ExhibitionSectorsSection";

import { getExhibitionStatus } from "@/lib/utils/exhibition";
import { getExhibitionSectors } from "@/lib/data/landingPage/getExhibitionSectors";
import { getTodayDate } from "@/lib/data/getTodayDate";

const SITE_URL = "https://event-maker.sa";

interface ExhibitionDetailsPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

function getLocalizedValue(
    value: {
        ar: string;
        en: string;
    } | undefined,
    locale: Locale,
): string | undefined {
    const localizedValue = value?.[locale];

    if (
        typeof localizedValue !== "string" ||
        !localizedValue.trim()
    ) {
        return undefined;
    }

    return localizedValue.trim();
}

function getValidImageUrl(
    value: unknown,
): string | undefined {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
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

function getExhibitionUrl(
    locale: Locale,
    slug: string,
): string {
    const encodedSlug = encodeURIComponent(slug);

    return locale === "ar"
        ? `${SITE_URL}/exhibitions/${encodedSlug}`
        : `${SITE_URL}/en/exhibitions/${encodedSlug}`;
}

export async function generateStaticParams() {
    const exhibitions = await getExhibitions();

    return locales.flatMap((locale) =>
        exhibitions.map((exhibition) => ({
            locale,
            slug: exhibition.slug,
        })),
    );
}

export async function generateMetadata({
    params,
}: ExhibitionDetailsPageProps): Promise<Metadata> {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) {
        return {};
    }

    const currentLocale = locale;

    const exhibition = await getExhibitionBySlug(slug);

    if (!exhibition || !exhibition.is_active) {
        return {};
    }

    // SEO title: current exhibition + current language only.
    const title =
        getLocalizedValue(
            exhibition.title,
            currentLocale,
        );

    // Description: use the same exhibition and language.
    const description =
        getLocalizedValue(
            exhibition.description,
            currentLocale,
        ) ??
        getLocalizedValue(
            exhibition.meta,
            currentLocale,
        );

    const canonicalUrl = getExhibitionUrl(
        currentLocale,
        exhibition.slug,
    );

    const arabicTitle = getLocalizedValue(
        exhibition.title,
        "ar",
    );

    const englishTitle = getLocalizedValue(
        exhibition.title,
        "en",
    );

    const languages: Record<string, string> = {};

    // Add only language versions that have an actual localized title.
    if (arabicTitle) {
        languages.ar = getExhibitionUrl(
            "ar",
            exhibition.slug,
        );

        // Arabic is the default website language.
        languages["x-default"] = getExhibitionUrl(
            "ar",
            exhibition.slug,
        );
    }

    if (englishTitle) {
        languages.en = getExhibitionUrl(
            "en",
            exhibition.slug,
        );
    }

    const imageUrl = getValidImageUrl(
        exhibition.main_image?.url,
    );

    return {
        // Prevent inheriting a generic parent title when this
        // exhibition has no title in the current language.
        title: {
            absolute: title ?? "",
        },

        // No fixed description fallback.
        description: description ?? "",

        // The Exhibition data model currently has no keywords field.
        // An empty array prevents generic parent keywords from being inherited.
        keywords: [],

        alternates: {
            canonical: canonicalUrl,
            languages,
        },

        openGraph: {
            title: title ?? "",
            description: description ?? "",
            url: canonicalUrl,
            type: "website",
            locale:
                currentLocale === "ar"
                    ? "ar_SA"
                    : "en_SA",
            alternateLocale:
                currentLocale === "ar"
                    ? ["en_SA"]
                    : ["ar_SA"],
            images: imageUrl
                ? [
                    {
                        url: imageUrl,
                        alt: title ?? "",
                    },
                ]
                : undefined,
        },

        twitter: {
            card: imageUrl
                ? "summary_large_image"
                : "summary",
            title: title ?? "",
            description: description ?? "",
            images: imageUrl
                ? [imageUrl]
                : undefined,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ExhibitionDetailsPage({
    params,
}: ExhibitionDetailsPageProps) {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const currentLocale = locale;

    const exhibition = await getExhibitionBySlug(slug);

    if (!exhibition || !exhibition.is_active) {
        notFound();
    }

    const today = await getTodayDate();

    const exhibitionStatus = getExhibitionStatus(
        exhibition,
        today,
    );

    const [previousEditions, sectors] = await Promise.all([
        getPreviousEditions(exhibition),
        getExhibitionSectors(exhibition.sector_ids),
    ]);

    return (
        <main
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
            className="min-h-screen bg-(--theme-background) text-(--theme-text)"
        >
            <ExhibitionHero
                locale={currentLocale}
                exhibition={exhibition}
                today={today}
            />

            <ExhibitionMainOverview
                locale={currentLocale}
                exhibition={exhibition}
            />

            <ExhibitionAbout
                locale={currentLocale}
                exhibition={exhibition}
            />

            {sectors.length > 0 && (
                <ExhibitionSectorsSection
                    locale={currentLocale}
                    sectors={sectors}
                />
            )}

            {exhibition.gallery.length > 0 && (
                <ExhibitionGallerySection
                    locale={currentLocale}
                    exhibition={exhibition}
                />
            )}

            {previousEditions.length > 0 && (
                <PreviousEditionsSection
                    locale={currentLocale}
                    exhibitions={previousEditions}
                />
            )}

            {exhibition.speakers.length > 0 && (
                <ExhibitionSpeakersSection
                    locale={currentLocale}
                    speakers={exhibition.speakers}
                />
            )}

            {exhibition.partners.length > 0 && (
                <ExhibitionPartnersSection
                    locale={currentLocale}
                    partners={exhibition.partners}
                />
            )}

            {exhibitionStatus !== "finished" && (
                <RegistrationSection
                    locale={currentLocale}
                    exhibition={exhibition}
                />
            )}
        </main>
    );
}
