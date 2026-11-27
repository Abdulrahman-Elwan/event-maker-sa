
"use client";

import { useEffect, useState } from "react";

interface DeferredBackgroundVideoProps {
    src: string;
}

export default function DeferredBackgroundVideo({
    src,
}: DeferredBackgroundVideoProps) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const connection = (
            navigator as Navigator & {
                connection?: {
                    saveData?: boolean;
                };
            }
        ).connection;

        if (reducedMotion || connection?.saveData) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShouldLoad(true);
        }, 1200);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    if (!shouldLoad) {
        return null;
    }

    return (
        <video
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                isPlaying ? "opacity-100" : "opacity-0"
            }`}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            disablePictureInPicture
            onPlaying={() => setIsPlaying(true)}
        />
    );
}
