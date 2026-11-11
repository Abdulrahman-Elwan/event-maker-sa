"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatValueProps {
    value: string;
    duration?: number;
}

export default function AnimatedStatValue({
    value,
    duration = 2000,
}: AnimatedStatValueProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    // Extract numeric value and preserve suffix/prefix.
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);

    const prefix = match?.[1] ?? "";
    const target = match ? Number(match[2].replace(/,/g, "")) : 0;
    const suffix = match?.[3] ?? "";

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
            setCount(target);
            return;
        }

        let animationFrame = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;

            const progress = Math.min(
                (timestamp - startTime) / duration,
                1
            );

            // Ease-out animation.
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(target * easedProgress);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, target, duration]);

    const formattedCount = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: Number.isInteger(target) ? 0 : 2,
    }).format(count);

    return (
        <span ref={elementRef} aria-label={value}>
            {prefix}
            {formattedCount}
            {suffix}
        </span>
    );
}