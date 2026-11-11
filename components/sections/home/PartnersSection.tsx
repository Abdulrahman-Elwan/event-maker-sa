"use client";

import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import { PartnersData } from "@/types/partners";

interface PartnersSectionProps {
    locale: Locale;
    partners: PartnersData;
}

interface PartnerRowProps {
    logos: string[];
    direction: "right" | "left";
}

function PartnerRow({
    logos,
    direction,
}: PartnerRowProps) {
    if (logos.length === 0) {
        return null;
    }

    // نفس فكرة الموقع القديم:
    // [logos] + [logos]
    const duplicatedLogos = [
        ...logos,
        ...logos,
    ];

    return (
        <div className="relative w-full overflow-hidden" >
            <div
                className={
                    direction === "left"
                        ? "partners-track partners-track-left"
                        : "partners-track partners-track-right"
                }
            >
                {duplicatedLogos.map(
                    (logo, index) => (
                        <div
                            key={`${direction}-${index}-${logo}`}
                            className="mx-2 flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:mx-2.5 sm:h-32 sm:w-60 sm:px-8"
                        >
                            <Image
                                src={logo}
                                alt="Event Maker partner"
                                width={180}
                                height={80}
                                sizes="180px"
                                className="h-16 w-auto max-w-44 object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-[4.5rem] sm:max-w-48"
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default function PartnersSection({
    locale,
    partners
}: PartnersSectionProps) {
    const isArabic = locale === "ar";

    if (
        partners.official.length === 0 &&
        partners.others.length === 0
    ) {
        return null;
    }

    const title =
        partners.title[
            isArabic ? "ar" : "en"
        ];

    const description =
        partners.description[
            isArabic ? "ar" : "en"
        ];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-white py-12 sm:py-16"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span
                        className="mb-4 block text-xl font-bold"
                        style={{
                            color: "var(--theme-primary)",
                        }}
                    >
                        {isArabic
                            ? "شركاء النجاح"
                            : "Our Partners"}
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {title}
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                        {description}
                    </p>
                </div>
            </div>

            <div className="relative mt-14 space-y-5 sm:space-y-6" dir="ltr">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-28" />

                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent sm:w-28" />

                <PartnerRow
                    logos={partners.official}
                    direction="right"
                />

                <PartnerRow
                    logos={partners.others}
                    direction="left"
                />
            </div>
        </section>
    );
}