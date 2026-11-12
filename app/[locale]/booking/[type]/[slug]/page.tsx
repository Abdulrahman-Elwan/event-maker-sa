
// app/[locale]/booking/[type]/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getExhibitions, getExhibitionBySlug, } from "@/lib/data/landingPage/exhibitions";
import BookingPage from "@/components/booking/BookingPage";
import { absoluteUrl } from "@/lib/site";

type BookingType = "visitor" | "exhibitor" | "general";

interface BookingRouteProps {
    params: Promise<{
        locale: string;
        type: string;
        slug: string;
    }>;
}

const BOOKING_TYPES: BookingType[] = [
    "visitor",
    "exhibitor",
    "general",
];

const BOOKING_LABELS: Record<
    BookingType,
    Record<Locale, string>
> = {
    visitor: {
        ar: "حجز زائر",
        en: "Visitor Registration",
    },
    exhibitor: {
        ar: "حجز عارض",
        en: "Exhibitor Registration",
    },
    general: {
        ar: "التسجيل",
        en: "Registration",
    },
};

function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

function isValidBookingType(
    type: string
): type is BookingType {
    return BOOKING_TYPES.includes(type as BookingType);
}

function getLocalizedText(
    value: unknown,
    locale: Locale
): string | undefined {
    if (!value || typeof value !== "object") {
        return undefined;
    }

    const localizedValue = value as Record<string, unknown>;
    const text = localizedValue[locale];

    return typeof text === "string" && text.trim()
        ? text.trim()
        : undefined;
}

function getValidImageUrl(value: unknown): string | undefined {
    if (typeof value !== "string" || !value.trim()) {
        return undefined;
    }

    try {
        const url = new URL(value);

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

function getBookingUrl(locale: Locale, type: BookingType, slug: string): string {
    const localePath = locale === "en" ? "/en" : "";
    return absoluteUrl(
        `${localePath}/booking/${type}/${encodeURIComponent(slug)}`
    );
}

// --------------------------------------------------
// Static Params
// --------------------------------------------------

export async function generateStaticParams() {
    const exhibitions = await getExhibitions();

    return locales.flatMap((locale) =>
        exhibitions.flatMap((exhibition) =>
            BOOKING_TYPES.map((type) => ({
                locale,
                type,
                slug: exhibition.slug,
            }))
        )
    );
}

// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata({
    params,
}: BookingRouteProps): Promise<Metadata> {
    const { locale, type, slug } = await params;

    if (
        !isValidLocale(locale) ||
        !isValidBookingType(type)
    ) {
        return {};
    }

    const currentLocale = locale;
    const currentType = type;

    const exhibition = await getExhibitionBySlug(slug);

    if (!exhibition || !exhibition.is_active) {
        return {};
    }

    // Get the exhibition title in the current language only.
    const exhibitionTitle = getLocalizedText(
        exhibition.title,
        currentLocale
    );

    if (!exhibitionTitle) {
        return {};
    }

    const bookingLabel =
        BOOKING_LABELS[currentType][currentLocale];

    // Generate unique metadata for each exhibition and booking type.
    const title =
        currentLocale === "ar"
            ? `${bookingLabel} - ${exhibitionTitle} | Event Maker`
            : `${bookingLabel} - ${exhibitionTitle} | Event Maker`;

    const description =
        currentLocale === "ar"
            ? `أكمل نموذج ${bookingLabel} للمشاركة في ${exhibitionTitle}. سجّل بياناتك من خلال منصة Event Maker.`
            : `Complete your ${bookingLabel.toLowerCase()} form for ${exhibitionTitle}. Register your details through Event Maker.`;

    const canonicalUrl = getBookingUrl(
        currentLocale,
        currentType,
        slug
    );

    const image = getValidImageUrl(
        exhibition.main_image?.url
    );

    return {
        title,
        description,

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            type: "website",
            siteName: "Event Maker",
            url: canonicalUrl,
            title,
            description,
            locale:
                currentLocale === "ar"
                    ? "ar_SA"
                    : "en_SA",
            ...(image
                ? {
                    images: [
                        {
                            url: image,
                            alt: exhibitionTitle,
                        },
                    ],
                }
                : {}),
        },

        twitter: {
            card: image
                ? "summary_large_image"
                : "summary",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },

        robots: {
            index: false,
            follow: true,
        },
    };
}

// --------------------------------------------------
// Booking Page
// --------------------------------------------------

export default async function BookingRoute({
    params,
}: BookingRouteProps) {
    const { locale, type, slug } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    if (!isValidBookingType(type)) {
        notFound();
    }

    const exhibition = await getExhibitionBySlug(slug);

    if (!exhibition || !exhibition.is_active) {
        notFound();
    }

    return (
        <BookingPage
            locale={locale}
            type={type}
            exhibition={exhibition}
        />
    );
}
