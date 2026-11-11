
import type { Locale } from "@/lib/i18n/config";
import type { AboutStats } from "@/types/about/about";

import AnimatedNumber from "./AnimatedNumber";

interface StatsSectionProps {
    locale: Locale;
    stats: AboutStats;
}

export default function StatsSection({
    locale,
    stats,
}: StatsSectionProps) {
    const isArabic = locale === "ar";

    if (!stats.stats.length) {
        return null;
    }

    const title = stats.title[isArabic ? "ar" : "en"];

    const description =
        stats.description[isArabic ? "ar" : "en"];

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-white py-12 sm:py-15 lg:py-18"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* Content */}
                    <div
                        className={
                            isArabic
                                ? "text-right"
                                : "text-left"
                        }
                    >
                        <span
                            className="mb-4 block text-xl font-bold"
                            style={{
                                color: "var(--theme-primary)",
                            }}
                        >
                            {isArabic ? "أرقامنا" : "Our Numbers"}
                        </span>

                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            {title}
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                            {description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                        {stats.stats.slice(0, 4).map((item, index) => (
                            <div
                                key={`${item.value}-${index}`}
                                className="relative rounded-2xl py-4 text-center shadow"
                            >
                                <div
                                    style={{
                                        color: "var(--theme-primary)",
                                    }}
                                    className="text-3xl font-bold leading-none tracking-tight text-slate-800 sm:text-4xl lg:text-5xl"
                                >
                                    <AnimatedNumber
                                        value={item.value}
                                    />
                                </div>

                                <div className="mx-auto mt-3 w-full px-3 text-sm font-semibold leading-6 text-slate-500">
                                    {item.title[isArabic ? "ar" : "en"]}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
