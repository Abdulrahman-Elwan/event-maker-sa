
import type { Locale } from "@/lib/i18n/config";

interface BookingHeaderProps {
    locale: Locale;
    type: "visitor" | "exhibitor" | "general";
    exhibitionTitle: string;
}

export default function BookingHeader({
    locale,
    type,
    exhibitionTitle,
}: BookingHeaderProps) {
    const isArabic = locale === "ar";

    const content = {
        visitor: {
            ar: {
                eyebrow: "تسجيل الزوار",
                title: "سجل زيارتك للمعرض",
                description: "أكمل بياناتك التالية لتأكيد تسجيلك كزائر والاستمتاع بتجربة المعرض.",
            },
            en: {
                eyebrow: "VISITOR REGISTRATION",
                title: "Register Your Visit",
                description: "Complete the following details to register as a visitor and enjoy the exhibition experience.",
            },
        },
        exhibitor: {
            ar: {
                eyebrow: "تسجيل العارضين",
                title: "شارك كعارض في المعرض",
                description: "أدخل بيانات شركتك ونشاطك التجاري للبدء في رحلة المشاركة بالمعرض.",
            },
            en: {
                eyebrow: "EXHIBITOR REGISTRATION",
                title: "Become an Exhibitor",
                description: "Provide your company and business details to start your participation journey.",
            },
        },
        general: {
            ar: {
                eyebrow: "التسجيل في المعرض",
                title: "اختر نوع التسجيل المناسب لك",
                description: "سواء كنت ترغب في زيارة المعرض أو المشاركة كعارض، اختر نوع التسجيل المناسب لك.",
            },
            en: {
                eyebrow: "EXHIBITION REGISTRATION",
                title: "Choose Your Registration Type",
                description: "Whether you want to visit the exhibition or participate as an exhibitor, choose the right registration type.",
            },
        },
    };

    const selectedContent = content[type][locale];

    return (
        <header className="mb-6">
            <span className="mb-3 block text-xs font-semibold tracking-wide text-[var(--theme-primary)]">
                {selectedContent.eyebrow}
            </span>

            <h1 className="text-2xl font-bold leading-relaxed text-[var(--theme-text)] sm:text-3xl">
                {selectedContent.title}
            </h1>

            <p className="mt-2 text-xs leading-7 text-[var(--theme-text)]/55 sm:text-sm">
                {selectedContent.description}
            </p>

            <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-[var(--theme-text)]/10 bg-white px-3 py-2">
                <span className="shrink-0 text-[11px] text-[var(--theme-text)]/45">
                    {isArabic ? "المعرض:" : "Exhibition:"}
                </span>

                <span className="truncate text-xs font-semibold text-[var(--theme-text)]">
                    {exhibitionTitle}
                </span>
            </div>
        </header>
    );
}
