"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { HeroSlide } from "@/lib/data/homepage";

interface HeroSliderProps {
    locale: Locale;
    slides: readonly HeroSlide[];
}

export default function HeroSlider({
    locale,
    slides,
}: HeroSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const isArabic = locale === "ar";
    const currentSlide = slides[activeIndex];

    const content = isArabic
        ? currentSlide.ar
        : currentSlide.en;

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = window.setInterval(() => {
            setActiveIndex((current) =>
                current === slides.length - 1 ? 0 : current + 1
            );
        }, 7000);

        return () => window.clearInterval(interval);
    }, [slides.length]);

    function goToPrevious() {
        setActiveIndex((current) =>
            current === 0 ? slides.length - 1 : current - 1
        );
    }

    function goToNext() {
        setActiveIndex((current) =>
            current === slides.length - 1 ? 0 : current + 1
        );
    }

    const currentNumber = String(activeIndex + 1).padStart(2, "0");
    const totalNumber = String(slides.length).padStart(2, "0");

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative h-svh min-h-155 max-h-250 overflow-hidden bg-slate-950 text-white"
            aria-label={isArabic ? "الواجهة الرئيسية" : "Main hero"}
        >
            {/* =========================
                Background Images
            ========================== */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === activeIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.ar.eyebrow}
                        fill
                        unoptimized
                        priority={index === 0}
                        sizes="100vw"
                        className={`object-cover object-center ${index === activeIndex? "hero-image-active": ""}`}
                    />
                </div>
            ))}

            {/* =========================
                Soft Global Overlay
            ========================== */}
            <div className="absolute inset-0 bg-black/20" />

            {/* =========================
                Content Overlay
            ========================== */}
            <div
                className={`absolute inset-y-0 w-[90%] sm:w-[80%] lg:w-[68%] ${isArabic
                        ? "right-0 bg-linear-to-l from-[var(--theme-secondary)]/75 via-[var(--theme-secondary)]/40 to-transparent"
                        : "left-0 bg-linear-to-r from-[var(--theme-secondary)]/75 via-[var(--theme-secondary)]/40 to-transparent"
                    }`}
            />

            {/* Extra soft center fade */}
            <div className="absolute inset-0 bg-linear-to-t from-[var(--theme-secondary)]/45 via-transparent to-[var(--theme-secondary)]/10" />

            {/* =========================
                Bottom Gradient
            ========================== */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[var(--theme-secondary)]/65 to-transparent" />

            {/* =========================
                Main Content
            ========================== */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 pb-24 pt-24 sm:px-7 lg:px-8 lg:pb-28 lg:pt-24">
                <div
                    key={currentSlide.id}
                    className={`w-full ${isArabic
                            ? "max-w-2xl"
                            : "max-w-xl lg:max-w-155"
                        }`}
                >
                    {/* =========================
                        Title
                    ========================== */}
                    <h1
                        className={`hero-content-eyebrow font-bold tracking-tight ${isArabic
                                ? "text-[clamp(2.35rem,5vw,4.25rem)] leading-[1.15]"
                                : "text-[clamp(2.1rem,4.2vw,3.8rem)] leading-[1.08]"
                            }`}
                    >
                        <span className="block text-white">
                            {content.eyebrow}
                        </span>

                        <span
                            className="hero-content-title mt-2 block"
                            style={{
                                color: "var(--theme-primary)",
                            }}
                        >
                            {content.title}
                        </span>
                    </h1>

                    {/* =========================
                        Description
                    ========================== */}
                    <p
                        className={`hero-content-description mt-5 text-white/80 ${isArabic
                                ? "max-w-xl text-[15px] leading-7 sm:text-base sm:leading-8"
                                : "max-w-lg text-[14px] leading-7 sm:text-[15px] sm:leading-7"
                            }`}
                    >
                        {content.description}
                    </p>

                    {/* =========================
                        CTA Buttons
                    ========================== */}
                    <div className="hero-content-buttons mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
                        <Link
                            href={
                                isArabic
                                    ? `/${currentSlide.link1}/`
                                    : `/en/${currentSlide.link1}/`
                            }
                            className="group inline-flex h-11 items-center gap-3 rounded-full px-6 text-sm font-semibold text-slate-950 transition-all duration-300 hover:brightness-110 hover:shadow-lg sm:h-12 sm:px-7"
                            style={{
                                backgroundColor:
                                    "var(--theme-primary)",
                            }}
                        >
                            <span>
                                {content.primaryButton}
                            </span>

                            {isArabic ? (
                                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                            ) : (
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            )}
                        </Link>

                        <Link
                            href={
                                isArabic
                                    ? `/${currentSlide.link2}/`
                                    : `/en/${currentSlide.link2}/`
                            }
                            className="inline-flex h-11 items-center rounded-full border border-white/40 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/10 sm:h-12 sm:px-7"
                        >
                            {content.secondaryButton}
                        </Link>
                    </div>
                </div>
            </div>

            {/* =========================
                Slider Controls
            ========================== */}
            <div
                className={`absolute bottom-7 z-20 flex items-center gap-2 sm:bottom-8 sm:gap-5 ${isArabic
                        ? "right-5 lg:right-8"
                        : "left-5 lg:left-8"
                    }`}
            >
                {/* Previous */}
                <button
                    type="button"
                    onClick={goToPrevious}
                    aria-label={
                        isArabic
                            ? "الشريحة السابقة"
                            : "Previous slide"
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:h-10 sm:w-10"
                >
                    {isArabic ? (
                        <FiArrowRight />
                    ) : (
                        <FiArrowLeft />
                    )}
                </button>

                {/* Counter */}
                <div
                    dir="ltr"
                    className="flex items-center gap-2 text-xs tracking-widest sm:text-sm"
                >
                    <span className="font-semibold text-white">
                        {currentNumber}
                    </span>

                    <span className="text-white/30">/</span>

                    <span className="text-white/50">
                        {totalNumber}
                    </span>
                </div>

                {/* Next */}
                <button
                    type="button"
                    onClick={goToNext}
                    aria-label={
                        isArabic
                            ? "الشريحة التالية"
                            : "Next slide"
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:h-10 sm:w-10"
                >
                    {isArabic ? (
                        <FiArrowLeft />
                    ) : (
                        <FiArrowRight />
                    )}
                </button>
            </div>

            {/* =========================
                Side Slide Indicator
            ========================== */}
            <div className="absolute bottom-8 right-5 z-20 hidden lg:block">
                <div className="flex items-center gap-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            aria-label={
                                isArabic
                                    ? `الانتقال إلى الشريحة ${index + 1}`
                                    : `Go to slide ${index + 1}`
                            }
                            onClick={() =>
                                setActiveIndex(index)
                            }
                            className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex
                                    ? "w-10"
                                    : "w-4 bg-white/30 hover:bg-white/60"
                                }`}
                            style={
                                index === activeIndex
                                    ? {
                                        backgroundColor:
                                            "var(--theme-primary)",
                                    }
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}