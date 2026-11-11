// contexts\ServicesContext.tsx
"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

import type { Service } from "@/types/service";

interface ServicesContextValue {
    services: Service[];
    activeService: Service | null;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    setActiveService: (service: Service) => void;
    getServiceBySlug: (slug: string) => Service | undefined;
}

interface ServicesProviderProps {
    children: React.ReactNode;
    initialServices: Service[];
}

const ServicesContext =
    createContext<ServicesContextValue | null>(null);

export function ServicesProvider({
    children,
    initialServices,
}: ServicesProviderProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeService =
        initialServices[activeIndex] ?? null;

    const value = useMemo(
        () => ({
            services: initialServices,

            activeService,

            activeIndex,

            setActiveIndex,

            setActiveService: (service: Service) => {
                const index = initialServices.findIndex(
                    (item) => item.id === service.id
                );

                if (index !== -1) {
                    setActiveIndex(index);
                }
            },

            getServiceBySlug: (slug: string) =>
                initialServices.find(
                    (service) => service.slug === slug
                ),
        }),
        [
            initialServices,
            activeIndex,
            activeService,
        ]
    );

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
}

export function useServices() {
    const context = useContext(ServicesContext);

    if (!context) {
        throw new Error(
            "useServices must be used inside ServicesProvider"
        );
    }

    return context;
}