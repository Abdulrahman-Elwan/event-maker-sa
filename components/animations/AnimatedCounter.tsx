// components/animations/AnimatedCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    value: string | number;
    duration?: number;
    delay?: number;
    threshold?: number;
    className?: string;
    once?: boolean;
}

interface ParsedValue {
    number: number;
    prefix: string;
    suffix: string;
    decimals: number;
    useGrouping: boolean;
}

function parseValue(value: string | number): ParsedValue {
    const stringValue = String(value).trim();

    const match = stringValue.match(
        /^([^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/
    );

    if (!match) {
        return {
            number: 0,
            prefix: "",
            suffix: stringValue,
            decimals: 0,
            useGrouping: false,
        };
    }

    const [, prefix, numberString, suffix] = match;
    const normalizedNumber = numberString.replace(/,/g, "");
    const parsedNumber = Number(normalizedNumber);

    return {
        number: Number.isFinite(parsedNumber) ? parsedNumber : 0,
        prefix,
        suffix,
        decimals: normalizedNumber.split(".")[1]?.length ?? 0,
        useGrouping: numberString.includes(","),
    };
}

export default function AnimatedCounter({
    value,
    duration = 2000,
    delay = 0,
    threshold = 0.25,
    className = "",
    once = true,
}: AnimatedCounterProps) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasAnimatedRef = useRef(false);

    const parsedValue = parseValue(value);

    // ثابت أثناء SSR و Hydration
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Detect reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const updateMotionPreference = () => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        updateMotionPreference();

        mediaQuery.addEventListener("change", updateMotionPreference);

        return () => {
            mediaQuery.removeEventListener("change", updateMotionPreference);
        };
    }, []);

    // Intersection Observer
    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        if (prefersReducedMotion) {
            setCount(parsedValue.number);
            setIsVisible(true);
            return;
        }

        // Fallback for unsupported browsers
        if (!("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (once) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setIsVisible(false);
                    hasAnimatedRef.current = false;
                }
            },
            {
                threshold: Math.min(Math.max(threshold, 0), 1),
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [prefersReducedMotion, parsedValue.number, threshold, once]);

    // Animation
    useEffect(() => {
        if (!isVisible) return;

        // Cleanup previous animation
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (prefersReducedMotion) {
            setCount(parsedValue.number);
            return;
        }

        if (once && hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;

        const safeDuration = Math.max(0, duration);
        const safeDelay = Math.max(0, delay);

        const startAnimation = () => {
            if (safeDuration === 0) {
                setCount(parsedValue.number);
                return;
            }

            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;

                const progress = Math.min(
                    elapsed / safeDuration,
                    1
                );

                // Ease Out Quart
                const easedProgress = 1 - Math.pow(1 - progress, 4);

                const currentValue =
                    parsedValue.number * easedProgress;

                setCount(currentValue);

                if (progress < 1) {
                    animationFrameRef.current =
                        requestAnimationFrame(animate);
                } else {
                    setCount(parsedValue.number);
                    animationFrameRef.current = null;
                }
            };

            animationFrameRef.current =
                requestAnimationFrame(animate);
        };

        timeoutRef.current = setTimeout(
            startAnimation,
            safeDelay
        );

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [
        isVisible,
        prefersReducedMotion,
        parsedValue.number,
        duration,
        delay,
        once,
    ]);

    const formattedCount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: parsedValue.decimals,
        maximumFractionDigits: parsedValue.decimals,
        useGrouping: parsedValue.useGrouping,
    }).format(count);

    return (
        <span
            ref={elementRef}
            className={className}
        >
            {parsedValue.prefix}
            {formattedCount}
            {parsedValue.suffix}
        </span>
    );
}
