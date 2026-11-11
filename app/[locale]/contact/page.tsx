
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

import ContactHero from "@/components/sections/contact/ContactHero";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactLocation from "@/components/sections/contact/ContactLocation";

import { getContactSettings } from "@/lib/data/siteSettings";

interface ContactPageProps {
    params: Promise<{
        locale: string;
    }>;
}

const SITE_URL = "https://event-maker.sa";

const CONTACT_URLS = {
    ar: `${SITE_URL}/contact`,
    en: `${SITE_URL}/en/contact`,
} as const;

const CONTACT_SEO = {
    ar: {
        title: "تواصل معنا | Event Maker",
        description:
            "تواصل مع Event Maker للاستفسار عن خدمات تنظيم المعارض والفعاليات والمؤتمرات، وناقش احتياجاتك مع فريقنا للحصول على الحلول المناسبة.",
    },
    en: {
        title: "Contact Us | Event Maker",
        description:
            "Contact Event Maker to learn more about our exhibition, event, and conference management services and discuss your project with our team.",
    },
} satisfies Record<
    Locale,
    {
        title: string;
        description: string;
    }
>;

// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata({
    params,
}: ContactPageProps): Promise<Metadata> {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        return {};
    }

    const currentLocale = locale as Locale;
    const isArabic = currentLocale === "ar";

    const seo = CONTACT_SEO[currentLocale];
    const canonicalUrl = CONTACT_URLS[currentLocale];

    return {
        title: seo.title,
        description: seo.description,

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: CONTACT_URLS.ar,
                en: CONTACT_URLS.en,
                "x-default": CONTACT_URLS.ar,
            },
        },

        openGraph: {
            type: "website",
            siteName: "Event Maker",
            url: canonicalUrl,
            title: seo.title,
            description: seo.description,
            locale: isArabic ? "ar_SA" : "en_SA",
            alternateLocale: isArabic
                ? ["en_SA"]
                : ["ar_SA"],
        },

        twitter: {
            card: "summary",
            title: seo.title,
            description: seo.description,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

// --------------------------------------------------
// Contact Page
// --------------------------------------------------

export default async function ContactPage({
    params,
}: ContactPageProps) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;

    const contactSettings = await getContactSettings();

    return (
        <main className="bg-(--theme-backgroundColor)">
            <ContactHero locale={currentLocale} />

            <section className="px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
                        <ContactInfo
                            locale={currentLocale}
                            settings={contactSettings}
                        />

                        <ContactForm locale={currentLocale} />
                    </div>

                    <ContactLocation locale={currentLocale} />
                </div>
            </section>
        </main>
    );
}
