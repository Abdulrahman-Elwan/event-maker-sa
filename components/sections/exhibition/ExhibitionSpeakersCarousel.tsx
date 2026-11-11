
"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionSpeaker } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

interface ValidSpeaker extends ExhibitionSpeaker {
    image: NonNullable<ExhibitionSpeaker["image"]>;
    displayName: string;
    displayTitle: string;
    uniqueKey: string;
}

interface ExhibitionSpeakersCarouselProps {
    locale: Locale;
    speakers: ValidSpeaker[];
    header: ReactNode;
}

export default function ExhibitionSpeakersCarousel({
    locale,
    speakers,
    header,
}: ExhibitionSpeakersCarouselProps) {
    const isArabic = locale === "ar";

    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderViewportRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isSliderVisible, setIsSliderVisible] = useState(false);

    const speakersCount = speakers.length;

    const scrollToNext = useCallback(() => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return;

        const gap =
            parseFloat(window.getComputedStyle(slider).columnGap) || 20;

        const step = firstCard.offsetWidth + gap;
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft >= maxScroll - 10) {
            slider.scrollTo({
                left: 0,
                behavior: "smooth",
            });
        } else {
            slider.scrollBy({
                left: step,
                behavior: "smooth",
            });
        }
    }, []);

    const scrollToPrevious = useCallback(() => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return;

        const gap =
            parseFloat(window.getComputedStyle(slider).columnGap) || 20;

        const step = firstCard.offsetWidth + gap;

        if (slider.scrollLeft <= 10) {
            slider.scrollTo({
                left: slider.scrollWidth - slider.clientWidth,
                behavior: "smooth",
            });
        } else {
            slider.scrollBy({
                left: -step,
                behavior: "smooth",
            });
        }
    }, []);

    const scrollToIndex = useCallback((index: number) => {
        const slider = sliderRef.current;
        const card = slider?.children[index] as HTMLElement | undefined;

        if (!slider || !card) return;

        slider.scrollTo({
            left: card.offsetLeft - slider.offsetLeft,
            behavior: "smooth",
        });
    }, []);

    // Detect slider visibility
    useEffect(() => {
        const sliderViewport = sliderViewportRef.current;

        if (!sliderViewport) return;

        if (!("IntersectionObserver" in window)) {
            setIsSliderVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSliderVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(sliderViewport);

        return () => observer.disconnect();
    }, []);

    // Auto slider
    useEffect(() => {
        if (
            !isSliderVisible ||
            isPaused ||
            speakersCount < 3
        ) {
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (mediaQuery.matches) return;

        const interval = window.setInterval(
            scrollToNext,
            4500
        );

        return () => window.clearInterval(interval);
    }, [
        isSliderVisible,
        isPaused,
        speakersCount,
        scrollToNext,
    ]);

    // Update active pagination
    const handleScroll = () => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return;

        const gap =
            parseFloat(window.getComputedStyle(slider).columnGap) || 20;

        const step = firstCard.offsetWidth + gap;
        const index = Math.round(slider.scrollLeft / step);

        setActiveIndex(
            Math.min(Math.max(index, 0), speakersCount - 1)
        );
    };

    return (
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.7fr] lg:gap-12">
            {/* Section Content & Controls */}
            <div>
                {header}

                <Reveal
                    threshold={0.2}
                    distance={25}
                    delay={360}
                >
                    {/* Slider Controls */}
                    <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
                        <button
                            type="button"
                            onClick={scrollToPrevious}
                            aria-label={
                                isArabic
                                    ? "المتحدث السابق"
                                    : "Previous speaker"
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--theme-primary)]/20 bg-white text-xl font-bold text-[var(--theme-secondary)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-primary)] hover:text-white"
                        >
                            {isArabic ? "→" : "←"}
                        </button>

                        <button
                            type="button"
                            onClick={scrollToNext}
                            aria-label={
                                isArabic
                                    ? "المتحدث التالي"
                                    : "Next speaker"
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--theme-primary)]/20 bg-white text-xl font-bold text-[var(--theme-secondary)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--theme-primary)] hover:text-white"
                        >
                            {isArabic ? "←" : "→"}
                        </button>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
                        {speakers.map((speaker, index) => (
                            <button
                                key={speaker.uniqueKey}
                                type="button"
                                aria-label={
                                    isArabic
                                        ? `الانتقال إلى المتحدث ${index + 1}`
                                        : `Go to speaker ${index + 1}`
                                }
                                aria-current={
                                    activeIndex === index
                                        ? "true"
                                        : undefined
                                }
                                onClick={() => scrollToIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeIndex === index
                                        ? "w-7 bg-[var(--theme-primary)]"
                                        : "w-2 bg-[var(--theme-secondary)]/25"
                                }`}
                            />
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* Speakers Slider */}
            <div
                ref={sliderViewportRef}
                className="min-w-0"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={(event) => {
                    if (
                        !event.currentTarget.contains(
                            event.relatedTarget
                        )
                    ) {
                        setIsPaused(false);
                    }
                }}
            >
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    className="speakers-slider flex gap-5 overflow-x-auto pt-2 pb-5 snap-x snap-mandatory"
                >
                    {speakers.map((speaker, index) => (
                        <Reveal
                            key={speaker.uniqueKey}
                            threshold={0.2}
                            distance={30}
                            delay={Math.min(index * 120, 600)}
                        >
                            <article className="card group relative flex h-full w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-3 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                                <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-xl bg-gray-100">
                                    <Image
                                        src={speaker.image.url}
                                        alt={speaker.displayName}
                                        fill
                                        sizes="(max-width: 640px) 220px, 250px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                </div>

                                <div className="flex flex-1 flex-col items-center px-2 pt-4 pb-3">
                                    <span className="mb-2 h-1 w-7 rounded-full bg-[var(--theme-primary)]" />

                                    <h3 className="text-base font-extrabold leading-7 text-[var(--theme-text)] sm:text-lg">
                                        {speaker.displayName}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium leading-6 text-[var(--theme-secondary)] opacity-60">
                                        {speaker.displayTitle}
                                    </p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .speakers-slider {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .speakers-slider::-webkit-scrollbar {
                    display: none;
                }

                .speakers-slider > :global(div) {
                    flex-shrink: 0;
                    scroll-snap-align: start;
                }
            `}</style>
        </div>
    );
}
