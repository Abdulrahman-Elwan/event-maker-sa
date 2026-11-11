// contexts\ExhibitionsContext.tsx
"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { Exhibition } from "@/types/landingPage/exhibition";
import {
    getExhibitionStatus,
    type ExhibitionStatus,
} from "@/lib/utils/exhibition";

interface ExhibitionsContextValue {
    exhibitions: Exhibition[];
    status: ExhibitionStatus;
    setStatus: (status: ExhibitionStatus) => void;

    filteredExhibitions: Exhibition[];

    ongoingExhibitions: Exhibition[];
    upcomingExhibitions: Exhibition[];
    finishedExhibitions: Exhibition[];

    getExhibitionBySlug: (
        slug: string
    ) => Exhibition | undefined;
}

interface ExhibitionsProviderProps {
    children: ReactNode;
    initialExhibitions: Exhibition[];
    today: string;
}

const ExhibitionsContext =
    createContext<ExhibitionsContextValue | null>(null);

export function ExhibitionsProvider({
    children,
    initialExhibitions,
    today,
}: ExhibitionsProviderProps) {
    const [status, setStatus] =
        useState<ExhibitionStatus>("all");

    // Ongoing exhibitions
    const ongoingExhibitions = useMemo(() => {
        return initialExhibitions.filter(
            (exhibition) =>
                getExhibitionStatus(exhibition, today) === "ongoing"
        );
    }, [initialExhibitions, today]);

    // Upcoming exhibitions
    const upcomingExhibitions = useMemo(() => {
        return initialExhibitions.filter(
            (exhibition) =>
                getExhibitionStatus(exhibition, today) === "upcoming"
        );
    }, [initialExhibitions, today]);

    // Finished exhibitions
    const finishedExhibitions = useMemo(() => {
        return initialExhibitions.filter(
            (exhibition) =>
                getExhibitionStatus(exhibition, today) === "finished"
        );
    }, [initialExhibitions, today]);

    // Filtered exhibitions
    const filteredExhibitions = useMemo(() => {
        switch (status) {
            case "ongoing":
                return ongoingExhibitions;

            case "upcoming":
                return upcomingExhibitions;

            case "finished":
                return finishedExhibitions;

            default:
                return initialExhibitions;
        }
    }, [
        status,
        initialExhibitions,
        ongoingExhibitions,
        upcomingExhibitions,
        finishedExhibitions,
    ]);

    // Get exhibition by slug
    const getExhibitionBySlug = (
        slug: string
    ) => {
        return initialExhibitions.find(
            (exhibition) => exhibition.slug === slug
        );
    };

    const value = useMemo(
        () => ({
            exhibitions: initialExhibitions,
            status,
            setStatus,
            filteredExhibitions,
            ongoingExhibitions,
            upcomingExhibitions,
            finishedExhibitions,
            getExhibitionBySlug,
        }),
        [
            initialExhibitions,
            status,
            filteredExhibitions,
            ongoingExhibitions,
            upcomingExhibitions,
            finishedExhibitions,
        ]
    );

    return (
        <ExhibitionsContext.Provider value={value}>
            {children}
        </ExhibitionsContext.Provider>
    );
}

export function useExhibitions() {
    const context = useContext(ExhibitionsContext);

    if (!context) {
        throw new Error(
            "useExhibitions must be used inside ExhibitionsProvider"
        );
    }

    return context;
}
