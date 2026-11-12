// app\[locale]\layout.tsx
import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { locales, type Locale } from "@/lib/i18n/config";
import { getActiveTheme } from "@/lib/data/theme";
import { getHomepageSettings } from "@/lib/data/homepage";
import { getServices } from "@/lib/data/services";
import { getContactSettings, getSocialSettings, getCompanyProfileUrl } from "@/lib/data/siteSettings";
import { getTodayDate } from "@/lib/data/getTodayDate";
import "../globals.css";
import WhatsappIcon from "@/components/layout/WhatsappIcon";
import CookieConsent from "@/components/layout/CookieConsent";
import { SITE_URL } from "@/lib/site";

/* Fonts */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Google Fonts URL */
function getGoogleFontsUrl(arabicFont: string, englishFont: string) {
  const params = new URLSearchParams();
  params.append("family", arabicFont);
  if (englishFont !== arabicFont) {
    params.append("family", englishFont);
  }
  params.append("display", "swap");
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

/* Metadata */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Event Maker",
    template: "%s | Event Maker",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/* Locale Layout */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const isArabic = currentLocale === "ar";

  /* Global Website Data */
  const [homepageSettings, services, contactSettings, socialSettings, companyProfileUrl, today] =
    await Promise.all([
      getHomepageSettings(),
      getServices(),
      getContactSettings(),
      getSocialSettings(),
      getCompanyProfileUrl(),
      getTodayDate(),
    ]);
  const currentYear = Number(today.slice(0, 4));
  /* Active Theme */
  const theme = await getActiveTheme(homepageSettings);

  /* Google Fonts */
  const googleFontsUrl = getGoogleFontsUrl(theme.arabicFont, theme.englishFont);

  /* Theme Variables */
  const themeStyles = {
    "--theme-primary": theme.primaryColor,
    "--theme-secondary": theme.secondaryColor,
    "--theme-background": theme.backgroundColor,
    "--theme-text": theme.textColor,
    "--theme-font-ar": `"${theme.arabicFont}"`,
    "--theme-font-en": `"${theme.englishFont}"`,
  } as CSSProperties;

  return (
    <html
      lang={isArabic ? "ar" : "en"}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={googleFontsUrl} />
      </head>

      <body className="min-h-full flex flex-col" style={themeStyles}>
        <Suspense fallback={<div className="h-20" aria-hidden="true" />}>
          <Navbar locale={currentLocale} companyProfileUrl={companyProfileUrl} />
        </Suspense>

        {children}

        <Footer
          locale={currentLocale}
          contact={contactSettings}
          socials={socialSettings}
          services={services}
          currentYear={currentYear}
        />

        <WhatsappIcon locale={currentLocale} contact={contactSettings} />

        <CookieConsent locale={currentLocale} />
      </body>
    </html>
  );
}
