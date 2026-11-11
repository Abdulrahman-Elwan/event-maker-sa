
import { FiArrowUpRight } from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";

type BookingHeroProps = {
    locale: Locale;
    exhibitionTitle: string;
    type: "visitor" | "exhibitor" | "general";
};

export default function BookingHero({
    locale,
    exhibitionTitle,
    type,
}: BookingHeroProps) {
    const isArabic = locale === "ar";

    const bookingType = {
        general: isArabic ? "التسجيل والمشاركة" : "Registration & Participation",
        visitor: isArabic ? "تسجيل زائر" : "Visitor Registration",
        exhibitor: isArabic ? "تسجيل عارض" : "Exhibitor Registration",
    };

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36"
            style={{
                background: "linear-gradient(120deg, var(--theme-secondary), var(--theme-primary))",
            }}
        >
            {/* Background Decorations */}
            <div className="pointer-events-none absolute -end-24 -top-32 size-96 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -end-12 -top-20 size-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-40 -start-20 size-96 rounded-full bg-white/5 blur-3xl" />

            <div className="relative mx-auto max-w-6xl">
                <div className="max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
                        <FiArrowUpRight size={14} />
                        <span>{bookingType[type]}</span>
                    </div>

                    <h1 className="text-2xl font-bold leading-relaxed text-white sm:text-3xl lg:text-4xl">
                        {isArabic ? "احجز مكانك في" : "Secure Your Place at"}
                        <span className="mt-1 block text-white">
                            {exhibitionTitle}
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-xs leading-7 text-white/75 sm:text-sm">
                        {isArabic
                            ? "أكمل بيانات التسجيل وانضم إلينا لتكون جزءًا من هذا الحدث المميز."
                            : "Complete your registration details and join us to be part of this exceptional event."}
                    </p>
                </div>
            </div>
        </section>
    );
}
