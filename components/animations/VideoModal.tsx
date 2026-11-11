// components\animations\VideoModal.tsx
"use client";

import { useEffect, useState } from "react";
import { FiPlay, FiX } from "react-icons/fi";

interface VideoModalProps {
    video: string;
    playLabel?: string;
    closeLabel?: string;
    modalLabel?: string;
    className?: string;
    playButtonClassName?: string;
    autoPlay?: boolean;
    controls?: boolean;
}

export default function VideoModal({ video, playLabel = "Play video", closeLabel = "Close video", modalLabel = "Video", className = "", playButtonClassName = "", autoPlay = true, controls = true, }: VideoModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {setIsOpen(false);}
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} aria-label={playLabel}
                className={`group absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[var(--theme-primary)] text-[var(--theme-secondary)] shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)] sm:h-[72px] sm:w-[72px] ${playButtonClassName}`}
            >
                <FiPlay className="ml-1 cursor-pointer fill-current text-2xl transition-transform duration-300 group-hover:scale-110" />
            </button>

            {isOpen && (
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 sm:p-6 lg:p-10 ${className}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={modalLabel}
                    onMouseDown={(event) => {if (event.target === event.currentTarget) {setIsOpen(false);}}}
                >
                    <button type="button" onClick={() => setIsOpen(false)} aria-label={closeLabel}
                        className="absolute right-4 top-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:right-6 sm:top-6"
                    >
                        <FiX className="text-xl" />
                    </button>

                    <div className="relative flex h-full w-full items-center justify-center">
                        <video key={video} className="max-h-full max-w-full rounded-lg object-contain" src={video} playsInline preload="metadata" controls={controls} autoPlay={autoPlay}/>
                    </div>
                </div>
            )}
        </>
    );
}
