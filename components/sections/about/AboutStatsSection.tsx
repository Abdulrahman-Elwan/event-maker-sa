import type { Locale } from "@/lib/i18n/config";
import type { AboutStats } from "@/types/about/about";

import Reveal from "@/components/animations/Reveal";
import AnimatedStatValue from "./AnimatedStatValue";

interface AboutStatsSectionProps {
    locale: Locale;
    stats: AboutStats;
}

export default function AboutStatsSection({
    locale,
    stats,
}: AboutStatsSectionProps) {
    const isArabic = locale === "ar";
    const statsItems = stats.stats.slice(0, 4);

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-10 md:py-16"
        >
            <div className="container mx-auto px-5 sm:px-7 lg:px-8">
                <div className="relative overflow-hidden bg-white">
                    {/* Decorative Background */}
                    <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-(--theme-primary)/[0.06] blur-[80px]" />

                    <div className="relative grid grid-cols-1 gap-8 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-2 lg:gap-12">
                        {/* Content */}
                        <div
                            className={`flex flex-col justify-center ${
                                isArabic ? "text-right" : "text-left"
                            }`}
                        >
                            <Reveal delay={100} distance={25}>
                                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-(--theme-primary)">
                                    {isArabic
                                        ? "أرقام تعكس خبراتنا"
                                        : "OUR IMPACT IN NUMBERS"}
                                </span>
                            </Reveal>

                            <Reveal delay={200} distance={25}>
                                <h2 className="text-2xl font-bold tracking-tight text-(--theme-secondary) md:text-3xl">
                                    {stats.title[locale]}
                                </h2>
                            </Reveal>

                            <Reveal delay={300} distance={25}>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-(--theme-secondary)/60 md:text-base">
                                    {stats.description[locale]}
                                </p>
                            </Reveal>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 content-center">
                            {statsItems.map((item, index) => {
                                const isFirstColumn = index % 2 === 0;
                                const isFirstRow = index < 2;

                                return (
                                    <Reveal
                                        key={`${item.title.ar}-${index}`}
                                        delay={350 + index * 120}
                                        distance={20}
                                    >
                                        <div
                                            className={`
                                                flex h-full min-h-32 flex-col justify-center
                                                px-4 py-6 sm:px-7 sm:py-8
                                                ${isFirstRow ? "border-b border-(--theme-secondary)/15" : ""}
                                                ${isFirstColumn
                                                    ? isArabic
                                                        ? "border-e border-(--theme-secondary)/15"
                                                        : "border-e border-(--theme-secondary)/15"
                                                    : ""}
                                            `}
                                        >
                                            <div className="text-3xl leading-none font-bold tracking-tight text-(--theme-primary) sm:text-4xl md:text-5xl">
                                                <AnimatedStatValue value={item.value} />
                                            </div>

                                            <div className="mt-3 text-sm font-semibold leading-6 text-(--theme-secondary)/65 sm:text-base">
                                                {item.title[locale]}
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}