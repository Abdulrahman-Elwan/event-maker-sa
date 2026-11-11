import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ServicesContent } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";

interface ServicesStorySectionProps {
    locale: Locale;
    content: ServicesContent;
}

export default function ServicesStorySection({
    locale,
    content,
}: ServicesStorySectionProps) {
    const isArabic = locale === "ar";

    const description = isArabic
        ? content.content_ar
        : content.content_en;

    const mainImage = content.main_image?.url;
    const secondaryImage = content.secondary_image_1?.url;
    const tertiaryImage = content.secondary_image_2?.url;

    return (
        <section
            id="services-story"
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-12 sm:py-16"
        >
            {/* Decorative Glow */}
            <div className="pointer-events-none absolute -start-40 top-1/4 h-80 w-80 rounded-full bg-(--theme-primary)/[0.06] blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">

                <div className="grid items-center gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-24">

                    {/* Images */}
                    <Reveal
                        distance={35}
                        duration={700}
                        className="relative"
                    >
                        <div className="relative min-h-[400px]">

                            {/* Main Image */}
                            {mainImage && (
                                <div
                                    className={`
                                        absolute top-0
                                        ${isArabic ? "start-0" : "start-0"}
                                        size-[70%]
                                        overflow-hidden rounded-[2rem]
                                        bg-(--theme-secondary)/5
                                        shadow-2xl
                                        ${isArabic ? "lg:start-0" : "lg:start-0"}
                                    `}
                                >
                                    <Image
                                        src={mainImage}
                                        alt={isArabic ? "خدمات إيفنت ميكر" : "Event Maker Services"}
                                        fill
                                        sizes="(max-width: 1024px) 78vw, 45vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                                </div>
                            )}

                            {/* Secondary Image */}
                            {secondaryImage && (
                                <div
                                    className={`
                                        absolute bottom-17
                                        ${isArabic ? "end-13" : "end-13"}
                                        z-10 size-[40%]
                                        overflow-hidden rounded-3xl
                                        border-8 border-(--theme-background)
                                        bg-(--theme-secondary)/5
                                        shadow-xl
                                    `}
                                >
                                    <Image
                                        src={secondaryImage}
                                        alt={isArabic ? "حلول وخدمات إيفنت ميكر" : "Event Maker Solutions"}
                                        fill
                                        sizes="(max-width: 1024px) 48vw, 28vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            )}

                        </div>
                    </Reveal>

                    {/* Content */}
                    <div className="relative">
                        {/* Content */}
                        <Reveal delay={300} distance={25} >
                            <div
                                className="
                                    prose prose-sm mt-7 max-w-2xl
                                    text-(--theme-secondary)/65
                                    sm:prose-base

                                    [&_h2]:mt-5
                                    [&_h2]:mb-3
                                    [&_h2]:text-2xl
                                    [&_h2]:md:text-5xl
                                    [&_h2]:font-extrabold
                                    [&_h2]:leading-tight
                                    [&_h2]:text-(--theme-secondary)

                                    [&_h3]:border-s-4
                                    [&_h3]:border-(--theme-primary)
                                    [&_h3]:ps-2
                                    [&_h3]:text-[15px]
                                    [&_h3]:font-medium
                                    [&_h3]:text-(--theme-primary)

                                    [&_h4]:border-s-4
                                    [&_h4]:border-(--theme-primary)
                                    [&_h4]:ps-2
                                    [&_h4]:text-[15px]
                                    [&_h4]:font-medium
                                    [&_h4]:text-(--theme-primary)

                                    [&_h5]:border-s-4
                                    [&_h5]:border-(--theme-primary)
                                    [&_h5]:ps-2
                                    [&_h5]:text-[15px]
                                    [&_h5]:font-medium
                                    [&_h5]:text-(--theme-primary)

                                    [&_h6]:border-s-4
                                    [&_h6]:border-(--theme-primary)
                                    [&_h6]:ps-2
                                    [&_h6]:text-[15px]
                                    [&_h6]:font-medium
                                    [&_h6]:text-(--theme-primary)

                                    [&_strong]:font-bold
                                    [&_strong]:text-(--theme-secondary)

                                    [&_p]:mb-5
                                    [&_p]:leading-8

                                    [&_li]:my-1
                                    [&_li]:leading-7

                                    [&_a]:text-(--theme-primary)
                                "
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            />
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
}