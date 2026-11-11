
import { FaWhatsapp } from "react-icons/fa6";

import type { Locale } from "@/lib/i18n/config";
import type { ContactSettings } from "@/types/siteSettings";

interface WhatsappIconProps {
    locale: Locale;
    contact: ContactSettings;
}

export default function WhatsappIcon({
    locale,
    contact,
}: WhatsappIconProps) {
    const isArabic = locale === "ar";

    // Get the first active phone number.
    const activePhone = contact.phones.find(
        (phone) =>
            phone.active &&
            typeof phone.number === "string" &&
            phone.number.trim().length > 0
    );

    if (!activePhone) return null;

    // Remove spaces, +, and any non-numeric characters.
    const whatsappNumber = activePhone.number.replace(/\D/g, "");

    if (!whatsappNumber) return null;

    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
                isArabic
                    ? "تواصل معنا عبر واتساب"
                    : "Contact us on WhatsApp"
            }
            title={
                isArabic
                    ? "تواصل معنا عبر واتساب"
                    : "Contact us on WhatsApp"
            }
            className={`
                fixed bottom-6 z-50
                ${isArabic ? "right-5 sm:right-8" : "left-5 sm:left-8"}
                flex h-14 w-14 items-center justify-center
                rounded-full bg-[#25D366] text-white
                shadow-lg shadow-black/20
                transition-all duration-300
                hover:scale-110 hover:bg-[#20BD5A]
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#25D366]/40
            `}
        >
            <FaWhatsapp className="text-[32px]" />
        </a>

        
    );
}
