
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiMaximize2,
    FiPlay,
    FiX,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionMedia } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

interface ExhibitionGalleryClientProps {
    locale: Locale;
    gallery: ExhibitionMedia[];
    exhibitionTitle: string;
}

export default function ExhibitionGalleryClient({
    locale,
    gallery,
    exhibitionTitle,
}: ExhibitionGalleryClientProps) {
    const isArabic = locale === "ar";

    const [activeIndex, setActiveIndex] = useState<number | null>(
        null
    );

    const activeMedia =
        activeIndex !== null
            ? gallery[activeIndex] ?? null
            : null;

    // Keyboard navigation and body scroll handling
    useEffect(() => {
        if (activeIndex === null) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveIndex(null);
                return;
            }

            if (event.key === "ArrowLeft") {
                setActiveIndex((current) => {
                    if (current === null) return null;

                    return current === 0
                        ? gallery.length - 1
                        : current - 1;
                });
            }

            if (event.key === "ArrowRight") {
                setActiveIndex((current) => {
                    if (current === null) return null;

                    return current === gallery.length - 1
                        ? 0
                        : current + 1;
                });
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow = previousOverflow;
        };
    }, [activeIndex, gallery.length]);

    if (!gallery.length) {
        return null;
    }

    const renderMedia = (
        media: ExhibitionMedia,
        index: number,
        className: string
    ) => {
        const isVideo = media.type === "video";

        const mediaLabel = isArabic
            ? `${isVideo ? "فيديو" : "صورة"} ${index + 1} من معرض ${exhibitionTitle}`
            : `${isVideo ? "Video" : "Image"} ${index + 1} from ${exhibitionTitle}`;

        return (
            <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={
                    isArabic
                        ? `فتح ${mediaLabel}`
                        : `Open ${mediaLabel}`
                }
                aria-haspopup="dialog"
                className={`group relative block h-full w-full cursor-pointer overflow-hidden text-start outline-none focus-visible:ring-2 focus-visible:ring-(--theme-primary) focus-visible:ring-offset-2 ${className}`}
            >
                {isVideo ? (
                    <video
                        src={media.url}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={mediaLabel}
                    />
                ) : (
                    <Image
                        src={media.url}
                        alt={mediaLabel}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-11 w-11 scale-90 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {isVideo ? (
                            <FiPlay className="ms-0.5 text-base" />
                        ) : (
                            <FiMaximize2 className="text-base" />
                        )}
                    </div>
                </div>

                {isVideo && (
                    <div className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        <FiPlay className="text-xs" />

                        <span>
                            {isArabic ? "فيديو" : "Video"}
                        </span>
                    </div>
                )}
            </button>
        );
    };

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[190px]">
                {gallery.slice(0, 7).map((media, index) => {
                    const layout =
                        index === 0
                            ? "col-span-2 row-span-2"
                            : index === 1
                                ? "col-span-1 row-span-2"
                                : index === 4
                                    ? "col-span-2 row-span-1"
                                    : "col-span-1 row-span-1";

                    return (
                        <Reveal
                            key={`${media.public_id}-${index}`}
                            delay={100 + index * 70}
                            distance={25}
                            threshold={0.1}
                            className={`relative min-h-0 ${layout}`}
                        >
                            {renderMedia(
                                media,
                                index,
                                "rounded-[1.35rem] border border-(--theme-secondary)/10 bg-(--theme-secondary) shadow-[0_15px_45px_rgba(15,23,42,0.08)]"
                            )}
                        </Reveal>
                    );
                })}
            </div>

            {/* Remaining Gallery Items */}
            {gallery.length > 7 && (
                <Reveal
                    delay={500}
                    distance={20}
                    threshold={0.1}
                >
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {gallery.slice(7).map((media, index) => {
                            const actualIndex = index + 7;

                            return (
                                <div
                                    key={`${media.public_id}-${actualIndex}`}
                                    className="relative aspect-[1.35] overflow-hidden rounded-[1.35rem]"
                                >
                                    {renderMedia(
                                        media,
                                        actualIndex,
                                        "rounded-[1.35rem] border border-(--theme-secondary)/10 bg-(--theme-secondary) shadow-[0_15px_45px_rgba(15,23,42,0.06)]"
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            )}

            {/* Lightbox */}
            {activeMedia && activeIndex !== null && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={
                        isArabic
                            ? "عارض معرض الصور"
                            : "Exhibition gallery viewer"
                    }
                    onClick={() => setActiveIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setActiveIndex(null)}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute end-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:end-7 sm:top-7"
                    >
                        <FiX className="text-xl" />
                    </button>

                    {gallery.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    setActiveIndex((current) =>
                                        current === null
                                            ? null
                                            : current === 0
                                                ? gallery.length - 1
                                                : current - 1
                                    );
                                }}
                                aria-label={
                                    isArabic
                                        ? "العنصر السابق"
                                        : "Previous media"
                                }
                                className="absolute start-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:start-6"
                            >
                                {isArabic ? (
                                    <FiChevronRight />
                                ) : (
                                    <FiChevronLeft />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    setActiveIndex((current) =>
                                        current === null
                                            ? null
                                            : current === gallery.length - 1
                                                ? 0
                                                : current + 1
                                    );
                                }}
                                aria-label={
                                    isArabic
                                        ? "العنصر التالي"
                                        : "Next media"
                                }
                                className="absolute end-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:end-6"
                            >
                                {isArabic ? (
                                    <FiChevronLeft />
                                ) : (
                                    <FiChevronRight />
                                )}
                            </button>
                        </>
                    )}

                    <div
                        className="relative flex h-full w-full max-w-6xl items-center justify-center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {activeMedia.type === "video" ? (
                            <video
                                key={activeMedia.public_id}
                                src={activeMedia.url}
                                className="max-h-[85vh] max-w-full rounded-2xl object-contain"
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <Image
                                key={activeMedia.public_id}
                                src={activeMedia.url}
                                alt={exhibitionTitle}
                                width={1600}
                                height={1000}
                                sizes="100vw"
                                className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
                            />
                        )}

                        <div className="absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md">
                            {activeIndex + 1} / {gallery.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
