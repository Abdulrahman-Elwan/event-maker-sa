import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";
import Reveal from "@/components/animations/Reveal";

interface ServiceIntroductionSectionProps {
    locale: Locale;
    service: ServiceItem;
}

function cleanRichText(html: string) {
    return html
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n+/g, "\n")
        .replace(/[ \t]*\n[ \t]*/g, "\n")
        .trim();
}

export default function ServiceIntroductionSection({
    locale,
    service,
}: ServiceIntroductionSectionProps) {
    const isArabic = locale === "ar";

    const introduction = service.content?.main?.introduction;

    if (!introduction) {
        return null;
    }

    const title = introduction.title?.[locale] || service.title[locale];

    const description = cleanRichText(
        introduction.description?.[locale] ?? "",
    );

    const images = Array.isArray(introduction.images)
        ? introduction.images
        : [];

    const primaryImage = images[0];
    const secondaryImage = images[1];

    const hasContent =
        Boolean(title) ||
        Boolean(description) ||
        Boolean(primaryImage?.url) ||
        Boolean(secondaryImage?.url);

    if (!hasContent) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-14 sm:py-18 lg:py-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="relative overflow-hidden bg-white">
                    {/* Background accent */}
                    <div className={`pointer-events-none absolute -top-40 h-96 w-96 rounded-full bg-(--theme-primary)/[0.06] blur-[120px] ${isArabic ? "-start-40" : "-end-40"}`}/>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2">
                        {/* Content */}
                        <div className="relative flex min-h-[560px] flex-col justify-center py-12 sm:py-16 lg:min-h-[680px] lg:py-20">
                            <div className="relative z-10 max-w-xl">
                                <Reveal delay={100} distance={20}>
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--theme-primary) sm:text-xs">
                                            {isArabic
                                                ? "عن هذه الخدمة"
                                                : "ABOUT THIS SERVICE"}
                                        </span>
                                    </div>
                                </Reveal>

                                <Reveal delay={180} distance={25}>
                                    <h2 className="max-w-lg text-3xl font-extrabold leading-[1.15] tracking-tight text-(--theme-secondary) sm:text-4xl md:text-5xl lg:text-[3.2rem]">
                                        {title}
                                    </h2>
                                </Reveal>

                                {description && (
                                    <Reveal delay={280} distance={22}>
                                        <div
                                            className={`prose mt-7 max-w-none text-sm leading-8 text-(--theme-text)/70 sm:mt-8 sm:text-base sm:leading-9 ${isArabic
                                                ? "prose-headings:text-right"
                                                : "prose-headings:text-left"
                                                }`}
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}
                                        />
                                    </Reveal>
                                )}
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="relative min-h-[440px] sm:min-h-[520px] lg:min-h-[680px]">
                            {/* Main image */}
                            {primaryImage?.url && (
                                <div className="absolute inset-0">
                                    <Reveal delay={180} distance={25} className="h-full w-full" >
                                        <div className="relative h-full w-full overflow-hidden p-2.5">
                                            <Image
                                                src={primaryImage.url}
                                                alt={title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 rounded-3xl"
                                            />
                                        </div>
                                    </Reveal>
                                </div>
                            )}

                            {/* Secondary image */}
                            {secondaryImage?.url && (
                                <div
                                    className={`absolute bottom-7 z-20 w-[46%] sm:bottom-10 sm:w-[40%] lg:bottom-14 lg:w-[38%] 
                                        ${isArabic ? "start-5 sm:start-8 lg:start-10" : "end-5 sm:end-8 lg:end-10"}`}
                                >
                                    <Reveal delay={380} distance={30}>
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-[6px] border-white bg-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:border-8">
                                            <Image
                                                src={secondaryImage.url}
                                                alt={title}
                                                fill
                                                sizes="(max-width: 1024px) 40vw, 20vw"
                                                className="object-cover rounded-2xl transition-transform duration-700 hover:scale-[1.04]"
                                            />
                                        </div>
                                    </Reveal>
                                </div>
                            )}

                            {/* Primary accent */}
                            <div
                                className={`pointer-events-none absolute bottom-0 z-30 h-20 w-20 border-(--theme-primary) ${isArabic
                                    ? "end-0 border-s-2 border-t-2"
                                    : "start-0 border-e-2 border-t-2"
                                    }`}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}