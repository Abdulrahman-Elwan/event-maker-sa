
"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";

const COOKIE_CONSENT_KEY = "event-maker-cookie-consent";
const COOKIE_CONSENT_VERSION = 1;

interface CookieConsentData {
    version: number;
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    updatedAt: string;
}

interface CookieConsentProps {
    locale: Locale;
}

const defaultPreferences = {
    analytics: false,
    marketing: false,
};

export default function CookieConsent({ locale }: CookieConsentProps) {
    const isArabic = locale === "ar";

    const [isVisible, setIsVisible] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [preferences, setPreferences] = useState(defaultPreferences);

    useEffect(() => {
        try {
            const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

            if (savedConsent) {
                const parsed: CookieConsentData = JSON.parse(savedConsent);

                if (parsed.version === COOKIE_CONSENT_VERSION) {
                    setPreferences({
                        analytics: parsed.analytics === true,
                        marketing: parsed.marketing === true,
                    });
                } else {
                    setIsVisible(true);
                }
            } else {
                setIsVisible(true);
            }
        } catch {
            setIsVisible(true);
        }

        setIsLoaded(true);

        const handleOpenSettings = () => {
            setIsSettingsOpen(true);
        };

        window.addEventListener(
            "event-maker:open-cookie-settings",
            handleOpenSettings
        );

        return () => {
            window.removeEventListener(
                "event-maker:open-cookie-settings",
                handleOpenSettings
            );
        };
    }, []);

    function saveConsent(
        analytics: boolean,
        marketing: boolean
    ) {
        const consent: CookieConsentData = {
            version: COOKIE_CONSENT_VERSION,
            necessary: true,
            analytics,
            marketing,
            updatedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(
                COOKIE_CONSENT_KEY,
                JSON.stringify(consent)
            );

            // Notify future integrations such as Google Tag Manager.
            window.dispatchEvent(
                new CustomEvent("event-maker:cookie-consent-updated", {
                    detail: consent,
                })
            );

            setPreferences({ analytics, marketing });
            setIsVisible(false);
            setIsSettingsOpen(false);
        } catch {
            // Keep the consent interface visible if storage is unavailable.
        }
    }

    function acceptAll() {
        saveConsent(true, true);
    }

    function rejectOptional() {
        saveConsent(false, false);
    }

    function savePreferences() {
        saveConsent(
            preferences.analytics,
            preferences.marketing
        );
    }

    if (!isLoaded) return null;

    return (
        <>
            {/* Cookie Consent Banner */}
            {isVisible && !isSettingsOpen && (
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                    className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
                >
                    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_-8px_40px_rgba(15,23,42,0.14)] sm:p-7">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                                        🍪
                                    </span>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        {isArabic
                                            ? "نحن نهتم بخصوصيتك"
                                            : "We Respect Your Privacy"}
                                    </h2>
                                </div>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {isArabic
                                        ? "نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع. ويمكنك اختيار السماح بملفات تعريف الارتباط التحليلية والتسويقية لتحسين تجربتك وقياس أداء خدماتنا. يمكنك تغيير اختياراتك في أي وقت."
                                        : "We use essential cookies to keep this website working. You can also choose to allow analytics and marketing cookies to help us improve your experience and measure our services. You can change your preferences at any time."}
                                </p>

                                <a
                                    href={
                                        isArabic
                                            ? "/privacy-policy"
                                            : "/en/privacy-policy"
                                    }
                                    className="mt-2 inline-block text-sm font-semibold text-[var(--theme-primary)] underline underline-offset-4"
                                >
                                    {isArabic
                                        ? "اقرأ سياسة الخصوصية"
                                        : "Read our Privacy Policy"}
                                </a>
                            </div>

                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                                <button
                                    type="button"
                                    onClick={acceptAll}
                                    className="rounded-xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    {isArabic ? "قبول الكل" : "Accept All"}
                                </button>

                                <button
                                    type="button"
                                    onClick={rejectOptional}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    {isArabic ? "رفض الكل" : "Reject All"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    {isArabic ? "الإعدادات" : "Settings"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Preferences Modal */}
            {isSettingsOpen && (
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                    className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsSettingsOpen(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cookie-settings-title"
                        className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="cookie-settings-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    {isArabic
                                        ? "إعدادات ملفات تعريف الارتباط"
                                        : "Cookie Preferences"}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {isArabic
                                        ? "اختر أنواع ملفات تعريف الارتباط التي تسمح لنا باستخدامها."
                                        : "Choose which types of cookies you allow us to use."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsSettingsOpen(false)}
                                aria-label={isArabic ? "إغلاق" : "Close"}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition-colors hover:bg-slate-200"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6 space-y-3">
                            {/* Necessary */}
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-bold text-slate-800">
                                        {isArabic
                                            ? "ملفات تعريف الارتباط الضرورية"
                                            : "Necessary Cookies"}
                                    </h3>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        {isArabic ? "دائمًا مفعّلة" : "Always Active"}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {isArabic
                                        ? "ضرورية لتشغيل الموقع وتوفير وظائفه الأساسية وحفظ اختيارك لملفات تعريف الارتباط."
                                        : "Required for the website to function properly and remember your cookie preferences."}
                                </p>
                            </div>

                            {/* Analytics */}
                            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
                                <div>
                                    <h3 className="font-bold text-slate-800">
                                        {isArabic
                                            ? "ملفات تعريف الارتباط التحليلية"
                                            : "Analytics Cookies"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {isArabic
                                            ? "تساعدنا على فهم كيفية استخدام الزوار للموقع وتحسين أدائه."
                                            : "Help us understand how visitors use the website and improve its performance."}
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={(event) =>
                                        setPreferences((current) => ({
                                            ...current,
                                            analytics: event.target.checked,
                                        }))
                                    }
                                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--theme-primary)]"
                                />
                            </label>

                            {/* Marketing */}
                            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
                                <div>
                                    <h3 className="font-bold text-slate-800">
                                        {isArabic
                                            ? "ملفات تعريف الارتباط التسويقية"
                                            : "Marketing Cookies"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {isArabic
                                            ? "تُستخدم لقياس الحملات التسويقية وتقديم محتوى وإعلانات أكثر ملاءمة."
                                            : "Used to measure marketing campaigns and provide more relevant content and advertising."}
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={preferences.marketing}
                                    onChange={(event) =>
                                        setPreferences((current) => ({
                                            ...current,
                                            marketing: event.target.checked,
                                        }))
                                    }
                                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--theme-primary)]"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={savePreferences}
                                className="flex-1 rounded-xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                {isArabic
                                    ? "حفظ اختياراتي"
                                    : "Save My Preferences"}
                            </button>

                            <button
                                type="button"
                                onClick={rejectOptional}
                                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                {isArabic
                                    ? "رفض الكل"
                                    : "Reject All"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
