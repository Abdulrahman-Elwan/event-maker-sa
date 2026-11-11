import {
    FiClock,
    FiMail,
    FiMapPin,
    FiPhone,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { ContactSettings } from "@/types/siteSettings";

interface ContactInfoProps {
    locale: Locale;
    settings: ContactSettings;
}

export default function ContactInfo({
    locale,
    settings,
}: ContactInfoProps) {
    const isArabic = locale === "ar";

    const primaryEmail = settings.emails[0];
    const primaryPhone = settings.phones[0];

    const location = primaryEmail?.location?.[locale] || "";
    const mapUrl = primaryEmail?.mapUrl || "";

    const items = [
        location && {
            icon: FiMapPin,
            title: isArabic
                ? "موقعنا"
                : "Our Location",
            value: location,
            action: isArabic
                ? "عرض الموقع على الخريطة"
                : "View location on map",
            href: mapUrl || undefined,
        },

        primaryEmail && {
            icon: FiMail,
            title: primaryEmail.label || (
                isArabic
                    ? "البريد الإلكتروني"
                    : "Email"
            ),
            value: primaryEmail.email,
            action: isArabic
                ? "راسلنا عبر البريد الإلكتروني"
                : "Send us an email",
            href: `mailto:${primaryEmail.email}`,
        },

        primaryPhone && {
            icon: FiPhone,
            title: primaryPhone.label || (
                isArabic
                    ? "رقم الهاتف"
                    : "Phone Number"
            ),
            value: primaryPhone.number,
            action: isArabic
                ? "اتصل بنا الآن"
                : "Call us now",
            href: `tel:${primaryPhone.number}`,
        },

        settings.workingHours[locale] && {
            icon: FiClock,
            title: isArabic
                ? "ساعات العمل"
                : "Working Hours",
            value: settings.workingHours[locale],
            action: isArabic
                ? "أوقات استقبال الاستفسارات"
                : "Customer service hours",
        },
    ].filter(Boolean) as Array<{
        icon: typeof FiMapPin;
        title: string;
        value: string;
        action: string;
        href?: string;
    }>;

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="flex h-full flex-col gap-4"
        >
            {items.map((item) => {
                const Icon = item.icon;

                const content = (
                    <>
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--theme-primary)/15 text-(--theme-secondary)">
                            <Icon className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-(--theme-secondary)">
                                {item.title}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-(--theme-text)/65">
                                {item.value}
                            </p>

                            <p className="mt-2 text-xs font-semibold text-(--theme-primary)">
                                {item.action}
                            </p>
                        </div>
                    </>
                );

                if (item.href) {
                    return (
                        <a
                            key={`${item.title}-${item.value}`}
                            href={item.href}
                            target={
                                item.href.startsWith("http")
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                item.href.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            className="flex flex-1 items-center gap-5 rounded-3xl border border-(--theme-secondary)/8 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-(--theme-primary)/20 hover:shadow-[0_14px_45px_rgba(15,23,42,0.07)]"
                        >
                            {content}
                        </a>
                    );
                }

                return (
                    <div
                        key={`${item.title}-${item.value}`}
                        className="flex flex-1 items-center gap-5 rounded-3xl border border-(--theme-secondary)/8 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
}