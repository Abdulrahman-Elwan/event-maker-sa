
import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";
import Reveal from "@/components/animations/Reveal";

interface ServiceUsageFieldsSectionProps {
    locale: Locale;
    service: ServiceItem;
}

export default function ServiceUsageFieldsSection({
    locale,
    service,
}: ServiceUsageFieldsSectionProps) {
    const isArabic = locale === "ar";
    const usageFields = service.content?.main?.usageFields;

    if (!usageFields) {
        return null;
    }

    const items = Array.isArray(usageFields.items)
        ? usageFields.items.filter((item) => item?.[locale])
        : [];

    const images = Array.isArray(usageFields.images)
        ? usageFields.images
        : [];

    if (items.length === 0 && images.length === 0) {
        return null;
    }

    const primaryImage = images[0];
    const secondaryImage = images[1];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                    <Reveal delay={180} distance={25} className="h-full">
                        <div className="relative h-[400px] overflow-hidden rounded-[1.75rem] bg-(--theme-secondary) sm:h-[470px] lg:h-full lg:min-h-[500px]">
                            {primaryImage?.url && (
                                <Image
                                    src={primaryImage.url}
                                    alt={primaryImage.public_id}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 45vw"
                                    className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                            <div className="pointer-events-none absolute inset-4 rounded-[1.4rem] border border-white/15 sm:inset-5" />

                            <div className="absolute bottom-6 start-6 z-10 sm:bottom-8 sm:start-8">
                                <span className="block text-[clamp(4.5rem,8vw,7rem)] font-black leading-[0.8] tracking-[-0.08em] text-white/10">
                                    01
                                </span>
                            </div>

                            {secondaryImage?.url && (
                                <div className="absolute bottom-5 end-5 z-20 w-[42%] sm:bottom-7 sm:end-7 sm:w-[38%] lg:bottom-8 lg:end-8">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] sm:border-[6px]">
                                        <Image
                                            src={secondaryImage.url}
                                            alt={secondaryImage.public_id}
                                            fill
                                            sizes="(max-width: 640px) 38vw, 18vw"
                                            className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Reveal>

                    <div className="flex flex-col justify-center">
                        {items.length > 0 && (
                            <div className="grid grid-cols-1 border-t border-(--theme-secondary)/10 sm:grid-cols-2 sm:gap-x-8">
                                {items.map((item, index) => {
                                    const text = item[locale];

                                    return (
                                        <Reveal
                                            key={`${text}-${index}`}
                                            delay={180 + index * 50}
                                            distance={18}
                                        >
                                            <div className="group relative flex min-h-[78px] items-start gap-4 border-b border-(--theme-secondary)/10 py-5">
                                                <span className="mt-0.5 shrink-0 text-[10px] font-bold tracking-[0.12em] text-(--theme-primary)">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <p className="flex-1 text-sm font-medium leading-7 text-(--theme-text)/70 transition-colors duration-300 group-hover:text-(--theme-secondary) sm:text-[15px] sm:leading-7">
                                                    {text}
                                                </p>

                                                <span
                                                    aria-hidden="true"
                                                    className="mt-0.5 hidden shrink-0 text-xs text-(--theme-secondary)/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-(--theme-primary) sm:block"
                                                >
                                                    {isArabic ? "←" : "→"}
                                                </span>

                                                <span
                                                    className={`absolute bottom-0 h-px w-0 bg-(--theme-primary) transition-all duration-500 group-hover:w-full ${
                                                        isArabic
                                                            ? "right-0"
                                                            : "left-0"
                                                    }`}
                                                />
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}