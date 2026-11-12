// app\[locale]\exhibitions\page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import HeroSection from "@/components/sections/exhibition/AllExhibition/HeroSection";
import ExhibitionsSection from "@/components/sections/exhibition/AllExhibition/ExhibitionsSection";
import CTASection from "@/components/sections/home/CTASection";
import { getExhibitionsData } from "@/lib/data/exhibitions/getExhibitionsData";
import { getExhibitions } from "@/lib/data/landingPage/exhibitions";
import { getTodayDate } from "@/lib/data/getTodayDate";
import {
    locales,
    type Locale,
} from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site";

const EXHIBITIONS_PER_PAGE = 9;

const EXHIBITIONS_SEO_FALLBACK: Record<
    Locale,
    {
        title: string;
        description: string;
        keywords: string[];
    }
> = {
    ar: {
        title: "المعارض والفعاليات | Event Maker",
        description:
            "اكتشف المعارض والفعاليات القادمة مع Event Maker، وتعرّف على تفاصيل المعارض المتاحة وسجّل للمشاركة أو الزيارة.",
        keywords: [
            "Event Maker",
            "المعارض",
            "المعارض القادمة",
            "الفعاليات",
            "المؤتمرات",
            "حجز المعارض",
        ],
    },
    en: {
        title: "Exhibitions and Events | Event Maker",
        description:
            "Discover upcoming exhibitions and events with Event Maker. Explore exhibition details and register to attend or participate.",
        keywords: [
            "Event Maker",
            "Exhibitions",
            "Upcoming Exhibitions",
            "Events",
            "Conferences",
            "Exhibition Registration",
        ],
    },
};

interface ExhibitionsPageProps {
    params: Promise<{
        locale: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

interface ExhibitionsContentProps {
    locale: Locale;
    searchParams: ExhibitionsPageProps["searchParams"];
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getCurrentPage(page?: string): number {
    const parsedPage = Number(page);

    return Number.isInteger(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;
}

function getLocalizedValue(
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

function getKeywords(
    value: unknown,
    fallback: string[]
): string[] {
    if (typeof value !== "string" || !value.trim()) {
        return fallback;
    }

    const keywords = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    return keywords.length > 0 ? keywords : fallback;
}

function getValidImageUrl(
    value: unknown
): string | undefined {
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


function getExhibitionsCanonical(locale: Locale, page: number): string {
    const path = locale === "ar" ? "/exhibitions/" : "/en/exhibitions/";
    const url = absoluteUrl(path);

    if (page <= 1) return url;

    return `${url}?page=${page}`;
}


// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata({
    params,
    searchParams,
}: ExhibitionsPageProps): Promise<Metadata> {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        return {};
    }

    const currentLocale = locale as Locale;
    const isArabic = currentLocale === "ar";

    const query = await searchParams;
    const currentPage = getCurrentPage(query.page);

    let exhibitionsData:
        | Awaited<ReturnType<typeof getExhibitionsData>>
        | null = null;

    try {
        exhibitionsData = await getExhibitionsData();
    } catch (error) {
        console.error(
            "[Exhibitions Metadata] Failed to fetch SEO data:",
            error
        );
    }

    const fallback =
        EXHIBITIONS_SEO_FALLBACK[currentLocale];

    const seo = exhibitionsData?.seo;

    const firebaseTitle = getLocalizedValue(
        seo?.title,
        currentLocale
    );

    const firebaseDescription = getLocalizedValue(
        seo?.description,
        currentLocale
    );

    const firebaseKeywords = getLocalizedValue(
        seo?.keywords,
        currentLocale
    );

    const title = firebaseTitle || fallback.title;

    const description =
        firebaseDescription || fallback.description;

    const keywords = getKeywords(
        firebaseKeywords,
        fallback.keywords
    );

    const canonicalUrl = getExhibitionsCanonical(
        currentLocale,
        currentPage
    );

    const arabicUrl = getExhibitionsCanonical(
        "ar",
        currentPage
    );

    const englishUrl = getExhibitionsCanonical(
        "en",
        currentPage
    );

    const image = getValidImageUrl(
        exhibitionsData?.hero?.image?.url
    );

    return {
        title,
        description,
        keywords,

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: arabicUrl,
                en: englishUrl,
                "x-default": arabicUrl,
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
            ...(image
                ? {
                    images: [
                        {
                            url: image,
                            alt: title,
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
            index: true,
            follow: true,
        },
    };
}

// --------------------------------------------------
// Exhibitions Content
// --------------------------------------------------

async function ExhibitionsContent({
    locale,
    searchParams,
}: ExhibitionsContentProps) {
    // Runtime searchParams are accessed inside the Suspense boundary.
    const [{ page }, today, allExhibitions] = await Promise.all([
        searchParams,
        getTodayDate(),
        getExhibitions(),
    ]);

    const currentPage = getCurrentPage(page);

    const totalPages = Math.ceil(
        allExhibitions.length / EXHIBITIONS_PER_PAGE
    );

    const safePage =
        totalPages > 0
            ? Math.min(currentPage, totalPages)
            : 1;

    const startIndex =
        (safePage - 1) * EXHIBITIONS_PER_PAGE;

    const paginatedExhibitions = allExhibitions.slice(
        startIndex,
        startIndex + EXHIBITIONS_PER_PAGE
    );

    return (
        <ExhibitionsSection
            locale={locale}
            exhibitions={paginatedExhibitions}
            currentPage={safePage}
            totalPages={totalPages}
            today={today}
        />
    );
}

// --------------------------------------------------
// Exhibitions Page
// --------------------------------------------------

export default async function ExhibitionsPage({
    params,
    searchParams,
}: ExhibitionsPageProps) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;

    const exhibitionsData = await getExhibitionsData();

    if (!exhibitionsData) {
        notFound();
    }

    return (
        <main>
            <HeroSection
                locale={currentLocale}
                hero={exhibitionsData.hero}
            />

            <Suspense
                fallback={
                    <section
                        className="min-h-[500px]"
                        aria-label={
                            currentLocale === "ar"
                                ? "جاري تحميل المعارض"
                                : "Loading exhibitions"
                        }
                    />
                }
            >
                <ExhibitionsContent
                    locale={currentLocale}
                    searchParams={searchParams}
                />
            </Suspense>

            <CTASection locale={currentLocale} />
        </main>
    );
}
