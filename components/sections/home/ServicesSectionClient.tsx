
"use client";

import Image from "next/image";
import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import { useServices } from "@/contexts/ServicesContext";

interface ServicesSectionClientProps {
    locale: Locale;
}

export default function ServicesSectionClient({
    locale,
}: ServicesSectionClientProps) {
    const isArabic = locale === "ar";

    const {
        services,
        activeIndex,
        setActiveIndex,
    } = useServices();

    if (services.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">

            {/* Services Navigation */}
            <nav
                aria-label={
                    isArabic
                        ? "اختيار الخدمة"
                        : "Select a service"
                }
                className="order-1 -mx-5 overflow-x-auto px-5 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden lg:order-2 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0"
            >
                <div
                    role="group"
                    className="flex w-max gap-3 pe-5 lg:w-auto lg:flex-col lg:gap-2 lg:pe-0"
                >
                    {services.map((service, index) => {
                        const serviceTitle =
                            service.title[isArabic ? "ar" : "en"];

                        const isActive = index === activeIndex;

                        const tabId = `service-tab-${service.id}`;

                        const panelId = `service-panel-${service.id}`;

                        return (
                            <button
                                key={service.id}
                                id={tabId}
                                type="button"
                                aria-pressed={isActive}
                                aria-controls={panelId}
                                onClick={() => setActiveIndex(index)}
                                className={`group flex w-[78vw] max-w-[320px] min-w-0 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-start transition-all duration-300 sm:w-[65vw] lg:min-h-20 lg:w-full lg:gap-4 lg:px-4 lg:py-3 ${isActive
                                    ? "border-(--theme-primary) bg-white/10"
                                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl lg:h-14 lg:w-16">
                                    {service.coverImage?.url && (
                                        <Image
                                            src={service.coverImage.url}
                                            alt=""
                                            fill
                                            sizes="(max-width: 1023px) 48px, 64px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-black/20" />
                                </div>

                                {/* Service Title */}
                                <div className="min-w-0 flex-1">
                                    <span className="block text-[10px] tracking-widest text-white/30">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span
                                        className={`mt-0.5 block truncate text-xs font-semibold leading-6 transition-colors lg:text-sm ${isActive
                                            ? "text-white"
                                            : "text-white/55 group-hover:text-white"
                                            }`}
                                    >
                                        {serviceTitle}
                                    </span>
                                </div>

                                {/* Active Indicator */}
                                <div
                                    className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${isActive
                                        ? "scale-125"
                                        : "bg-white/20"
                                        }`}
                                    style={
                                        isActive
                                            ? {
                                                backgroundColor:
                                                    "var(--theme-primary)",
                                            }
                                            : undefined
                                    }
                                />
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Service Panels */}
            <div className="order-2 min-w-0 lg:order-1">
                {services.map((service, index) => {
                    const isActive = index === activeIndex;

                    const title =
                        service.title[isArabic ? "ar" : "en"];

                    const description =
                        service.shortDescription[
                        isArabic ? "ar" : "en"
                        ];

                    const tabId = `service-tab-${service.id}`;

                    const panelId = `service-panel-${service.id}`;

                    return (
                        <div
                            key={service.id}
                            id={panelId}
                            role="region"
                            aria-labelledby={tabId}
                            hidden={!isActive}
                            tabIndex={0}
                            className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-black lg:min-h-[560px]"
                        >
                            {/* Main Image */}
                            {service.coverImage?.url && (
                                <Image
                                    src={service.coverImage.url}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 1023px) 100vw, 70vw"
                                    className="object-cover"
                                />
                            )}

                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />

                            {/* Counter */}
                            <div
                                className={`absolute top-5 ${isArabic ? "right-5" : "left-5"
                                    } flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white/70 backdrop-blur-md`}
                            >
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="h-px w-4 bg-white/25" />

                                <span>
                                    {String(services.length).padStart(2, "0")}
                                </span>
                            </div>

                            {/* Service Content */}
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-10">

                                <h3 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                                    {title}
                                </h3>

                                <p className="mt-3 max-w-2xl line-clamp-3 text-sm leading-6 text-white/65 sm:text-base sm:leading-7 lg:line-clamp-none">
                                    {description}
                                </p>

                                <Link
                                    href={
                                        isArabic
                                            ? `/services/${service.slug}`
                                            : `/en/services/${service.slug}`
                                    }
                                    className="group mt-5 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:brightness-110"
                                    style={{
                                        backgroundColor:
                                            "var(--theme-primary)",
                                    }}
                                >
                                    <span>
                                        {isArabic
                                            ? "اكتشف الخدمة"
                                            : "Explore Service"}
                                    </span>

                                    {isArabic ? (
                                        <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                                    ) : (
                                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    )}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
