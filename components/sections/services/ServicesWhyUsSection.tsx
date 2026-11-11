import type { Locale } from "@/lib/i18n/config";
import type { ServicesWhyUs } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";

interface ServicesWhyUsSectionProps {
    locale: Locale;
    whyUs: ServicesWhyUs;
}

export default function ServicesWhyUsSection({ locale, whyUs, }: ServicesWhyUsSectionProps) {
    const isArabic = locale === "ar";
    const features = whyUs.features.slice(0, 4);

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background)"
        >
            <div className="container mx-auto px-5 sm:px-7 lg:px-8">
                <div className="relative overflow-hidden bg-white">
                    {/* Decorative Background */}
                    <div className="pointer-events-none absolute -start-24 -top-24 h-64 w-64 rounded-full bg-(--theme-primary)/[0.06] blur-[80px]" />

                    <div className="relative grid grid-cols-1 gap-8 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-2 lg:gap-12">
                        {/* Content */}
                        <div
                            className={`flex flex-col justify-center ${isArabic ? "text-right" : "text-left"
                                }`}
                        >
                            <Reveal delay={100} distance={25}>
                                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-(--theme-primary)">
                                    {isArabic
                                        ? "لماذا إيفنت ميكر"
                                        : "WHY EVENT MAKER"}
                                </span>
                            </Reveal>

                            <Reveal delay={200} distance={25}>
                                <h2 className="text-2xl font-bold tracking-tight text-(--theme-secondary) md:text-3xl lg:text-4xl">
                                    {whyUs.title[locale]}
                                </h2>
                            </Reveal>

                            <Reveal delay={300} distance={25}>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-(--theme-secondary)/60 md:text-base">
                                    {whyUs.description[locale]}
                                </p>
                            </Reveal>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 content-center">
                            {features.map((feature, index) => {
                                const isFirstColumn = index % 2 === 0;
                                const isFirstRow = index < 2;

                                return (
                                    <Reveal
                                        key={`${feature.title.ar}-${index}`}
                                        delay={350 + index * 120}
                                        distance={20}
                                    >
                                        <div
                                            className={`
                                                flex h-full min-h-40 flex-col justify-center items-center text-center
                                                px-4 py-6 sm:px-7 sm:py-8
                                                ${isFirstRow ? "border-b border-(--theme-secondary)/15" : ""}
                                                ${isFirstColumn ? "border-e border-(--theme-secondary)/15" : ""}
                                            `}
                                        >
                                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-(--theme-primary)/10 text-(--theme-primary)">
                                                <ServiceWhyUsIcon
                                                    icon={feature.icon}
                                                />
                                            </div>

                                            <h3 className="text-base font-bold leading-6 text-(--theme-secondary) sm:text-lg">
                                                {feature.title[locale]}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-(--theme-secondary)/60">
                                                {feature.description[locale]}
                                            </p>
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

function ServiceWhyUsIcon({ icon }: { icon: string }) {
    switch (icon) {
        case "HiOutlineChip":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                >
                    <rect x="7" y="7" width="10" height="10" rx="1.5" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
                </svg>
            );

        case "HiOutlineLightBulb":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                >
                    <path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1 1 15.5 14c-.8.7-1.3 1.6-1.5 2.5h-4c-.2-.9-.7-1.8-1.5-2.5Z" />
                </svg>
            );

        case "BsStars":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                >
                    <path d="m12 3 1.4 4.1L17.5 9l-4.1 1.4L12 14l-1.4-3.6L6.5 9l4.1-1.9L12 3Z" />
                    <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 15l.6 1.9L7.5 18l-1.9.6L5 20.5l-.6-1.9L2.5 18l1.9-.6L5 15Z" />
                </svg>
            );

        case "FiCheckCircle":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8.5 12 2.3 2.3 4.7-5" />
                </svg>
            );

        default:
            return null;
    }
}