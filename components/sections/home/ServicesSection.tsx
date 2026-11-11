
// components/sections/home/ServicesSection.tsx

import type { Locale } from "@/lib/i18n/config";
import ServicesSectionClient from "./ServicesSectionClient";
import Reveal from "@/components/animations/Reveal";
interface ServicesSectionProps {
    locale: Locale;
}

export default function ServicesSection({
    locale,
}: ServicesSectionProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-linear-to-b from-(--theme-secondary) via-(--theme-secondary) to-(--theme-backgroundColor) py-12 sm:py-15 lg:py-18"
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute left-1/2 top-20 h-125 w-125 -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
                style={{
                    backgroundColor: "var(--theme-primary)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">

                {/* Server Rendered Heading */}
                <Reveal
                    distance={35}
                    duration={850}
                    threshold={0.05}
                >
                    <div className="mb-8 max-w-2xl sm:mb-12 lg:mb-14">
                        <span
                            className="text-xl font-semibold tracking-wide"
                            style={{
                                color: "var(--theme-primary)",
                            }}
                        >
                            {isArabic ? "خدماتنا" : "Our Services"}
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            {isArabic
                                ? "حلول متكاملة لصناعة فعاليات استثنائية"
                                : "Integrated Solutions for Exceptional Events"}
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                            {isArabic
                                ? "من التخطيط والتنظيم إلى التنفيذ والتقنيات، نقدم حلولًا متكاملة تصنع تجربة متكاملة لكل فعالية."
                                : "From planning and organization to execution and technology, we deliver integrated solutions for every event."}
                        </p>
                    </div>
                </Reveal>

                {/* Interactive Services */}
                <Reveal
                    distance={40}
                    duration={900}
                    threshold={0.05}
                >
                    <ServicesSectionClient locale={locale} />
                </Reveal>

            </div>
        </section>
    );
}
