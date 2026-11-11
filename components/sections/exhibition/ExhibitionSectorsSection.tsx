import Link from "next/link";
import { FiArrowUpLeft, FiArrowUpRight } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionSector } from "@/types/landingPage/sector";

import Reveal from "@/components/animations/Reveal";

interface ExhibitionSectorsSectionProps {
    locale: Locale;
    sectors: ExhibitionSector[];
}

export default function ExhibitionSectorsSection({
    locale,
    sectors,
}: ExhibitionSectorsSectionProps) {
    const isArabic = locale === "ar";

    if (!sectors.length) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-secondary) py-18 text-white sm:py-22 lg:py-28"
        >
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -start-40 top-20 h-80 w-80 rounded-full bg-(--theme-primary)/10 blur-3xl" />

                <div className="absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-(--theme-primary)/5 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-24">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <Reveal
                            delay={100}
                            distance={25}
                            threshold={0.15}
                        >
                            <div className="flex items-center gap-3">
                                <span className="h-px w-9 bg-(--theme-primary)" />

                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--theme-primary) sm:text-xs">
                                    {isArabic
                                        ? "قطاعات المعرض"
                                        : "EXHIBITION SECTORS"}
                                </span>
                            </div>
                        </Reveal>

                        <Reveal
                            delay={180}
                            distance={30}
                            threshold={0.15}
                        >
                            <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[3.25rem]">
                                {isArabic
                                    ? "قطاعات تجمع فرصًا متعددة"
                                    : "Sectors Bringing Diverse Opportunities Together"}
                            </h2>
                        </Reveal>

                        <Reveal
                            delay={260}
                            distance={25}
                            threshold={0.15}
                        >
                            <p className="mt-5 max-w-lg text-sm leading-8 text-white/60 sm:text-[15px]">
                                {isArabic
                                    ? "استكشف القطاعات الرئيسية التي يغطيها المعرض والفرص التي تجمع مختلف مجالات الأعمال تحت منصة واحدة."
                                    : "Explore the key sectors covered by the exhibition and the opportunities that bring diverse business fields together under one platform."}
                            </p>
                        </Reveal>

                        <Reveal
                            delay={340}
                            distance={20}
                            threshold={0.15}
                        >
                            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
                                <span className="text-2xl font-extrabold leading-none text-(--theme-primary)">
                                    {String(sectors.length).padStart(2, "0")}
                                </span>

                                <span className="text-xs font-medium text-white/50">
                                    {isArabic
                                        ? "قطاعات رئيسية"
                                        : "Key sectors"}
                                </span>
                            </div>
                        </Reveal>
                    </div>

                    <div className="border-t border-white/10">
                        {sectors.map((sector, index) => {
                            const title = sector.title?.[locale];
                            const description =
                                sector.meta_description?.[locale];

                            return (
                                <Reveal
                                    key={sector.id}
                                    delay={120 + index * 80}
                                    distance={25}
                                    threshold={0.1}
                                >
                                    <div
                                        className="group grid gap-5 border-b border-white/10 py-7 transition-colors duration-300 hover:bg-white/[0.025] sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-7 sm:py-8"
                                    >
                                        <span className="text-sm font-semibold tracking-[0.08em] text-white/25 transition-colors duration-300 group-hover:text-(--theme-primary)">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className="min-w-0">
                                            <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-(--theme-primary) sm:text-2xl">
                                                {title}
                                            </h3>

                                            {description && (
                                                <p className="mt-2 max-w-2xl text-xs leading-6 text-white/45 sm:text-sm sm:leading-7">
                                                    {description}
                                                </p>
                                            )}
                                        </div>

                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 group-hover:border-(--theme-primary)/40 group-hover:bg-(--theme-primary) group-hover:text-(--theme-secondary)">
                                            {isArabic ? (
                                                <FiArrowUpLeft className="text-base" />
                                            ) : (
                                                <FiArrowUpRight className="text-base" />
                                            )}
                                        </span>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
