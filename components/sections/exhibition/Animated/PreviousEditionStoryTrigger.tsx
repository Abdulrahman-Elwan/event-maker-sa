// components\sections\exhibition\Animated\PreviousEditionStoryTrigger.tsx
"use client";

import type { ReactNode } from "react";

interface PreviousEditionStoryTriggerProps {
    index: number;
    ariaLabel: string;
    className?: string;
    children: ReactNode;
}

export default function PreviousEditionStoryTrigger({
    index,
    ariaLabel,
    className,
    children,
}: PreviousEditionStoryTriggerProps) {
    const handleClick = () => {
        window.dispatchEvent(
            new CustomEvent("event-maker:open-previous-edition", {
                detail: index,
            })
        );
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={ariaLabel}
            className={className}
        >
            {children}
        </button>
    );
}
