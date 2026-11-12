// components\sections\exhibition\Animated\PreviousEditionStoryViewer.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import type {
    Exhibition,
    ExhibitionMedia,
} from "@/types/landingPage/exhibition";

import type { Locale } from "@/lib/i18n/config";

interface PreviousEditionStoryViewerProps {
    locale: Locale;
    exhibitions: Exhibition[];
}

function getText(
    value?: { ar?: string; en?: string } | null,
    locale?: Locale
) {
    if (!value) return "";

    return value[locale || "ar"] || value.en || value.ar || "";
}

function getMedia(exhibition: Exhibition): ExhibitionMedia[] {
    if (exhibition.gallery?.length > 0) {
        return exhibition.gallery;
    }

    if (exhibition.main_image?.url) {
        return [{ ...exhibition.main_image, type: "image" }];
    }

    return [];
}

function getYear(date: string, locale: Locale) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-US",
        { year: "numeric" }
    );
}

export default function PreviousEditionStoryViewer({
    locale,
    exhibitions,
}: PreviousEditionStoryViewerProps) {
    const [activeEdition, setActiveEdition] = useState<number | null>(null);
    const [activeMedia, setActiveMedia] = useState(0);

    const isArabic = locale === "ar";

    const selectedExhibition =
        activeEdition !== null
            ? exhibitions[activeEdition] ?? null
            : null;

    const selectedMedia = selectedExhibition
        ? getMedia(selectedExhibition)
        : [];

    const closeStory = useCallback(() => {
        setActiveEdition(null);
        setActiveMedia(0);
    }, []);

    const nextStory = useCallback(() => {
        if (activeEdition === null) return;

        const currentMedia = selectedExhibition
            ? getMedia(selectedExhibition)
            : [];

        if (activeMedia < currentMedia.length - 1) {
            setActiveMedia((previous) => previous + 1);
            return;
        }

        if (activeEdition < exhibitions.length - 1) {
            setActiveEdition(activeEdition + 1);
            setActiveMedia(0);
            return;
        }

        closeStory();
    }, [
        activeEdition,
        activeMedia,
        selectedExhibition,
        exhibitions.length,
        closeStory,
    ]);

    const previousStory = useCallback(() => {
        if (activeEdition === null) return;

        if (activeMedia > 0) {
            setActiveMedia((previous) => previous - 1);
            return;
        }

        if (activeEdition > 0) {
            const previousEdition = activeEdition - 1;
            const previousMedia = getMedia(exhibitions[previousEdition]);

            setActiveEdition(previousEdition);
            setActiveMedia(Math.max(previousMedia.length - 1, 0));
        }
    }, [activeEdition, activeMedia, exhibitions]);

    // Listen for card clicks
    useEffect(() => {
        const handleOpenStory = (event: Event) => {
            const customEvent = event as CustomEvent<number>;
            const index = customEvent.detail;

            if (
                typeof index !== "number" ||
                index < 0 ||
                index >= exhibitions.length
            ) {
                return;
            }

            setActiveEdition(index);
            setActiveMedia(0);
        };

        window.addEventListener(
            "event-maker:open-previous-edition",
            handleOpenStory
        );

        return () => {
            window.removeEventListener(
                "event-maker:open-previous-edition",
                handleOpenStory
            );
        };
    }, [exhibitions.length]);

    // Keyboard Navigation
    useEffect(() => {
        if (activeEdition === null) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeStory();
            if (event.key === "ArrowRight") nextStory();
            if (event.key === "ArrowLeft") previousStory();
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [
        activeEdition,
        closeStory,
        nextStory,
        previousStory,
    ]);

    if (!selectedExhibition) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020B12]/95 p-0 backdrop-blur-md sm:p-5"
            dir="ltr"
            role="dialog"
            aria-modal="true"
            aria-label={getText(selectedExhibition.title, locale)}
            onTouchStart={(event) => {
                const target = event.target as HTMLElement;

                if (target.closest("video")) return;

                (event.currentTarget as HTMLDivElement).dataset.touchStartX =
                    String(event.touches[0].clientX);
            }}
            onTouchEnd={(event) => {
                const startX = event.currentTarget.dataset.touchStartX;

                if (!startX) return;

                const difference =
                    event.changedTouches[0].clientX - Number(startX);

                if (Math.abs(difference) > 50) {
                    if (difference < 0) nextStory();
                    else previousStory();
                }

                delete event.currentTarget.dataset.touchStartX;
            }}
        >
            <div className="relative flex h-full w-full max-w-5xl items-center justify-center">

                {/* Close Button */}
                <button
                    type="button"
                    onClick={closeStory}
                    aria-label="Close story"
                    className="absolute end-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-3xl text-white backdrop-blur-md transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] sm:end-0 sm:top-0"
                >
                    ×
                </button>

                {/* Story Content */}
                <div className="relative flex h-full max-h-[850px] w-full max-w-[500px] flex-col overflow-hidden bg-[#071923] sm:rounded-2xl sm:shadow-2xl">

                    {/* Progress Bars */}
                    {selectedMedia.length > 0 && (
                        <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
                            {selectedMedia.map((_, index) => (
                                <span
                                    key={index}
                                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                                >
                                    <span
                                        className={`block h-full rounded-full transition-all duration-300 ${index <= activeMedia
                                            ? "w-full bg-[var(--theme-primary)]"
                                            : "w-0"
                                            }`}
                                    />
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Story Header */}
                    <div className="absolute inset-x-0 top-7 z-20 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent p-4 text-white">
                        <div className="relative h-11 w-11 flex-none overflow-hidden rounded-full border-2 border-[var(--theme-primary)] bg-white/10">
                            {selectedExhibition.exhibition_logo?.url ? (
                                <Image
                                    src={selectedExhibition.exhibition_logo.url}
                                    alt={getText(selectedExhibition.title, locale)}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : selectedExhibition.main_image?.url ? (
                                <Image
                                    src={selectedExhibition.main_image.url}
                                    alt={getText(selectedExhibition.title, locale)}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-1 text-sm font-bold">
                                {getText(selectedExhibition.title, locale)}
                            </h3>

                            <p className="mt-1 text-xs text-white/70">
                                {getYear(selectedExhibition.start_date, locale)}
                            </p>
                        </div>

                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                            {isArabic ? `النسخة ${selectedExhibition.version || (activeEdition ?? 0) + 1}` : `EDITION ${selectedExhibition.version || (activeEdition ?? 0) + 1}`}
                        </span>
                    </div>

                    {/* Active Media */}
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                        {selectedMedia[activeMedia]?.type === "video" ? (
                            <video
                                key={selectedMedia[activeMedia].url}
                                src={selectedMedia[activeMedia].url}
                                controls
                                autoPlay
                                playsInline
                                className="h-full w-full object-contain"
                            />
                        ) : selectedMedia[activeMedia]?.url ? (
                            <Image
                                key={selectedMedia[activeMedia].url}
                                src={selectedMedia[activeMedia].url}
                                alt={getText(selectedExhibition.title, locale)}
                                fill
                                unoptimized
                                priority
                                sizes="(max-width: 640px) 100vw, 500px"
                                className="object-contain"
                            />
                        ) : (
                            <div className="px-6 text-center text-white">
                                {getText(selectedExhibition.title, locale)}
                            </div>
                        )}

                        {/* Navigation Areas */}
                        <button
                            type="button"
                            onClick={previousStory}
                            aria-label="Previous story"
                            disabled={activeEdition === 0 && activeMedia === 0}
                            className="absolute inset-y-0 start-0 z-[5] w-[20%] disabled:cursor-default"
                        />

                        <button
                            type="button"
                            onClick={nextStory}
                            aria-label="Next story"
                            className="absolute inset-y-0 end-0 z-[5] w-[20%]"
                        />
                    </div>

                    {/* Story Footer */}
                    <div className="relative z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-5 pb-7 pt-8 text-white">
                        <h4 className="text-base font-bold sm:text-lg">
                            {getText(selectedExhibition.title, locale)}
                        </h4>

                        <p className="mt-2 line-clamp-3 text-xs leading-6 text-white/70 sm:text-sm">
                            {getText(selectedExhibition.meta, locale) ||
                                getText(selectedExhibition.description, locale)}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-xs text-white/60">
                            <span>
                                {getYear(selectedExhibition.start_date, locale)}
                            </span>

                            <span>
                                {selectedMedia.length > 0
                                    ? `${activeMedia + 1} / ${selectedMedia.length}`
                                    : "0 / 0"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <button
                    type="button"
                    onClick={previousStory}
                    aria-label="Previous"
                    disabled={activeEdition === 0 && activeMedia === 0}
                    className="absolute start-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-md transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] disabled:cursor-not-allowed disabled:opacity-30 sm:flex lg:start-[-65px]"
                >
                    ‹
                </button>

                <button
                    type="button"
                    onClick={nextStory}
                    aria-label="Next"
                    className="absolute end-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-md transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] sm:flex lg:end-[-65px]"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
