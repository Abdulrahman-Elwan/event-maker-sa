
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Locale } from "@/lib/i18n/config";
import type { ExhibitorRegistrationFormValues } from "@/types/registration";
import { createExhibitorRegistrationSchema } from "@/lib/validations/registration";

interface ExhibitorRegistrationFormProps {
    locale: Locale;
    onSubmit: (values: ExhibitorRegistrationFormValues) => void | Promise<void>;
}

export default function ExhibitorRegistrationForm({
    locale,
    onSubmit,
}: ExhibitorRegistrationFormProps) {
    const isArabic = locale === "ar";
    const exhibitorSchema = createExhibitorRegistrationSchema(locale);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExhibitorRegistrationFormValues>({
        resolver: zodResolver(exhibitorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            company_name: "",
            job_title: "",
            business_type: "",
            required_space: "",
            inquiries: "",
        },
    });

    const handleFormSubmit = async (
        values: ExhibitorRegistrationFormValues
    ) => {
        try {
            await onSubmit(values);
            reset();
        } catch (error) {
            console.error("Exhibitor registration submission error:", error);
        }
    };

    const labels = {
        name: isArabic ? "الاسم الكامل" : "Full Name",
        email: isArabic ? "البريد الإلكتروني" : "Email Address",
        phone: isArabic ? "رقم الجوال" : "Mobile Number",
        company: isArabic ? "اسم الشركة" : "Company Name",
        job: isArabic ? "المسمى الوظيفي" : "Job Title",
        business: isArabic ? "نوع النشاط أو المنتج" : "Business Activity or Product",
        space: isArabic ? "المساحة المطلوبة (م²)" : "Required Space (m²)",
        inquiries: isArabic ? "استفسارات أخرى (اختياري)" : "Other Inquiries (Optional)",
        submit: isArabic ? "تسجيل كعارض" : "Register as Exhibitor",
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

                <div>
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

                <div>
                    <label className={labelClass}>
                        {labels.company} *
                    </label>
                    <input
                        {...register("company_name")}
                        type="text"
                        autoComplete="organization"
                        placeholder={labels.company}
                        className={inputClass}
                    />
                    {errors.company_name && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.company_name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>
                        {labels.job} *
                    </label>
                    <input
                        {...register("job_title")}
                        type="text"
                        autoComplete="organization-title"
                        placeholder={labels.job}
                        className={inputClass}
                    />
                    {errors.job_title && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.job_title.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>
                        {labels.space} *
                    </label>
                    <input
                        {...register("required_space")}
                        type="number"
                        min="0.1"
                        step="0.1"
                        inputMode="decimal"
                        placeholder="مثال: 36"
                        dir="ltr"
                        className={inputClass}
                    />
                    {errors.required_space && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.required_space.message}
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        {labels.business} *
                    </label>
                    <textarea
                        {...register("business_type")}
                        rows={3}
                        placeholder={labels.placeholder}
                        className={`${inputClass} resize-y`}
                    />
                    {errors.business_type && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.business_type.message}
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
