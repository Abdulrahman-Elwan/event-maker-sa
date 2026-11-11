
import type { IconType } from "react-icons";
import {
    HiOutlineSparkles,
    HiOutlineClipboardCheck,
    HiOutlineUserGroup,
    HiOutlineGlobeAlt,
} from "react-icons/hi";
import { FaChartLine } from "react-icons/fa";
import { BsLightning } from "react-icons/bs";

import type { Locale } from "@/lib/i18n/config";
import type { AboutWhyUs } from "@/types/about/about";
import Reveal from "@/components/animations/Reveal";

interface AboutWhyUsSectionProps {
    locale: Locale;
    whyUs: AboutWhyUs;
}

const iconMap: Record<string, IconType> = {
    HiOutlineSparkles,
    HiOutlineClipboardCheck,
    HiOutlineUserGroup,
    HiOutlineGlobeAlt,
    FaChartLine,
    BsLightning,
};

export default function AboutWhyUsSection({
    locale,
    whyUs,
}: AboutWhyUsSectionProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background)  py-10 md:py-16"
        >
            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">

                {/* Section Header */}
                <Reveal>
                    <div className="w-full px-7 md:px-15 text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-(--theme-primary)">
                            {isArabic ? "لماذا إيفنت ميكر؟" : "WHY EVENT MAKER"}
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-(--theme-secondary) md:text-4xl">
                            {whyUs.title[locale]}
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-(--theme-secondary)/60 md:text-base">
                            {whyUs.description[locale]}
                        </p>
                    </div>
                </Reveal>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-3">
                    {whyUs.features.slice(0, 6).map((feature, index) => {
                        const Icon = iconMap[feature.icon] || HiOutlineSparkles;

                        const isFirstColumn = index % 2 === 0;
                        const isFirstDesktopColumn = index % 3 === 0;

                        const isFirstMobileRow = index < 2;
                        const isFirstDesktopRow = index < 3;

                        return (
                            <Reveal
                                key={`${feature.title.ar}-${index}`}
                                delay={index * 100}
                                className="h-full"
                            >
                                <article
                                    className={`
                        group flex h-full min-h-48
                        flex-col items-center justify-center
                        px-3 py-8 text-center
                        transition-colors duration-300
                        hover:bg-(--theme-primary)/[0.035]
                        sm:min-h-52 sm:px-6 sm:py-10

                        border-(--theme-secondary)/10

                        /* Mobile: 2 columns */
                        ${isFirstColumn ? "border-e" : ""}
                        ${!isFirstMobileRow ? "border-t" : ""}

                        /* Desktop: 3 columns */
                        lg:border-e-0 lg:border-t-0
                        ${!isFirstDesktopColumn ? "lg:border-e" : ""}
                        ${!isFirstDesktopRow ? "lg:border-t" : ""}
                    `}
                                >
                                    {/* Icon */}
                                    <div className="flex h-11 w-11 items-center justify-center text-(--theme-primary) transition-transform duration-500 group-hover:-translate-y-1 sm:h-12 sm:w-12">
                                        <Icon size={27} strokeWidth={1.7} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="mt-3 text-sm font-bold text-(--theme-secondary) transition-colors duration-300 group-hover:text-(--theme-primary) sm:mt-4 sm:text-base">
                                        {feature.title[locale]}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 max-w-[230px] text-[11px] leading-5 text-(--theme-secondary)/55 sm:text-xs sm:leading-6 md:text-sm">
                                        {feature.description[locale]}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
