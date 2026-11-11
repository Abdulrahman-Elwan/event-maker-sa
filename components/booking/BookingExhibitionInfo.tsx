
import Image from "next/image";
import {
    FiMapPin,
    FiExternalLink,
    FiCalendar,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

interface BookingExhibitionInfoProps {
    locale: Locale;
    exhibition: Exhibition;
}

export default function BookingExhibitionInfo({
    locale,
    exhibition,
}: BookingExhibitionInfoProps) {
    const isArabic = locale === "ar";

    const exhibitionTitle = exhibition.title[locale];
    const address = exhibition.location.address[locale];

    const formatDate = (date: string) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return date;

        return new Intl.DateTimeFormat(
            isArabic ? "ar-EG" : "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            },
        ).format(parsedDate);
    };

    return (
        <aside dir={isArabic ? "rtl" : "ltr"} className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-2xl border border-[var(--theme-text)]/[0.09] bg-white p-3 shadow-sm sm:p-4">
                <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-slate-100">
                    {exhibition.main_image?.url ? (
                        <Image
                            src={exhibition.main_image.url}
                            alt={exhibitionTitle}
                            fill
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 400px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-xs text-slate-400">
                            {isArabic ? "صورة المعرض" : "Exhibition Image"}
                        </div>
                    )}
                </div>

                <div className="px-2 pb-2 pt-5">
                    <h2 className="text-base font-bold leading-7 text-[var(--theme-text)]">
                        {exhibitionTitle}
                    </h2>

                    <div className="mt-4 flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)]/[0.09] text-[var(--theme-primary)]">
                            <FiMapPin size={17} />
                        </span>

                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--theme-text)]">
                                {isArabic ? "موقع المعرض" : "Exhibition Location"}
                            </p>

                            <p className="mt-1 text-xs leading-6 text-[var(--theme-text)]/55">
                                {address}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)]/[0.09] text-[var(--theme-primary)]">
                            <FiCalendar size={16} />
                        </span>

                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--theme-text)]">
                                {isArabic ? "موعد المعرض" : "Exhibition Dates"}
                            </p>

                            <p className="mt-1 text-xs leading-6 text-[var(--theme-text)]/55">
                                {formatDate(exhibition.start_date)}
                                {" — "}
                                {formatDate(exhibition.end_date)}
                            </p>
                        </div>
                    </div>

                    {exhibition.location.google_map && (
                        <a
                            href={exhibition.location.google_map}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[var(--theme-primary)] transition hover:opacity-70"
                        >
                            {isArabic ? "عرض الموقع على الخريطة" : "View on Google Maps"}
                            <FiExternalLink size={13} />
                        </a>
                    )}
                </div>
            </div>

            <p className="mt-4 px-2 text-xs leading-7 text-[var(--theme-text)]/50">
                {isArabic
                    ? "نرحب بك في المعرض، ونتطلع إلى مشاركتك معنا."
                    : "We look forward to welcoming you to the exhibition."}
            </p>
        </aside>
    );
}
