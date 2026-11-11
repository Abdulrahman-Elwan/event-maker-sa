
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { AboutTeam } from "@/types/about/about";

import Reveal from "@/components/animations/Reveal";

interface OurTeamSectionProps {
    locale: Locale;
    team: AboutTeam;
}

export default function OurTeamSection({
    locale,
    team,
}: OurTeamSectionProps) {
    const isArabic = locale === "ar";

    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderViewportRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isSliderVisible, setIsSliderVisible] = useState(false);

    const validMembers = (team?.members ?? []).flatMap((member, index) => {
        const imageUrl = member?.image;
        const name =
            member?.name?.[locale] ||
            member?.name?.[isArabic ? "en" : "ar"];
        const position =
            member?.position?.[locale] ||
            member?.position?.[isArabic ? "en" : "ar"];

        if (!imageUrl || !name || !position) return [];

        return [
            {
                ...member,
                displayName: name,
                displayPosition: position,
                uniqueKey: `${imageUrl}-${index}`,
            },
        ];
    });

    const membersCount = validMembers.length;

    const scrollToNext = useCallback(() => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return;

        const gap =
            parseFloat(window.getComputedStyle(slider).columnGap) || 20;

        const step = firstCard.offsetWidth + gap;
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft >= maxScroll - 10) {
            slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            slider.scrollBy({ left: step, behavior: "smooth" });
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
            slider.scrollBy({ left: -step, behavior: "smooth" });
        }
    }, []);

    /* Detect Slider Visibility */
    useEffect(() => {
        const sliderViewport = sliderViewportRef.current;

        if (!sliderViewport) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSliderVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(sliderViewport);

        return () => observer.disconnect();
    }, []);

    /* Auto Slider */
    useEffect(() => {
        if (!isSliderVisible || isPaused || membersCount < 3) return;

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (mediaQuery.matches) return;

        const interval = window.setInterval(scrollToNext, 4500);

        return () => window.clearInterval(interval);
    }, [isSliderVisible, isPaused, membersCount, scrollToNext]);

    /* Update Active Pagination */
    const handleScroll = () => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return;

        const gap =
            parseFloat(window.getComputedStyle(slider).columnGap) || 20;

        const step = firstCard.offsetWidth + gap;
        const index = Math.round(slider.scrollLeft / step);

        setActiveIndex(Math.min(index, membersCount - 1));
    };

    const scrollToIndex = (index: number) => {
        const slider = sliderRef.current;
        const card = slider?.children[index] as HTMLElement | undefined;

        if (!slider || !card) return;

        slider.scrollTo({
            left: card.offsetLeft - slider.offsetLeft,
            behavior: "smooth",
        });
    };

    if (!membersCount) return null;

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="section relative overflow-hidden bg-(--theme-background) py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.7fr] lg:gap-12">

                    {/* Section Content */}
                    <div className="text-center lg:text-start">
                        <Reveal threshold={0.2} distance={25} delay={120}>
                            <h2 className="text-3xl font-extrabold leading-snug text-(--theme-primary) sm:text-4xl lg:text-[2.65rem]">
                                {team.title[locale]}
                            </h2>
                        </Reveal>

                        <Reveal threshold={0.2} distance={25} delay={240}>
                            <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-(--theme-secondary) opacity-70 sm:text-base lg:mx-0">
                                {team.description[locale]}
                            </p>
                        </Reveal>

                        {membersCount >= 3 && (
                            <Reveal threshold={0.2} distance={25} delay={360}>
                                {/* Slider Controls */}
                                <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
                                    <button
                                        type="button"
                                        onClick={scrollToPrevious}
                                        aria-label={
                                            isArabic
                                                ? "العضو السابق"
                                                : "Previous member"
                                        }
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-(--theme-primary)/20 bg-white text-xl font-bold text-(--theme-secondary) shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-(--theme-primary) hover:text-white"
                                    >
                                        {isArabic ? "→" : "←"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={scrollToNext}
                                        aria-label={
                                            isArabic
                                                ? "العضو التالي"
                                                : "Next member"
                                        }
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-(--theme-primary)/20 bg-white text-xl font-bold text-(--theme-secondary) shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-(--theme-primary) hover:text-white"
                                    >
                                        {isArabic ? "←" : "→"}
                                    </button>
                                </div>

                                {/* Pagination */}
                                <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
                                    {validMembers.map((member, index) => (
                                        <button
                                            key={member.uniqueKey}
                                            type="button"
                                            aria-label={
                                                isArabic
                                                    ? `الانتقال إلى عضو الفريق ${index + 1}`
                                                    : `Go to team member ${index + 1}`
                                            }
                                            onClick={() => scrollToIndex(index)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                activeIndex === index
                                                    ? "w-7 bg-(--theme-primary)"
                                                    : "w-2 bg-(--theme-secondary)/25"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </Reveal>
                        )}
                    </div>

                    {/* Team Slider */}
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
                            dir="ltr"
                            onScroll={handleScroll}
                            className="team-slider flex gap-5 overflow-x-auto pt-2 pb-5 snap-x snap-mandatory"
                        >
                            {validMembers.map((member, index) => (
                                <Reveal
                                    key={member.uniqueKey}
                                    threshold={0.2}
                                    distance={30}
                                    delay={index * 120}
                                >
                                    <article
                                        dir={isArabic ? "rtl" : "ltr"}
                                        className="group relative flex h-full w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-3 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] sm:w-[250px]"
                                    >
                                        {/* Member Image */}
                                        <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-xl bg-gray-100">
                                            <Image
                                                src={member.image}
                                                alt={member.displayName}
                                                fill
                                                sizes="(max-width: 640px) 220px, 250px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                        </div>

                                        {/* Member Info */}
                                        <div className="flex flex-1 flex-col items-center px-2 pt-4 pb-3">
                                            <span className="mb-2 h-1 w-7 rounded-full bg-(--theme-primary)" />

                                            <h3 className="text-base font-extrabold leading-7 text-(--theme-secondary) sm:text-lg">
                                                {member.displayName}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium leading-6 text-(--theme-secondary) opacity-60">
                                                {member.displayPosition}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .team-slider {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .team-slider::-webkit-scrollbar {
                    display: none;
                }

                .team-slider > :global(div) {
                    flex-shrink: 0;
                    scroll-snap-align: start;
                }
            `}</style>
        </section>
    );
}
