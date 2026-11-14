"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
    FiArrowLeft,
    FiArrowRight,
    FiPlay,
    FiX,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Session } from "@/types/sessions";

interface SessionsSliderProps {
    locale: Locale;
    sessions: Session[];
}

function getYoutubeEmbedUrl(url: string) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtube.com")) {
            const videoId = parsedUrl.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }

            const pathParts = parsedUrl.pathname.split("/");
            const shortsIndex = pathParts.indexOf("shorts");

            if (shortsIndex !== -1 && pathParts[shortsIndex + 1]) {
                return `https://www.youtube.com/embed/${pathParts[shortsIndex + 1]}?autoplay=1&rel=0`;
            }
        }

        if (parsedUrl.hostname === "youtu.be") {
            const videoId = parsedUrl.pathname.slice(1);

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }
        }
    } catch {
        return null;
    }

    return null;
}

export default function SessionsSlider({
    locale,
    sessions,
}: SessionsSliderProps) {
    const isArabic = locale === "ar";
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const visibleSlides = 3;
    const totalPages = Math.max(
        Math.ceil(sessions.length / visibleSlides),
        1
    );
    const currentPage = Math.min(
        Math.floor(activeIndex / visibleSlides),
        totalPages - 1
    );

    const scrollToSlide = (index: number) => {
        const slider = sliderRef.current;

        if (!slider) {
            return;
        }

        const slide = slider.children[index] as HTMLElement | undefined;

        if (!slide) {
            return;
        }

        slider.scrollTo({
            left: slide.offsetLeft,
            behavior: "smooth",
        });

        setActiveIndex(index);
    };

    const next = () => {
        const nextIndex = Math.min(
            activeIndex + visibleSlides,
            sessions.length - 1
        );

        scrollToSlide(nextIndex);
    };

    const previous = () => {
        const previousIndex = Math.max(
            activeIndex - visibleSlides,
            0
        );

        scrollToSlide(previousIndex);
    };

    const handleScroll = () => {
        const slider = sliderRef.current;

        if (!slider || !slider.children.length) {
            return;
        }

        const slides = Array.from(
            slider.children
        ) as HTMLElement[];

        const closestIndex = slides.reduce(
            (closest, slide, index) => {
                const currentDistance = Math.abs(
                    slide.offsetLeft - slider.scrollLeft
                );

                const closestDistance = Math.abs(
                    slides[closest].offsetLeft -
                        slider.scrollLeft
                );

                return currentDistance < closestDistance
                    ? index
                    : closest;
            },
            0
        );

        setActiveIndex(closestIndex);
    };

    return (
        <>
            <div className="relative" dir="ltr">
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
                >
                    {sessions.map((session) => {
                        const title =
                            session.title[
                                isArabic ? "ar" : "en"
                            ];

                        const embedUrl =
                            getYoutubeEmbedUrl(
                                session.youtubeUrl
                            );

                        return (
                            <div
                                key={session.id}
                                className="w-full shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3"
                            >
                                <article className="group cursor-pointer overflow-hidden rounded-3xl border border-(--theme-secondary)/8 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (embedUrl) {
                                                setActiveVideo(embedUrl);
                                            }
                                        }}
                                        disabled={!embedUrl}
                                        aria-label={
                                            isArabic
                                                ? `تشغيل جلسة ${title}`
                                                : `Play ${title}`
                                        }
                                        className="block w-full text-start"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-(--theme-secondary)">
                                            <Image
                                                src={
                                                    session.poster.url
                                                }
                                                alt={title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/35" />

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span
                                                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300 group-hover:scale-110 sm:h-18 sm:w-18"
                                                    style={{
                                                        backgroundColor:
                                                            "var(--theme-primary)",
                                                    }}
                                                >
                                                    <FiPlay className="ms-0.5 size-6 fill-current text-(--theme-secondary)" />
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="p-5 sm:p-6">
                                        <h3 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-(--theme-secondary) transition-colors duration-300 group-hover:text-(--theme-primary) sm:text-xl">
                                            {title}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (embedUrl) {
                                                    setActiveVideo(
                                                        embedUrl
                                                    );
                                                }
                                            }}
                                            disabled={!embedUrl}
                                            className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-(--theme-text)/60 transition-colors duration-300 hover:text-(--theme-primary) disabled:cursor-not-allowed"
                                        >
                                            <span>
                                                {isArabic
                                                    ? "مشاهدة الجلسة"
                                                    : "Watch Session"}
                                            </span>

                                            {isArabic ? (
                                                <FiArrowLeft className="transition-transform duration-300 group-hover/link:-translate-x-1" />
                                            ) : (
                                                <FiArrowRight className="transition-transform duration-300 group-hover/link:translate-x-1" />
                                            )}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>

                {sessions.length > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={previous}
                                disabled={currentPage === 0}
                                aria-label={
                                    isArabic
                                        ? "الجلسات السابقة"
                                        : "Previous sessions"
                                }
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-(--theme-secondary)/10 bg-white text-(--theme-secondary) transition-all duration-300 hover:border-(--theme-primary) hover:text-(--theme-primary) disabled:pointer-events-none disabled:opacity-30"
                            >
                                <FiArrowLeft />
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                disabled={
                                    currentPage >=
                                    totalPages - 1
                                }
                                aria-label={
                                    isArabic
                                        ? "الجلسات التالية"
                                        : "Next sessions"
                                }
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-(--theme-secondary)/10 bg-white text-(--theme-secondary) transition-all duration-300 hover:border-(--theme-primary) hover:text-(--theme-primary) disabled:pointer-events-none disabled:opacity-30"
                            >
                                <FiArrowRight />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {Array.from({
                                length: totalPages,
                            }).map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        scrollToSlide(
                                            Math.min(
                                                index *
                                                    visibleSlides,
                                                sessions.length -
                                                    1
                                            )
                                        )
                                    }
                                    aria-label={
                                        isArabic
                                            ? `الانتقال إلى المجموعة ${index + 1}`
                                            : `Go to group ${index + 1}`
                                    }
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentPage
                                            ? "w-8 bg-(--theme-primary)"
                                            : "w-1.5 bg-(--theme-secondary)/15"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {activeVideo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6"
                    onClick={() =>
                        setActiveVideo(null)
                    }
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setActiveVideo(null)
                            }
                            aria-label={
                                isArabic
                                    ? "إغلاق الفيديو"
                                    : "Close video"
                            }
                            className="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-(--theme-primary) hover:text-(--theme-secondary)"
                        >
                            <FiX className="size-5" />
                        </button>

                        <div className="aspect-video w-full">
                            <iframe
                                src={activeVideo}
                                title={
                                    isArabic
                                        ? "جلسة ولقاء"
                                        : "Session & Talk"
                                }
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}