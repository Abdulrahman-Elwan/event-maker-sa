import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesStorySection from "@/components/sections/services/ServicesStorySection";
import ServicesExplorerSection from "@/components/sections/services/ServicesExplorerSection";
import ServicesWhyUsSection from "@/components/sections/services/ServicesWhyUsSection";
import CTASection from "@/components/sections/home/CTASection";
import { getServicesData } from "@/lib/data/services/getServicesData";
import {
    locales,
    type Locale,
} from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site";

interface ServicesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

/* -------------------------------------------------------------------------- */
/* SEO Fallback                                                               */
/* -------------------------------------------------------------------------- */

const SERVICES_SEO_FALLBACK: Record<
    Locale,
    {
        title: string;
        description: string;
        keywords: string[];
    }
> = {
    ar: {
        title: "خدمات تنظيم المعارض والفعاليات | Event Maker",
        description:
            "اكتشف خدمات Event Maker المتخصصة في تنظيم وإدارة المعارض والفعاليات وتقديم الحلول المتكاملة للشركات والجهات المنظمة.",
        keywords: [
            "خدمات تنظيم المعارض",
            "خدمات تنظيم الفعاليات",
            "إدارة المعارض",
            "إدارة الفعاليات",
            "Event Maker",
            "إيفنت ميكر",
        ],
    },

    en: {
        title: "Exhibition and Event Services | Event Maker",
        description:
            "Explore Event Maker services for exhibition and event planning, management, and integrated solutions for businesses and organizers.",
        keywords: [
            "Exhibition services",
            "Event management services",
            "Exhibition management",
            "Event planning",
            "Event Maker",
        ],
    },
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

function getLocalizedValue(
    value: unknown,
    locale: Locale,
): string | undefined {
    if (!value || typeof value !== "object") {
        return undefined;
    }

    const localizedValue = (
        value as Record<string, unknown>
    )[locale];

    if (
        typeof localizedValue !== "string" ||
        !localizedValue.trim()
    ) {
        return undefined;
    }

    return localizedValue.trim();
}

function getLocalizedKeywords(
    value: unknown,
    locale: Locale,
): string[] {
    if (!value || typeof value !== "object") {
        return [];
    }

    const localizedValue = (
        value as Record<string, unknown>
    )[locale];

    if (typeof localizedValue === "string") {
        return localizedValue
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean);
    }

    if (Array.isArray(localizedValue)) {
        return localizedValue
            .filter(
                (keyword): keyword is string =>
                    typeof keyword === "string",
            )
            .map((keyword) => keyword.trim())
            .filter(Boolean);
    }

    return [];
}

function getServicesUrl(locale: Locale): string {
    return locale === "ar" ? absoluteUrl("/services") : absoluteUrl("/en/services");
}

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
    params,
}: ServicesPageProps): Promise<Metadata> {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        return {};
    }

    const currentLocale = locale;

    const canonicalUrl = getServicesUrl(currentLocale);

    // Firebase data may be unavailable or incomplete.
    let servicesData: Awaited<
        ReturnType<typeof getServicesData>
    > = null;

    try {
        servicesData = await getServicesData();
    } catch (error) {
        console.error(
            "Failed to fetch Services SEO metadata:",
            error,
        );
    }

    const seo = servicesData?.seo;

    // Use Firebase values when available.
    // Otherwise, use the fallback for the current language.
    const title =
        getLocalizedValue(
            seo?.title,
            currentLocale,
        ) ??
        SERVICES_SEO_FALLBACK[currentLocale].title;

    const description =
        getLocalizedValue(
            seo?.description,
            currentLocale,
        ) ??
        SERVICES_SEO_FALLBACK[currentLocale].description;

    const firebaseKeywords = getLocalizedKeywords(
        seo?.keywords,
        currentLocale,
    );

    const keywords =
        firebaseKeywords.length > 0
            ? firebaseKeywords
            : SERVICES_SEO_FALLBACK[currentLocale].keywords;

    return {
        title,
        description,
        keywords,

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: getServicesUrl("ar"),
                en: getServicesUrl("en"),
                "x-default": getServicesUrl("ar"),
            },
        },

        openGraph: {
            title,
            description,
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
        },

        twitter: {
            card: "summary",
            title,
            description,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

/* -------------------------------------------------------------------------- */
/* Services Page                                                              */
/* -------------------------------------------------------------------------- */

export default async function ServicesPage({
    params,
}: ServicesPageProps) {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const currentLocale = locale;

    const services = await getServicesData();

    if (!services) {
        notFound();
    }

    return (
        <main
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
        >
            <ServicesHero
                locale={currentLocale}
                hero={services.hero}
            />

            <ServicesStorySection
                locale={currentLocale}
                content={services.content}
            />

            <ServicesExplorerSection
                locale={currentLocale}
                services={services.services}
            />

            <ServicesWhyUsSection
                locale={currentLocale}
                whyUs={services.whyUs}
            />

            <CTASection
                locale={currentLocale}
            />
        </main>
    );
}
