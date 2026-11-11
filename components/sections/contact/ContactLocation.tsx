import {
    FiExternalLink,
    FiMapPin,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";

interface ContactLocationProps {
    locale: Locale;
}

export default function ContactLocation({
    locale,
}: ContactLocationProps) {
    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="mt-10 overflow-hidden rounded-3xl border border-(--theme-secondary)/8 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
        >
            <div className="relative h-72 sm:h-80">
                <iframe
                    title={
                        isArabic
                            ? "موقع إيفنت ميكر"
                            : "Event Maker location"
                    }
                    src="https://www.google.com/maps?q=Jeddah%2C%20Saudi%20Arabia&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 size-full border-0 grayscale-[0.15]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

                <div className="absolute inset-x-0 top-6 flex justify-center px-5">
                    <div className="pointer-events-none flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-5 py-3 shadow-xl backdrop-blur-md">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--theme-primary)/15 text-(--theme-secondary)">
                            <FiMapPin className="size-5" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-(--theme-secondary)">
                                Event Maker
                            </p>

                            <p className="mt-0.5 text-xs text-(--theme-text)/55">
                                {isArabic
                                    ? "جدة، المملكة العربية السعودية"
                                    : "Jeddah, Saudi Arabia"}
                            </p>
                        </div>
                    </div>
                </div>

                <a
                    href="https://www.google.com/maps/search/?api=1&query=Jeddah%2C%20Saudi%20Arabia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-5 end-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-(--theme-secondary) shadow-lg transition hover:text-(--theme-primary)"
                >
                    <span>
                        {isArabic
                            ? "عرض الموقع على الخريطة"
                            : "View on map"}
                    </span>

                    <FiExternalLink className="size-3.5" />
                </a>
            </div>
        </section>
    );
}