"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";

interface ServicesExplorerInteractiveProps {
    locale: Locale;
    services: ServiceItem[];
}

export default function ServicesExplorerInteractive({
    locale,
    services,
}: ServicesExplorerInteractiveProps) {
    const isArabic = locale === "ar";

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const activeService = services[activeIndex];

    useEffect(() => {
        if (services.length <= 1 || isPaused) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveIndex((current) =>
                current === services.length - 1 ? 0 : current + 1,
            );
        }, 6000);

        return () => window.clearInterval(interval);
    }, [isPaused, services.length]);

    if (!activeService) {
        return null;
    }

    const goToPrevious = () => {
        setActiveIndex((current) =>
            current === 0 ? services.length - 1 : current - 1,
        );
    };

    const goToNext = () => {
        setActiveIndex((current) =>
            current === services.length - 1 ? 0 : current + 1,
        );
    };

    const detailHref = isArabic
        ? `/services/${activeService.slug}`
        : `/en/services/${activeService.slug}`;

    return (
        <section
            id="services-list"
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-secondary) py-20 text-white sm:py-24 lg:py-32"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
        >
            {/* Background Decoration */}
            <div className="pointer-events-none absolute -end-40 top-1/4 h-96 w-96 rounded-full bg-(--theme-primary)/10 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">

                {/* Section Header */}
                <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 lg:flex-row lg:items-end lg:gap-10">

                    <div className="max-w-2xl">

                        <Reveal
                            distance={20}
                            duration={600}
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-8 bg-(--theme-primary)" />

                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-(--theme-primary) sm:text-sm">
                                    {isArabic
                                        ? "خدماتنا"
                                        : "OUR SERVICES"}
                                </span>
                            </div>
                        </Reveal>

                        <Reveal
                            delay={100}
                            distance={25}
                        >
                            <h2 className="text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
                                {isArabic
                                    ? "حلول متكاملة لكل تفاصيل فعاليتك"
                                    : "Integrated Solutions for Every Part of Your Event"}
                            </h2>
                        </Reveal>

                    </div>

                    <Reveal
                        delay={180}
                        distance={20}
                        className="max-w-md"
                    >
                        <p className="text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                            {isArabic
                                ? "نقدم مجموعة متكاملة من الخدمات التي تجمع بين التخطيط والإبداع والتنفيذ الاحترافي لضمان تجربة استثنائية."
                                : "We provide integrated services combining planning, creativity, and professional execution to deliver exceptional event experiences."}
                        </p>
                    </Reveal>

                </div>

                {/* Service Navigation */}
                <Reveal
                    delay={240}
                    distance={20}
                >
                    <div className="mb-8 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-2">
                            {services.map((service, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        aria-label={service.title[locale]}
                                        aria-pressed={isActive}
                                        className={`
                                            group relative flex min-h-14 items-center gap-3
                                            rounded-full border px-4 py-3
                                            text-sm font-semibold
                                            transition-all duration-300 cursor-pointer
                                            sm:px-5
                                            ${
                                                isActive
                                                    ? "border-(--theme-primary) bg-(--theme-primary) text-(--theme-secondary)"
                                                    : "border-white/10 bg-white/[0.035] text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                text-[10px] font-bold tracking-widest
                                                ${
                                                    isActive
                                                        ? "text-(--theme-secondary)/55"
                                                        : "text-(--theme-primary)/70"
                                                }
                                            `}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span>
                                            {service.title[locale]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Reveal>

                {/* Main Explorer */}
                <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] lg:grid-cols-[1.05fr_0.95fr]">

                    {/* Image */}
                    <div className="relative min-h-[360px] overflow-hidden sm:min-h-[500px] lg:min-h-[620px]">

                        <Image
                            key={activeService.coverImage.url}
                            src={activeService.coverImage.url}
                            alt={activeService.title[locale]}
                            fill
                            sizes="(max-width: 1024px) 100vw, 55vw"
                            className="object-cover transition-transform duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                        <div className="absolute bottom-5 start-5 flex items-center gap-3 sm:bottom-7 sm:start-7">
                            <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                                {String(activeIndex + 1).padStart(2, "0")}
                            </span>

                            <span className="h-px w-10 bg-(--theme-primary)" />

                            <span className="text-xs font-semibold tracking-widest text-white/60">
                                {String(services.length).padStart(2, "0")}
                            </span>
                        </div>

                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-14">

                        <div>

                            {/* Service Number */}
                            <div className="mb-7 flex items-center justify-between gap-4">
                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-(--theme-primary)">
                                    {isArabic
                                        ? "الخدمة"
                                        : "SERVICE"}{" "}
                                    {String(activeIndex + 1).padStart(2, "0")}
                                </span>

                                <span className="text-xs font-semibold text-white/35">
                                    {String(services.length).padStart(2, "0")}
                                </span>
                            </div>

                            {/* Title */}
                            <div
                                key={`title-${activeService.id}`}
                                className="animate-[fadeIn_.5s_ease-out]"
                            >
                                <h3 className="max-w-xl text-2xl font-extrabold leading-[1.25] tracking-tight sm:text-3xl lg:text-4xl">
                                    {activeService.title[locale]}
                                </h3>

                                <p className="mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                                    {activeService.shortDescription[locale]}
                                </p>
                            </div>

                            {/* Features */}
                            {activeService.content?.main?.features?.items?.length > 0 && (
                                <div className="mt-8 border-t border-white/10 pt-7">
                                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-(--theme-primary)">
                                        {activeService.content.main.features.title[locale]}
                                    </p>

                                    <ul className="space-y-3">
                                        {activeService.content.main.features.items
                                            .slice(0, 4)
                                            .map((item, index) => (
                                                <li
                                                    key={`${activeService.id}-feature-${index}`}
                                                    className="flex items-start gap-3 text-sm leading-6 text-white/60"
                                                >
                                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--theme-primary)" />

                                                    <span>
                                                        {item[locale]}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-10 border-t border-white/10 pt-6">

                            <div className="flex flex-wrap items-center justify-between gap-5">

                                <Link
                                    href={detailHref}
                                    className="inline-flex items-center gap-3 rounded-full bg-(--theme-primary) px-6 py-3.5 text-sm font-bold text-(--theme-secondary) transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                                >
                                    {isArabic
                                        ? "اكتشف الخدمة"
                                        : "Explore Service"}

                                    <span aria-hidden="true">
                                        {isArabic ? "←" : "→"}
                                    </span>
                                </Link>

                                {/* Slider Controls */}
                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={goToPrevious}
                                        aria-label={
                                            isArabic
                                                ? "الخدمة السابقة"
                                                : "Previous service"
                                        }
                                        className="flex cursor-pointer h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-(--theme-primary)/50 hover:bg-(--theme-primary) hover:text-(--theme-secondary)"
                                    >
                                        {isArabic ? "→" : "←"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={goToNext}
                                        aria-label={
                                            isArabic
                                                ? "الخدمة التالية"
                                                : "Next service"
                                        }
                                        className="flex cursor-pointer h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-(--theme-primary)/50 hover:bg-(--theme-primary) hover:text-(--theme-secondary)"
                                    >
                                        {isArabic ? "←" : "→"}
                                    </button>

                                </div>

                            </div>

                            {/* Progress */}
                            <div className="mt-6 flex gap-1.5">
                                {services.map((service, index) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        aria-label={
                                            isArabic
                                                ? `الانتقال إلى الخدمة ${index + 1}`
                                                : `Go to service ${index + 1}`
                                        }
                                        className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                                    >
                                        <span
                                            className={`
                                                block h-full rounded-full
                                                transition-all duration-500
                                                ${
                                                    index === activeIndex
                                                        ? "bg-(--theme-primary)"
                                                        : "bg-transparent"
                                                }
                                            `}
                                        />
                                    </button>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}