"use client";

import { useState } from "react";
import {
    FiCheckCircle,
    FiSend,
    FiX,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import { contactFormSchema } from "@/lib/validations/contact";

interface ContactFormProps {
    locale: Locale;
}

interface FormState {
    name: string;
    email: string;
    phone: string;
    brandName: string;
    message: string;
}

type FormErrors = Partial<
    Record<keyof FormState, string>
>;

const initialForm: FormState = {
    name: "",
    email: "",
    phone: "",
    brandName: "",
    message: "",
};

export default function ContactForm({ locale, }: ContactFormProps) {
    const isArabic = locale === "ar";
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    function handleChange(field: keyof FormState, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        if (status !== "idle") {
            setStatus("idle");
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setStatus("idle");

        const validation =
            contactFormSchema.safeParse({
                ...form,
                locale,
            });

        if (!validation.success) {
            const fieldErrors: FormErrors = {};

            validation.error.issues.forEach(
                (issue) => {
                    const field = issue.path[0] as keyof FormState;

                    if (!fieldErrors[field]) {
                        fieldErrors[field] = issue.message;
                    }
                }
            );

            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(validation.data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const serverErrors: FormErrors = {};

                    Object.entries(result.errors).forEach(
                        ([field, messages]) => {
                            if (Array.isArray(messages) && messages.length > 0) {
                                serverErrors[field as keyof FormState] = String(messages[0]);
                            }
                        }
                    );

                    setErrors(serverErrors);
                }

                setStatus("error");
                return;
            }

            setForm(initialForm);
            setErrors({});
            setStatus("success");
        } catch {
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const fields = [
        {
            id: "name" as const,
            label: isArabic ? "الاسم الكامل" : "Full Name",
            placeholder: isArabic ? "أدخل اسمك الكامل" : "Enter your full name",
            required: true,
        },
        {
            id: "email" as const,
            label: isArabic ? "البريد الإلكتروني" : "Email Address",
            placeholder: isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email address",
            type: "email",
            required: true,
        },
        {
            id: "phone" as const,
            label: isArabic ? "رقم الهاتف" : "Phone Number",
            placeholder: isArabic ? "أدخل رقم هاتفك" : "Enter your phone number",
            type: "tel",
            required: true,
        },
        {
            id: "brandName" as const,
            label: isArabic ? "اسم العلامة التجارية" : "Brand Name",
            placeholder: isArabic ? "أدخل اسم علامتك التجارية" : "Enter your brand name",
            required: false,
        },
    ];

    return (
        <>
            {status === "success" && (
                <div role="status" aria-live="polite" className="fixed inset-x-4 top-5 z-[100] mx-auto max-w-xl">
                    <div dir={isArabic ? "rtl" : "ltr"} className="flex items-start gap-4 rounded-2xl border border-green-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <FiCheckCircle className="size-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-(--theme-secondary)">
                                {isArabic ? "تم إرسال رسالتك بنجاح" : "Message sent successfully"}
                            </p>

                            <p className="mt-1 text-sm leading-6 text-(--theme-text)/65">
                                {isArabic ? "شكرًا لتواصلك معنا. سيقوم فريقنا بمراجعة رسالتك والتواصل معك في أقرب وقت." : "Thank you for contacting us. Our team will review your message and get back to you as soon as possible."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStatus("idle")}
                            aria-label={isArabic ? "إغلاق رسالة النجاح" : "Close success message"}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-(--theme-text)/45 transition hover:bg-(--theme-secondary)/5 hover:text-(--theme-text)"
                        >
                            <FiX className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            <div dir={isArabic ? "rtl" : "ltr"} className="rounded-3xl border border-(--theme-secondary)/8 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10">
                <div className="mb-7">
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-(--theme-primary)">
                        {isArabic ? "نحن نستمع إليك" : "We are listening"}
                    </span>

                    <h2 className="text-2xl font-bold text-(--theme-secondary) sm:text-3xl">
                        {isArabic ? "أرسل لنا رسالة" : "Send Us a Message"}
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-(--theme-text)/55">
                        {isArabic ? "املأ النموذج وسنعود إليك في أقرب وقت." : "Fill out the form and we will get back to you as soon as possible."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-(--theme-secondary)">
                                    {field.label}

                                    {field.required && (
                                        <span className="ms-1 text-red-500">
                                            *
                                        </span>
                                    )}
                                </label>

                                <input id={field.id} name={field.id} type={field.type ?? "text"}
                                    value={form[field.id]}
                                    onChange={(event) => handleChange(field.id, event.target.value)}
                                    placeholder={field.placeholder}
                                    aria-invalid={Boolean(errors[field.id])}
                                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                                    className={`h-12 w-full rounded-xl border bg-(--theme-backgroundColor) px-4 text-sm text-(--theme-text) outline-none transition placeholder:text-(--theme-text)/35 focus:ring-4 
                                        ${errors[field.id] ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "border-(--theme-secondary)/10 focus:border-(--theme-primary)/60 focus:ring-(--theme-primary)/10"}`}
                                />

                                {errors[field.id] && (
                                    <p id={`${field.id}-error`} className="mt-1.5 text-xs text-red-500">
                                        {errors[field.id]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-(--theme-secondary)">
                            {isArabic ? "رسالتك" : "Message"}

                            <span className="ms-1 text-red-500">
                                *
                            </span>
                        </label>

                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={form.message}
                            onChange={(event) => handleChange("message", event.target.value)}
                            placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your message here..."}
                            aria-invalid={Boolean(errors.message)}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            className={`w-full resize-none rounded-xl border bg-(--theme-backgroundColor) px-4 py-4 text-sm leading-7 text-(--theme-text) outline-none transition placeholder:text-(--theme-text)/35 focus:ring-4 
                                ${errors.message ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "border-(--theme-secondary)/10 focus:border-(--theme-primary)/60 focus:ring-(--theme-primary)/10"}`}
                        />

                        {errors.message && (
                            <p id="message-error" className="mt-1.5 text-xs text-red-500">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting}
                        className="group flex cursor-pointer h-13 w-full items-center justify-center gap-3 rounded-xl bg-(--theme-primary) px-6 text-sm font-bold text-(--theme-secondary) transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span>
                            {isSubmitting ?
                                isArabic ? "جاري الإرسال..." : "Sending..."
                                : isArabic ? "إرسال الرسالة" : "Send Message"}
                        </span>

                        {!isSubmitting && (<FiSend className="size-4 transition-transform group-hover:-translate-y-0.5" />)}
                    </button>

                    {status === "error" && (
                        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                            {isArabic ? "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى." : "Something went wrong while sending your message. Please try again."}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}