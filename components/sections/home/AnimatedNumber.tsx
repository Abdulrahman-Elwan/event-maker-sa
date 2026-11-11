
"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
    value: string;
}

export default function AnimatedNumber({
    value,
}: AnimatedNumberProps) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const animationRef = useRef<number | null>(null);

    const match = value.match(/^([\d,.]+)\s*(.*)$/);

    const numericValue = match
        ? Number(match[1].replace(/,/g, ""))
        : NaN;

    const suffix = match?.[2] ?? "";

    const isNumeric = Number.isFinite(numericValue);

    const decimalPlaces = match?.[1].split(".")[1]?.length ?? 0;

    // Keep the original value during SSR and initial hydration.
    const [hasStarted, setHasStarted] = useState(false);
    const [currentValue, setCurrentValue] = useState(numericValue);

    // Detect when the number enters the viewport.
    useEffect(() => {
        const element = elementRef.current;

        if (!element || !isNumeric) {
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        // Keep the original value without animation.
        if (
            mediaQuery.matches ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [isNumeric]);

    // Start counting only after entering the viewport.
    useEffect(() => {
        if (!hasStarted || !isNumeric) {
            return;
        }

        const duration = 1800;
        const startTime = performance.now();

        const factor = Math.pow(10, decimalPlaces);

        setCurrentValue(0);

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            // Smooth ease-out.
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const nextValue =
                Math.round(
                    easedProgress * numericValue * factor
                ) / factor;

            setCurrentValue(nextValue);

            if (progress < 1) {
                animationRef.current =
                    requestAnimationFrame(animate);
            } else {
                setCurrentValue(numericValue);
                animationRef.current = null;
            }
        };

        animationRef.current =
            requestAnimationFrame(animate);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [hasStarted, numericValue, isNumeric, decimalPlaces]);

    if (!isNumeric) {
        return <span>{value}</span>;
    }

    // The original value is rendered in the server HTML.
    if (!hasStarted) {
        return (
            <span
                ref={elementRef}
                aria-label={value}
            >
                {value}
            </span>
        );
    }

    return (
        <span
            ref={elementRef}
            aria-label={value}
        >
            {currentValue.toLocaleString(undefined, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
            })}
            {suffix}
        </span>
    );
}
