// components/registration/VisitorRegistrationForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Locale } from "@/lib/i18n/config";
import type { VisitorRegistrationFormValues } from "@/types/registration";
import { createVisitorRegistrationSchema } from "@/lib/validations/registration";

interface VisitorRegistrationFormProps {
    locale: Locale;
    onSubmit: (values: VisitorRegistrationFormValues) => void | Promise<void>;
}

export default function VisitorRegistrationForm({
    locale,
    onSubmit,
}: VisitorRegistrationFormProps) {
    const isArabic = locale === "ar";
    const visitorSchema = createVisitorRegistrationSchema(locale);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<VisitorRegistrationFormValues>({
        resolver: zodResolver(visitorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            opportunity_type: "",
            inquiries: "",
        },
    });

    const handleFormSubmit = async (
        values: VisitorRegistrationFormValues
    ) => {
        try {
            await onSubmit(values);
            reset();
        } catch (error) {
            console.error("Visitor registration submission error:", error);
        }
    };

    const labels = {
        name: isArabic ? "الاسم الكامل" : "Full Name",
        email: isArabic ? "البريد الإلكتروني" : "Email Address",
        phone: isArabic ? "رقم الجوال" : "Mobile Number",
        opportunity: isArabic
            ? "ما نوع الفرصة التي تبحث عنها؟"
            : "What type of opportunity are you looking for?",
        inquiries: isArabic
            ? "استفسارات إضافية (اختياري)"
            : "Additional Inquiries (Optional)",
        submit: isArabic ? "تسجيل كزائر" : "Register as Visitor",
        submitting: isArabic ? "جاري الإرسال..." : "Submitting...",
        placeholder: isArabic ? "اكتب هنا..." : "Write here...",
    };

    const inputClass =
        "w-full rounded-xl border border-[var(--theme-text)]/15 bg-transparent px-4 py-3 text-sm text-[var(--theme-text)] outline-none transition placeholder:text-[var(--theme-text)]/40 focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10";

    const labelClass =
        "mb-2 block text-sm font-medium text-[var(--theme-text)]";

    return (
        <form
            dir={isArabic ? "rtl" : "ltr"}
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            className="space-y-5"
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>
                        {labels.name} *
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        autoComplete="name"
                        placeholder={labels.name}
                        className={inputClass}
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>
                        {labels.email} *
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        placeholder="example@email.com"
                        className={inputClass}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        {labels.phone} *
                    </label>
                    <input
                        {...register("phone")}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+966 5X XXX XXXX"
                        dir="ltr"
                        className={inputClass}
                    />
                    {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        {labels.opportunity} *
                    </label>
                    <textarea
                        {...register("opportunity_type")}
                        rows={3}
                        placeholder={labels.placeholder}
                        className={`${inputClass} resize-y`}
                    />
                    {errors.opportunity_type && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.opportunity_type.message}
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        {labels.inquiries}
                    </label>
                    <textarea
                        {...register("inquiries")}
                        rows={3}
                        placeholder={labels.placeholder}
                        className={`${inputClass} resize-y`}
                    />
                    {errors.inquiries && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.inquiries.message}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-[var(--theme-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? labels.submitting : labels.submit}
            </button>
        </form>
    );
}
