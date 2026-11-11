
import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionPartner } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

interface ExhibitionPartnersSectionProps {
    locale: Locale;
    partners: ExhibitionPartner[];
}

export default function ExhibitionPartnersSection({
    locale,
    partners,
}: ExhibitionPartnersSectionProps) {
    const isArabic = locale === "ar";

    const validPartners = Array.isArray(partners)
        ? partners.filter((partner) => partner?.logo?.url)
        : [];

    if (validPartners.length === 0) {
        return null;
    }

    const duplicatedPartners = [
        ...validPartners,
        ...validPartners,
    ];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-[var(--theme-background)] py-7"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Reveal delay={120}>
                        <span
                            className="mb-4 block text-sm font-bold tracking-[0.16em] sm:text-base"
                            style={{ color: "var(--theme-primary)" }}
                        >
                            {isArabic ? "شركاء النجاح" : "OUR PARTNERS"}
                        </span>
                    </Reveal>

                    <Reveal delay={200}>
                        <h2
                            className="text-2xl font-extrabold leading-snug sm:text-3xl lg:text-4xl"
                            style={{ color: "var(--theme-text)" }}
                        >
                            {isArabic
                                ? "شركاء يصنعون النجاح"
                                : "Partners Who Make Success Possible"}
                        </h2>
                    </Reveal>

                    <Reveal delay={280}>
                        <p
                            className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-65 sm:text-base sm:leading-8"
                            style={{ color: "var(--theme-text)" }}
                        >
                            {isArabic
                                ? "نفخر بشركائنا الذين يساهمون في دعم المعرض وتعزيز فرص التعاون والنجاح."
                                : "We are proud of our partners who support the exhibition and create opportunities for collaboration and success."}
                        </p>
                    </Reveal>
                </div>
            </div>

            <div
                className="relative mt-12 w-full overflow-hidden sm:mt-14"
                dir="ltr"
            >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-[var(--theme-background)] to-transparent sm:w-24" />

                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-[var(--theme-background)] to-transparent sm:w-24" />

                <div className="exhibition-partners-track flex w-max items-center">
                    {duplicatedPartners.map((partner, index) => (
                        <div
                            key={`${partner.id ?? partner.logo.public_id}-${index}`}
                            className="group mx-2 flex h-28 w-48 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white px-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:mx-2.5 sm:h-32 sm:w-56 sm:px-8"
                        >
                            <Image
                                src={partner.logo.url}
                                alt={
                                    partner.name?.[isArabic ? "ar" : "en"] ||
                                    (isArabic ? "شريك المعرض" : "Exhibition Partner")
                                }
                                width={180}
                                height={80}
                                sizes="180px"
                                className="h-16 w-auto max-w-40 object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-[4.5rem] sm:max-w-48"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
