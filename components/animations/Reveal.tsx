// components/animations/Reveal.tsx
"use client";

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    distance?: number;
    threshold?: number;
    once?: boolean;
    disabled?: boolean;
}

export default function Reveal({
    children,
    className = "",
    delay = 0,
    duration = 700,
    distance = 30,
    threshold = 0.05,
    once = true,
    disabled = false,
}: RevealProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        if (disabled) {
            setHasEntered(true);
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (mediaQuery.matches) {
            setHasEntered(true);
            return;
        }

        if (!("IntersectionObserver" in window)) {
            setHasEntered(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasEntered(true);

                    if (once) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setHasEntered(false);
                }
            },
            {
                threshold: Math.min(Math.max(threshold, 0), 1),
                rootMargin: "0px 0px -40px 0px",
            }
        );

        observer.observe(element);

        const handleMotionChange = () => {
            if (mediaQuery.matches) {
                setHasEntered(true);
                observer.disconnect();
            } else {
                setHasEntered(false);
                observer.observe(element);
            }
        };

        mediaQuery.addEventListener("change", handleMotionChange);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener("change", handleMotionChange);
        };
    }, [disabled, once, threshold]);

    const revealStyles = {
        "--reveal-distance": `${Math.max(0, distance)}px`,
        "--reveal-duration": `${Math.max(0, duration)}ms`,
        "--reveal-delay": `${Math.max(0, delay)}ms`,
    } as CSSProperties;

    return (
        <>
            <div
                ref={elementRef}
                className={[
                    "reveal-element",
                    hasEntered ? "reveal-element-entered" : "",
                    disabled ? "reveal-element-disabled" : "",
                    className,
                ].filter(Boolean).join(" ")}
                style={revealStyles}
            >
                {children}
            </div>

            <style jsx>{`
                .reveal-element {
                    transform: translate3d(
                        0,
                        var(--reveal-distance),
                        0
                    );
                }

                .reveal-element-entered {
                    animation: reveal-enter
                        var(--reveal-duration)
                        cubic-bezier(0.22, 1, 0.36, 1)
                        var(--reveal-delay)
                        both;
                }

                .reveal-element-disabled {
                    transform: none;
                    animation: none;
                }

                @keyframes reveal-enter {
                    from {
                        transform: translate3d(
                            0,
                            var(--reveal-distance),
                            0
                        );
                    }

                    to {
                        transform: translate3d(0, 0, 0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .reveal-element {
                        transform: none;
                        animation: none;
                    }
                }
            `}</style>
        </>
    );
}
