
"use client";

interface CookieSettingsLinkProps {
    locale: "ar" | "en";
}

export default function CookieSettingsLink({
    locale,
}: CookieSettingsLinkProps) {
    const isArabic = locale === "ar";

    function openCookieSettings() {
        window.dispatchEvent(
            new Event("event-maker:open-cookie-settings")
        );
    }

    return (
        <button
            type="button"
            onClick={openCookieSettings}
            className="transition-colors hover:text-white"
        >
            {isArabic
                ? "إعدادات ملفات تعريف الارتباط"
                : "Cookie Settings"}
        </button>
    );
}
