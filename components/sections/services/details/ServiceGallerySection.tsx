
import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";

import Reveal from "@/components/animations/Reveal";
import ServiceGallerySlider from "./ServiceGallerySlider";

interface ServiceGallerySectionProps {
    locale: Locale;
    service: ServiceItem;
}

export default function ServiceGallerySection({
    locale,
    service,
}: ServiceGallerySectionProps) {
    const isArabic = locale === "ar";

    const gallery = Array.isArray(service.content?.main?.gallery)
        ? service.content.main.gallery.filter((item) => item?.url)
        : [];

    if (gallery.length === 0) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="mb-9 flex flex-col gap-6 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-3xl">
                        <Reveal delay={160} distance={25}>
                            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-(--theme-secondary) sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                                {isArabic
                                    ? "تجارب نصنعها لتبقى في الذاكرة"
                                    : "Experiences built to be remembered"}
                            </h2>
                        </Reveal>
                    </div>
                </div>
            </div>

            <Reveal delay={180} distance={25}>
                <ServiceGallerySlider galleryLength={gallery.length}>
                    {gallery.map((item, index) => (
                        <article
                            key={`${item.url}-${index}`}
                            className="group relative min-w-[80%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-(--theme-secondary) sm:min-w-[48%] lg:min-w-[calc((100%-60px)/4)]"
                        >
                            <div className="relative aspect-[1.45/1]">
                                <Image
                                    src={item.url}
                                    alt={`${service.title[locale]} - ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 48vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                                />

                                <div className="absolute bottom-5 start-5 z-10 sm:bottom-7 sm:start-7">
                                    <span className="text-4xl font-black leading-none tracking-[-0.06em] text-white/20 sm:text-5xl">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <div className="pointer-events-none absolute inset-4 rounded-[1.35rem] border border-white/15 sm:inset-5" />
                            </div>
                        </article>
                    ))}
                </ServiceGallerySlider>
            </Reveal>
        </section>
    );
}
