import type { Locale } from "@/lib/i18n/config";

import Reveal from "@/components/animations/Reveal";

interface ServicesCTASectionProps {
    locale: Locale;
}

export default function ServicesCTASection({locale,}: ServicesCTASectionProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-background) py-10 md:py-16"
        >
            <div className="container mx-auto px-5 sm:px-7 lg:px-8">
                <div className="relative overflow-hidden bg-(--theme-secondary) px-8 py-14 sm:px-12 md:py-20 lg:px-16">
                    {/* Decorative Elements */}
                    <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-(--theme-primary)/15 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-32 -start-20 h-72 w-72 rounded-full bg-(--theme-primary)/10 blur-[100px]" />

                    <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
                        <div className="absolute inset-y-0 start-1/2 w-px bg-white" />
                        <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
                    </div>

                    <div
                        className={`relative max-w-3xl ${
                            isArabic ? "ms-auto text-right" : "me-auto text-left"
                        }`}
                    >
                        <Reveal delay={100} distance={25}>
                            <span className="mb-5 block text-xs font-bold uppercase tracking-[0.2em] text-(--theme-primary)">
                                {isArabic
                                    ? "جاهزون لصناعة تجربة استثنائية"
                                    : "READY TO CREATE SOMETHING EXCEPTIONAL"}
                            </span>
                        </Reveal>

                        <Reveal delay={200} distance={25}>
                            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                                {isArabic
                                    ? "لنجعل فعاليتك القادمة تجربة لا تُنسى."
                                    : "Let’s Make Your Next Event Unforgettable."}
                            </h2>
                        </Reveal>

                        <Reveal delay={300} distance={25}>
                            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                                {isArabic
                                    ? "من الفكرة الأولى وحتى لحظة التنفيذ، نضع خبرتنا وإبداعنا في خدمة نجاح فعاليتك. أخبرنا بما تحتاجه ودعنا نصنعها معًا."
                                    : "From the first idea to the final execution, we bring our expertise and creativity together to make your event a success. Tell us what you need, and let’s create it together."}
                            </p>
                        </Reveal>

                        <Reveal delay={400} distance={25}>
                            <div
                                className={`mt-8 flex flex-wrap gap-3 ${
                                    isArabic
                                        ? "justify-start"
                                        : "justify-start"
                                }`}
                            >
                                <a
                                    href={
                                        isArabic
                                            ? "/contact"
                                            : "/en/contact"
                                    }
                                    className="group inline-flex items-center gap-3 bg-(--theme-primary) px-6 py-3.5 text-sm font-bold text-(--theme-secondary) transition-all duration-300 hover:gap-4 hover:brightness-105"
                                >
                                    <span>
                                        {isArabic
                                            ? "تحدث معنا"
                                            : "Talk to Us"}
                                    </span>

                                    <span
                                        className={`text-lg leading-none transition-transform duration-300 ${
                                            isArabic
                                                ? "group-hover:-translate-x-1"
                                                : "group-hover:translate-x-1"
                                        }`}
                                    >
                                        {isArabic ? "←" : "→"}
                                    </span>
                                </a>

                                <a
                                    href={
                                        isArabic
                                            ? "/services"
                                            : "/en/services"
                                    }
                                    className="inline-flex items-center px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors duration-300 hover:text-white"
                                >
                                    {isArabic
                                        ? "استكشف خدماتنا"
                                        : "Explore Our Services"}
                                </a>
                            </div>
                        </Reveal>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute bottom-0 end-0 h-24 w-24 border-s border-t border-(--theme-primary)/30" />
                </div>
            </div>
        </section>
    );
}
