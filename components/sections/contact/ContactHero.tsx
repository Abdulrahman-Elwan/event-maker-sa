import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";

interface ContactHeroProps {
    locale: Locale;
}

const heroImage =
    "https://res.cloudinary.com/dw8nuv7r8/image/upload/v1793910126/event-maker/exhibitions/hero/g5mo01wivtycwjqql2f7.png";

export default function ContactHero({
    locale,
}: ContactHeroProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative max-h-[450px] overflow-hidden bg-(--theme-secondary) sm:max-h-[450px] lg:max-h-[500px]"
        >
            <Image
                src={heroImage}
                alt={
                    isArabic
                        ? "إيفنت ميكر لتنظيم المعارض والفعاليات"
                        : "Event Maker exhibitions and events"
                }
                fill
                priority
                sizes="100vw"
                className={`object-cover ${isArabic ? "scale-x-[-1]" : ""}`}
            />

            <div
                className={`absolute inset-0 ${isArabic
                        ? "bg-[linear-gradient(to_left,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.82)_25%,rgba(15,23,42,0.48)_48%,rgba(15,23,42,0.08)_78%,rgba(15,23,42,0)_100%)]"
                        : "bg-[linear-gradient(to_right,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.82)_25%,rgba(15,23,42,0.48)_48%,rgba(15,23,42,0.08)_78%,rgba(15,23,42,0)_100%)]"
                    }`}
            />

            <div className="absolute inset-0 bg-(--theme-secondary)/10" />

            <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col px-5 pb-8 pt-8 sm:min-h-[620px] sm:px-8 lg:min-h-[680px] lg:px-10 lg:pt-10">
                <div className="flex flex-1 items-center">
                    <div
                        className={`max-w-2xl text-white ${isArabic
                                ? "text-right"
                                : "text-left"
                            }`}
                    >
                        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            {isArabic
                                ? "تواصل معنا"
                                : "Contact Us"}
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg sm:leading-9">
                            {isArabic
                                ? "نحن هنا للإجابة على استفساراتك ومناقشة أفكارك وتقديم الحلول المبتكرة لنجاح فعالياتك."
                                : "We are here to answer your questions, discuss your ideas, and provide innovative solutions for successful events."}
                        </p>

                        <nav
                            aria-label={
                                isArabic
                                    ? "مسار التنقل"
                                    : "Breadcrumb"
                            }
                            className={`flex items-center gap-2 mt-5 text-[17px] text-white/60 justify-start`}
                        >
                            {isArabic ? (
                                <>
                                    <span className="text-white">
                                        تواصل معنا
                                    </span>

                                    <span className="text-(--theme-primary)">
                                        ‹
                                    </span>

                                    <span>
                                        الرئيسية
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Home</span>

                                    <span className="text-(--theme-primary)">
                                        ›
                                    </span>

                                    <span className="text-white">
                                        Contact Us
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>

            </div>
        </section>
    );
}