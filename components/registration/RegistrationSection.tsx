// components\registration\RegistrationSection.tsx
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
    FiUser,
    FiBriefcase,
    FiMapPin,
    FiExternalLink,
} from "react-icons/fi";
import { toast } from "sonner";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";
import type {
    VisitorRegistrationFormValues,
    ExhibitorRegistrationFormValues,
} from "@/types/registration";

type RegistrationType = "visitor" | "exhibitor";

interface RegistrationSectionProps {
    locale: Locale;
    exhibition: Exhibition;
}

const VisitorRegistrationForm = dynamic(
    () => import("./VisitorRegistrationForm")
);

const ExhibitorRegistrationForm = dynamic(
    () => import("./ExhibitorRegistrationForm")
);

export default function RegistrationSection({ locale, exhibition, }: RegistrationSectionProps) {
    const isArabic = locale === "ar";

    const sectionRef = useRef<HTMLElement | null>(null);

    const [visitorFormLoaded, setVisitorFormLoaded] = useState(false);
    const [exhibitorFormLoaded, setExhibitorFormLoaded] = useState(false);

    const [activeForm, setActiveForm] =
        useState<RegistrationType>("visitor");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const exhibitionTitle = exhibition.title[locale];
    const exhibitionAddress = exhibition.location.address[locale];

    // Prevent scrolling while submitting
    useEffect(() => {
        if (!isSubmitting) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isSubmitting]);

    // Lazy load registration forms
    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisitorFormLoaded(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "300px",
            }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    // Submit registration
    const submitRegistration = async (
        registrationType: RegistrationType,
        data:
            | VisitorRegistrationFormValues
            | ExhibitorRegistrationFormValues
    ) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/registrations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    registrationType,
                    exhibitionId: exhibition.id,
                    locale,
                    data,
                }),
            });

            const responseText = await response.text();

            let result: {
                success?: boolean;
                message?: string;
            };

            try {
                result = JSON.parse(responseText);
            } catch {
                console.error("Registration API returned non-JSON:", {
                    status: response.status,
                    statusText: response.statusText,
                    response: responseText,
                });

                throw new Error(
                    isArabic
                        ? `حدث خطأ غير متوقع من السيرفر (${response.status}).`
                        : `Unexpected server response (${response.status}).`
                );
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    (isArabic
                        ? "تعذر إرسال التسجيل. حاول مرة أخرى."
                        : "Failed to submit registration. Please try again.")
                );
            }

            toast.success(
                result.message ||
                (isArabic
                    ? "تم إرسال تسجيلك بنجاح."
                    : "Your registration was submitted successfully."),
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } catch (error) {
            console.error("Registration submission error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : isArabic
                        ? "حدث خطأ غير متوقع. حاول مرة أخرى."
                        : "An unexpected error occurred. Please try again.",
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVisitorSubmit = async (
        values: VisitorRegistrationFormValues
    ) => {
        await submitRegistration("visitor", values);
    };

    const handleExhibitorSubmit = async (
        values: ExhibitorRegistrationFormValues
    ) => {
        await submitRegistration("exhibitor", values);
    };

    // Switch registration type
    const handleTabChange = (type: RegistrationType) => {
        if (isSubmitting) return;

        setActiveForm(type);

        if (type === "visitor") {
            setVisitorFormLoaded(true);
        } else {
            setExhibitorFormLoaded(true);
        }
    };

    return (
        <section
            ref={sectionRef}
            id="registration"
            dir="ltr"
            className="bg-[var(--theme-background)] px-4 py-16 sm:px-6 lg:py-24"
        >
            {/* Registration Loading Overlay */}
            {isSubmitting && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    role="status"
                    aria-live="polite"
                    aria-label={
                        isArabic
                            ? "جاري إرسال التسجيل"
                            : "Submitting registration"
                    }
                >
                    <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
                        <div className="relative mb-6 flex size-16 items-center justify-center">
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--theme-primary)]" />

                            <span className="text-xl font-bold text-[var(--theme-primary)]">
                                ...
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            {isArabic
                                ? "جاري إرسال التسجيل"
                                : "Submitting Registration"}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-slate-500">
                            {isArabic
                                ? "يرجى الانتظار وعدم إغلاق الصفحة حتى يتم إرسال بياناتك."
                                : "Please wait and do not close this page while your registration is being submitted."}
                        </p>
                    </div>
                </div>
            )}

            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[0.8fr_1.35fr] lg:gap-12">

                {/* Exhibition Information */}
                <aside
                    dir={isArabic ? "rtl" : "ltr"}
                    className="order-2 lg:order-1 md:mt-34"
                >
                    <div className="overflow-hidden rounded-2xl border border-[var(--theme-text)]/[0.09] bg-white p-3 shadow-sm sm:p-4">

                        {/* Exhibition Image */}
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
                                <div className="flex size-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                                    {isArabic
                                        ? "صورة المعرض"
                                        : "Exhibition Image"}
                                </div>
                            )}
                        </div>

                        {/* Exhibition Details */}
                        <div className="px-2 pb-2 pt-5">
                            <h3 className="text-base font-bold text-[var(--theme-text)] sm:text-lg">
                                {exhibitionTitle}
                            </h3>

                            <div className="mt-4 flex items-start gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)]/[0.09] text-[var(--theme-primary)]">
                                    <FiMapPin size={17} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[var(--theme-text)]">
                                        {isArabic
                                            ? "موقع المعرض"
                                            : "Exhibition Location"}
                                    </p>

                                    <p className="mt-1 text-xs leading-6 text-[var(--theme-text)]/55">
                                        {exhibitionAddress}
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
                                    {isArabic
                                        ? "عرض الموقع على الخريطة"
                                        : "View on Google Maps"}

                                    <FiExternalLink size={13} />
                                </a>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Registration Form */}
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                    className="order-1 min-w-0 lg:order-2"
                >
                    {/* Heading */}
                    <div className="mb-6">
                        <span className="mb-3 block text-xs font-semibold text-[var(--theme-primary)]">
                            {isArabic
                                ? "التسجيل في المعرض"
                                : "EXHIBITION REGISTRATION"}
                        </span>

                        <h2 className="text-2xl font-bold leading-relaxed text-[var(--theme-text)] sm:text-3xl">
                            {isArabic
                                ? "اختر نوع التسجيل المناسب لك"
                                : "Choose the Registration Type That Suits You"}
                        </h2>

                        <p className="mt-2 text-xs leading-7 text-[var(--theme-text)]/55 sm:text-sm">
                            {isArabic
                                ? "يرجى اختيار نوع التسجيل المناسب وإدخال بياناتك لإتمام عملية التسجيل."
                                : "Choose your registration type and provide your details to complete the process."}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-2xl border border-[var(--theme-text)]/[0.09] bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                        {/* Registration Tabs */}
                        <div className="mb-6 flex rounded-xl border border-[var(--theme-text)]/[0.09] bg-slate-50 p-1">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleTabChange("visitor")}
                                aria-pressed={activeForm === "visitor"}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-bold transition-all sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 ${activeForm === "visitor"
                                        ? "bg-[var(--theme-primary)] text-white shadow-sm"
                                        : "text-[var(--theme-text)]/60 hover:text-[var(--theme-text)]"
                                    }`}
                            >
                                <FiUser size={16} />
                                {isArabic ? "تسجيل زائر" : "Visitor"}
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleTabChange("exhibitor")}
                                aria-pressed={activeForm === "exhibitor"}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-bold transition-all sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 ${activeForm === "exhibitor"
                                        ? "bg-[var(--theme-primary)] text-white shadow-sm"
                                        : "text-[var(--theme-text)]/60 hover:text-[var(--theme-text)]"
                                    }`}
                            >
                                <FiBriefcase size={16} />
                                {isArabic ? "تسجيل عارض" : "Exhibitor"}
                            </button>
                        </div>

                        {/* Form Heading */}
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-[var(--theme-text)] sm:text-base">
                                {activeForm === "visitor"
                                    ? isArabic
                                        ? "بيانات تسجيل الزائر"
                                        : "Visitor Information"
                                    : isArabic
                                        ? "بيانات تسجيل العارض"
                                        : "Exhibitor Information"}
                            </h3>

                            <p className="mt-1 text-[11px] leading-6 text-[var(--theme-text)]/45">
                                {isArabic
                                    ? "الحقول المحددة بعلامة (*) مطلوبة."
                                    : "Fields marked with (*) are required."}
                            </p>
                        </div>

                        {/* Visitor Registration Form */}
                        {visitorFormLoaded && (
                            <div hidden={activeForm !== "visitor"}>
                                <VisitorRegistrationForm
                                    locale={locale}
                                    onSubmit={handleVisitorSubmit}
                                />
                            </div>
                        )}

                        {/* Exhibitor Registration Form */}
                        {exhibitorFormLoaded && (
                            <div hidden={activeForm !== "exhibitor"}>
                                <ExhibitorRegistrationForm
                                    locale={locale}
                                    onSubmit={handleExhibitorSubmit}
                                />
                            </div>
                        )}
                    </div>

                    {/* Privacy Note */}
                    <p className="mt-4 text-center text-[10px] leading-6 text-[var(--theme-text)]/45">
                        {isArabic
                            ? "نحرص على سرية بياناتك واستخدامها لأغراض التواصل المتعلقة بالمعرض."
                            : "Your information is kept confidential and used only for exhibition-related communication."}
                    </p>
                </div>
            </div>
        </section>
    );
}