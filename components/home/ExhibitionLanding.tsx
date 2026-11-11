import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import { getPreviousEditions } from "@/lib/data/landingPage/exhibitions";
import { getExhibitionSectors } from "@/lib/data/landingPage/getExhibitionSectors";
import { getServices } from "@/lib/data/services";

import { ServicesProvider } from "@/contexts/ServicesContext";

import ExhibitionHero from "../sections/exhibition/ExhibitionHero";
import ExhibitionOverview from "../sections/exhibition/ExhibitionOverview";
import ExhibitionAbout from "../sections/exhibition/ExhibitionAbout";
import PreviousEditionsSection from "../sections/exhibition/PreviousEditionsSection";
import ExhibitionSpeakersSection from "../sections/exhibition/ExhibitionSpeakersSection";
import ServicesSection from "../sections/home/ServicesSection";
import ExhibitionPartnersSection from "../sections/exhibition/ExhibitionPartnersSection";
import RegistrationSection from "@/components/registration/RegistrationSection";
import ExhibitionSectorsSection from "../sections/exhibition/ExhibitionSectorsSection";
import { getTodayDate } from "@/lib/data/getTodayDate";

interface ExhibitionLandingProps {
    locale: Locale;
    exhibition: Exhibition;
}

export default async function ExhibitionLanding({
    locale,
    exhibition,
}: ExhibitionLandingProps) {

    const today = await getTodayDate();

    const [previousEditions, sectors, services] = await Promise.all([
        getPreviousEditions(exhibition),
        getExhibitionSectors(exhibition.sector_ids),
        getServices(),
    ]);

    return (
        <main
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)]"
        >
            <ExhibitionHero
                locale={locale}
                exhibition={exhibition}
                today={today}
            />

            <ExhibitionOverview
                locale={locale}
                exhibition={exhibition}
            />

            <ExhibitionAbout
                locale={locale}
                exhibition={exhibition}
            />

            {sectors.length > 0 && (
                <ExhibitionSectorsSection
                    locale={locale}
                    sectors={sectors}
                />
            )}

            <PreviousEditionsSection
                locale={locale}
                exhibitions={previousEditions}
            />

            <ServicesProvider initialServices={services}>
                <ServicesSection locale={locale} />
            </ServicesProvider>

            <ExhibitionSpeakersSection
                locale={locale}
                speakers={exhibition.speakers}
            />

            <ExhibitionPartnersSection
                locale={locale}
                partners={exhibition.partners}
            />

            <RegistrationSection
                locale={locale}
                exhibition={exhibition}
            />
        </main>
    );
}