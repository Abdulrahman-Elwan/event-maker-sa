import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";
import Reveal from "@/components/animations/Reveal";

interface ServiceFeaturesSectionProps {
    locale: Locale;
    service: ServiceItem;
}

export default function ServiceFeaturesSection({
    locale,
    service,
}: ServiceFeaturesSectionProps) {
    const isArabic = locale === "ar";
    const features = service.content?.main?.features;

    if (!features) {
        return null;
    }

    const title = features.title?.[locale] || "";
    const description = features.description?.[locale] || "";
    const items = Array.isArray(features.items) ? features.items : [];

    if (!title && !description && items.length === 0) {
        return null;
    }

    return (
        <section dir={isArabic ? "rtl" : "ltr"} className="relative overflow-hidden bg-(--theme-secondary) py-10 text-white md:py-20" >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className={`absolute top-0 h-80 w-80 rounded-full bg-(--theme-primary)/[0.07] blur-[120px] ${isArabic ? "-start-40" : "-end-40"}`} />
                    <div className={`absolute bottom-0 h-96 w-96 rounded-full bg-(--theme-primary)/[0.05] blur-[140px] ${isArabic ? "-end-48" : "-start-48"}`} />
                </div>

                <div className="relative mx-auto">
                    <div className="grid gap-14 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.4fr)] lg:gap-20 xl:gap-28">
                        <div className="lg:sticky lg:top-28 lg:h-fit">
                            <Reveal delay={80} distance={20}>
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--theme-primary) sm:text-xs">
                                        {isArabic
                                            ? "مميزات الخدمة"
                                            : "SERVICE FEATURES"}
                                    </span>
                                </div>
                            </Reveal>

                            {title && (
                                <Reveal delay={160} distance={25}>
                                    <h2 className="max-w-lg text-[25px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-4xl">
                                        {title}
                                    </h2>
                                </Reveal>
                            )}

                            {description && (
                                <Reveal delay={260} distance={20}>
                                    <p className="mt-6 max-w-md text-sm leading-8 text-white/60 sm:text-base sm:leading-9">
                                        {description}
                                    </p>
                                </Reveal>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-white/10">
                                {items.map((item, index) => {
                                    const text = item?.[locale];

                                    if (!text) {
                                        return null;
                                    }

                                    return (
                                        <Reveal key={`${text}-${index}`} delay={120 + index * 70} distance={20} >
                                            <div className="group relative border-b border-white/10 py-7 sm:py-9 lg:py-10">
                                                <div className="flex items-start gap-5 sm:gap-8">
                                                    <span className="shrink-0 pt-1 text-xs font-bold tracking-[0.12em] text-(--theme-primary)/70 transition-colors duration-300 group-hover:text-(--theme-primary)">
                                                        {String(index + 1).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </span>

                                                    <div className="flex-1">
                                                        <p className="max-w-2xl text-[20px] font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                                                            {text}
                                                        </p>
                                                    </div>

                                                    <span
                                                        aria-hidden="true"
                                                        className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-white/30 transition-all duration-300 group-hover:border-(--theme-primary)/40 group-hover:bg-(--theme-primary)/10 group-hover:text-(--theme-primary) sm:flex"
                                                    >
                                                        {isArabic ? "↙" : "↘"}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`absolute bottom-0 h-px w-0 bg-(--theme-primary) transition-all duration-500 group-hover:w-full ${isArabic
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