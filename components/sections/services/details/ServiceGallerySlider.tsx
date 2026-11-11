
"use client";

import { useEffect, useRef, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/config";

interface ServiceGallerySliderProps {
    children: ReactNode;
    galleryLength: number;
    locale?: Locale;
}

export default function ServiceGallerySlider({
    children,
    galleryLength,
    locale = "ar",
}: ServiceGallerySliderProps) {
    const isArabic = locale === "ar";
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollSlider = (direction: "next" | "prev") => {
        const slider = sliderRef.current;

        if (!slider) {
            return;
        }

        const firstCard = slider.firstElementChild as HTMLElement | null;

        if (!firstCard) {
            return;
        }

        const gap = 20;
        const amount = firstCard.offsetWidth + gap;

        slider.scrollBy({
            left: direction === "next" ? amount : -amount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (galleryLength <= 4) {
            return;
        }

        const interval = window.setInterval(() => {
            const slider = sliderRef.current;
            const firstCard = slider?.firstElementChild as HTMLElement | null;

            if (!slider || !firstCard) {
                return;
            }

            const gap = 20;
            const amount = firstCard.offsetWidth + gap;
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            if (slider.scrollLeft >= maxScroll - 10) {
                slider.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });

                return;
            }

            slider.scrollBy({
                left: amount,
                behavior: "smooth",
            });
        }, 5000);

        return () => window.clearInterval(interval);
    }, [galleryLength]);

    return (
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
            <div
                ref={sliderRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-5"
            >
                {children}
            </div>

            {galleryLength > 1 && (
                <div className="mx-auto mt-5 flex max-w-7xl items-center justify-center px-5 sm:px-7 lg:px-8">
                    <div className="flex items-center gap-2 font-black">
                        <button
                            type="button"
                            onClick={() => scrollSlider("prev")}
                            aria-label={
                                isArabic
                                    ? "الصورة السابقة"
                                    : "Previous image"
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--theme-secondary)/10 text-sm text-(--theme-secondary) transition-all duration-300 hover:border-(--theme-primary)/40 hover:bg-(--theme-primary) hover:text-white"
                        >
                            {isArabic ? "→" : "←"}
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollSlider("next")}
                            aria-label={
                                isArabic
                                    ? "الصورة التالية"
                                    : "Next image"
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--theme-secondary) text-sm text-white transition-all duration-300 hover:bg-(--theme-primary)"
                        >
                            {isArabic ? "←" : "→"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
