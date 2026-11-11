
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

import { getServiceBySlug } from "@/lib/data/services/getServiceBySlug";
import { getServicesData } from "@/lib/data/services/getServicesData";

import ServiceHero from "@/components/sections/services/details/ServiceHero";
import ServiceIntroductionSection from "@/components/sections/services/details/ServiceIntroductionSection";
import ServiceFeaturesSection from "@/components/sections/services/details/ServiceFeaturesSection";
import ServiceUsageFieldsSection from "@/components/sections/services/details/ServiceUsageFieldsSection";
import ServiceGallerySection from "@/components/sections/services/details/ServiceGallerySection";
import ServiceCTASection from "@/components/sections/services/details/ServiceCTASection";

const SITE_URL = "https://event-maker.sa";

interface ServicePageProps {
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

function getServiceUrl(
    locale: Locale,
    slug: string,
): string {
    const encodedSlug = encodeURIComponent(slug);

    return locale === "ar"
        ? `${SITE_URL}/services/${encodedSlug}`
        : `${SITE_URL}/en/services/${encodedSlug}`;
}

export async function generateStaticParams() {
    const data = await getServicesData();

    const services = Array.isArray(data?.services)
        ? data.services
        : [];

    return locales.flatMap((locale) =>
        services
            .filter(
                (service) =>
                    typeof service?.slug === "string" &&
                    service.slug.trim().length > 0,
            )
            .map((service) => ({
                locale,
                slug: service.slug,
            })),
    );
}

export async function generateMetadata({
    params,
}: ServicePageProps): Promise<Metadata> {
    const { locale: localeParam, slug } = await params;

    if (!isValidLocale(localeParam)) {
        return {};
    }

    const locale = localeParam;

    const service = await getServiceBySlug(slug);

    if (!service) {
        return {};
    }

    // Title from the current service and current language.
    const title = getLocalizedValue(
        service.title,
        locale,
    );

    // Description from the current service and current language.
    const description =
        getLocalizedValue(
            service.shortDescription,
            locale,
        ) ??
        getLocalizedValue(
            service.mainDescription,
            locale,
        );

    const canonicalUrl = getServiceUrl(
        locale,
        service.slug,
    );

    const arabicTitle = getLocalizedValue(
        service.title,
        "ar",
    );

    const englishTitle = getLocalizedValue(
        service.title,
        "en",
    );

    const languages: Record<string, string> = {};

    if (arabicTitle) {
        languages.ar = getServiceUrl(
            "ar",
            service.slug,
        );

        languages["x-default"] = getServiceUrl(
            "ar",
            service.slug,
        );
    }

    if (englishTitle) {
        languages.en = getServiceUrl(
            "en",
            service.slug,
        );
    }

    const imageUrl = getValidImageUrl(
        service.coverImage?.url,
    );

    // Generate keywords from the actual service name only.
    const keywords = Array.from(
        new Set(
            [arabicTitle, englishTitle]
                .filter(
                    (value): value is string =>
                        Boolean(value),
                ),
        ),
    );

    return {
        title: {
            absolute: title ?? "",
        },

        description: description ?? "",

        keywords,

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
                locale === "ar"
                    ? "ar_SA"
                    : "en_SA",
            alternateLocale:
                locale === "ar"
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

export default async function ServicePage({
    params,
}: ServicePageProps) {
    const { locale: localeParam, slug } = await params;

    if (!isValidLocale(localeParam)) {
        notFound();
    }

    const locale = localeParam;

    const service = await getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return (
        <main dir={locale === "ar" ? "rtl" : "ltr"}>
            <ServiceHero
                locale={locale}
                service={service}
            />

            <ServiceIntroductionSection
                locale={locale}
                service={service}
            />

            <ServiceFeaturesSection
                locale={locale}
                service={service}
            />

            <ServiceUsageFieldsSection
                locale={locale}
                service={service}
            />

            <ServiceGallerySection
                locale={locale}
                service={service}
            />

            <ServiceCTASection
                locale={locale}
                service={service}
            />
        </main>
    );
}
