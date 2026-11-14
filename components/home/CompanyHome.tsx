// components/home/CompanyHome.tsx
import Hero from "@/components/sections/home/Hero";
import StatsSection from "@/components/sections/home/StatsSection";
import LatestPostsSection from "@/components/sections/home/LatestPostsSection";
import { getHeroSlides } from "@/lib/data/homepage";
import { getSessions } from "@/lib/data/getSessions";
import { getHomepageExhibitions } from "@/lib/data/landingPage/exhibitions";
import { getServices } from "@/lib/data/services";
import { getAboutData } from "@/lib/data/about/getAboutData";
import { getBlogPosts } from "@/lib/data/blog/getBlogPosts";
import { getTodayDate } from "@/lib/data/getTodayDate";
import { ServicesProvider } from "@/contexts/ServicesContext";
import type { Locale } from "@/lib/i18n/config";
import ExhibitionsSection from "../sections/home/ExhibitionsSection";
import ServicesSection from "../sections/home/ServicesSection";
import PartnersSection from "../sections/home/PartnersSection";
import SessionsSection from "../sections/home/SessionsSection";
import CTASection from "../sections/home/CTASection";

interface CompanyHomeProps {
    locale: Locale;
}

export default async function CompanyHome({
    locale,
}: CompanyHomeProps) {
    const today = await getTodayDate();

    const [heroSlides, sessions, exhibitionsData, services, aboutData, blogData,] = await Promise.all([getHeroSlides(), getSessions(), getHomepageExhibitions(today), getServices(), getAboutData(), getBlogPosts(),]);

    return (
        <main>
            <Hero locale={locale} slides={heroSlides} />

            <ExhibitionsSection
                locale={locale}
                today={today}
                exhibitions={exhibitionsData.exhibitions}
                totalCount={exhibitionsData.totalCount}
                statusCounts={exhibitionsData.statusCounts}
            />

            <ServicesProvider initialServices={services}>
                <ServicesSection locale={locale} />
            </ServicesProvider>

            <StatsSection
                locale={locale}
                stats={aboutData.stats}
            />

            <PartnersSection
                locale={locale}
                partners={aboutData.partners}
            />

            <SessionsSection
                locale={locale}
                sessions={sessions}
            />

            <LatestPostsSection
                locale={locale}
                posts={blogData.posts}
            />

            <CTASection locale={locale} />
        </main>
    );
}