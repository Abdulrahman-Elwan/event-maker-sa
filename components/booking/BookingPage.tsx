
"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";
import type { VisitorRegistrationFormValues, ExhibitorRegistrationFormValues, } from "@/types/registration";
import BookingHeader from "./BookingHeader";
import BookingExhibitionInfo from "./BookingExhibitionInfo";
import BookingTypeSelector from "./BookingTypeSelector";
import BookingSuccess from "./BookingSuccess";
import BookingHero from "./BookingHero";
import VisitorRegistrationForm from "@/components/registration/VisitorRegistrationForm";
import ExhibitorRegistrationForm from "@/components/registration/ExhibitorRegistrationForm";

export type BookingType = "visitor" | "exhibitor" | "general";
type RegistrationType = "visitor" | "exhibitor";

interface BookingPageProps {
    locale: Locale;
    type: BookingType;
    exhibition: Exhibition;
}

interface SubmissionMessage {
    type: "success" | "error";
    text: string;
}

export default function BookingPage({ locale, type, exhibition, }: BookingPageProps) {
    const isArabic = locale === "ar";

    const [selectedType, setSelectedType] = useState<RegistrationType>(
        type === "exhibitor" ? "exhibitor" : "visitor",
    );

    const [submissionMessage, setSubmissionMessage] = useState<SubmissionMessage | null>(null);

    const submitRegistration = async (registrationType: RegistrationType, data: VisitorRegistrationFormValues | ExhibitorRegistrationFormValues,) => {
        setSubmissionMessage(null);

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
                console.error("Booking API returned non-JSON:", {
                    status: response.status,
                    response: responseText,
                });

                throw new Error(
                    isArabic ? `حدث خطأ غير متوقع من السيرفر (${response.status}).` : `Unexpected server response (${response.status}).`,
                );
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    (isArabic ? "تعذر إرسال التسجيل. حاول مرة أخرى." : "Failed to submit registration. Please try again."),
                );
            }

            setSubmissionMessage({
                type: "success",
                text: result.message || (
                    isArabic ? "تم إرسال تسجيلك بنجاح." : "Your registration was submitted successfully."
                ),
            });

        } catch (error) {
            setSubmissionMessage({
                type: "error",
                text: error instanceof Error
                    ? error.message
                    : isArabic ? "حدث خطأ غير متوقع." : "An unexpected error occurred.",
            });

            // مهم: إعادة تمرير الخطأ حتى لا يتم تنظيف الفورم عند الفشل.
            throw error;
        }
    };

    const handleVisitorSubmit = async (values: VisitorRegistrationFormValues) => {
        await submitRegistration("visitor", values);
    };

    const handleExhibitorSubmit = async (values: ExhibitorRegistrationFormValues) => {
        await submitRegistration("exhibitor", values);
    };

    const handleTypeChange = (value: RegistrationType) => {
        setSelectedType(value);
        setSubmissionMessage(null);
    };

    return (
        <main>
            <BookingHero locale={locale} type={type} exhibitionTitle={exhibition.title[locale]} />

            <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[var(--theme-background)] px-4 py-12 sm:px-6 lg:py-20" >
                <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[0.8fr_1.35fr] lg:gap-12">

                    {/* Exhibition Information */}
                    <div className="order-2 lg:order-1">
                        <BookingExhibitionInfo locale={locale} exhibition={exhibition} />
                    </div>

                    {/* Booking Form */}
                    <div className="order-1 min-w-0 lg:order-2">
                        <BookingHeader locale={locale} type={type} exhibitionTitle={exhibition.title[locale]} />

                        <div className="rounded-2xl border border-[var(--theme-text)]/[0.09] bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                            {/* Type Selector */}
                            {type === "general" && (
                                <BookingTypeSelector locale={locale} value={selectedType} onChange={handleTypeChange} />
                            )}

                            {/* Submission Message */}
                            {submissionMessage && (
                                <BookingSuccess type={submissionMessage.type} message={submissionMessage.text} onClose={() => setSubmissionMessage(null)} />
                            )}

                            {/* Form Heading */}
                            <div className="mb-5">
                                <h2 className="text-sm font-bold text-[var(--theme-text)] sm:text-base">
                                    {selectedType === "visitor"
                                        ? isArabic ? "بيانات تسجيل الزائر" : "Visitor Information"
                                        : isArabic ? "بيانات تسجيل العارض" : "Exhibitor Information"}
                                </h2>

                                <p className="mt-1 text-[11px] leading-6 text-[var(--theme-text)]/45">
                                    {isArabic ? "الحقول المحددة بعلامة (*) مطلوبة." : "Fields marked with (*) are required."}
                                </p>
                            </div>

                            {/* Visitor Form */}
                            <div hidden={selectedType !== "visitor"}>
                                <VisitorRegistrationForm locale={locale} onSubmit={handleVisitorSubmit} />
                            </div>

                            {/* Exhibitor Form */}
                            <div hidden={selectedType !== "exhibitor"}>
                                <ExhibitorRegistrationForm locale={locale} onSubmit={handleExhibitorSubmit} />
                            </div>
                        </div>

                        <p className="mt-4 text-center text-[10px] leading-6 text-[var(--theme-text)]/45">
                            {isArabic ? "نحرص على سرية بياناتك واستخدامها لأغراض التواصل المتعلقة بالمعرض." : "Your information is kept confidential and used only for exhibition-related communication."}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}