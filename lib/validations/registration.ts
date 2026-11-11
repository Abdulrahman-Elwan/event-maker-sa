// lib\validations\registration.ts

import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";

function getMessages(locale: Locale) {
    const isArabic = locale === "ar";

    return {
        name: isArabic
            ? "الاسم مطلوب ويجب أن يكون حرفين على الأقل"
            : "Name is required and must be at least 2 characters",

        email: isArabic
            ? "من فضلك أدخل بريدًا إلكترونيًا صحيحًا"
            : "Please enter a valid email address",

        phone: isArabic
            ? "من فضلك أدخل رقم هاتف صحيح"
            : "Please enter a valid phone number",

        inquiries: isArabic
            ? "يجب ألا تتجاوز الاستفسارات 2000 حرف"
            : "Inquiries must not exceed 2000 characters",

        opportunityType: isArabic
            ? "من فضلك وضّح نوع الفرصة التي تبحث عنها"
            : "Please describe the type of opportunity you're looking for",

        companyName: isArabic
            ? "اسم الشركة مطلوب"
            : "Company name is required",

        jobTitle: isArabic
            ? "المسمى الوظيفي مطلوب"
            : "Job title is required",

        businessType: isArabic
            ? "من فضلك وضّح نوع النشاط أو المنتج"
            : "Please describe your business or product type",

        requiredSpace: isArabic
            ? "أدخل مساحة صحيحة أكبر من صفر"
            : "Please enter a valid area greater than zero",
    };
}

function createBaseSchema(locale: Locale) {
    const messages = getMessages(locale);

    return {
        name: z.string().trim().min(2, messages.name).max(100),
        email: z.string().trim().email(messages.email).max(150),
        phone: z
            .string()
            .trim()
            .min(7, messages.phone)
            .max(20, messages.phone)
            .regex(/^[+]?[\d\s()-]+$/, messages.phone),
        inquiries: z.string().trim().max(2000, messages.inquiries),
    };
}

export function createVisitorRegistrationSchema(locale: Locale) {
    const messages = getMessages(locale);

    return z.object({
        ...createBaseSchema(locale),

        opportunity_type: z
            .string()
            .trim()
            .min(2, messages.opportunityType)
            .max(1000),
    });
}

export function createExhibitorRegistrationSchema(locale: Locale) {
    const messages = getMessages(locale);

    return z.object({
        ...createBaseSchema(locale),

        company_name: z
            .string()
            .trim()
            .min(2, messages.companyName)
            .max(150),

        job_title: z
            .string()
            .trim()
            .min(2, messages.jobTitle)
            .max(100),

        business_type: z
            .string()
            .trim()
            .min(2, messages.businessType)
            .max(1000),

        required_space: z
            .string()
            .trim()
            .regex(/^\d+(\.\d+)?$/, messages.requiredSpace)
            .refine((value) => Number(value) > 0, messages.requiredSpace),
    });
}