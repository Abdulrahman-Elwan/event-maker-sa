import { z } from "zod";

export const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name must not exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(150, "Email must not exceed 150 characters."),

    phone: z
        .string()
        .trim()
        .min(7, "Please enter a valid phone number.")
        .max(25, "Phone number must not exceed 25 characters.")
        .regex(
            /^[0-9+\s().-]+$/,
            "Please enter a valid phone number."
        ),

    brandName: z
        .string()
        .trim()
        .max(150, "Brand name must not exceed 150 characters.")
        .optional()
        .or(z.literal("")),

    message: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters.")
        .max(3000, "Message must not exceed 3000 characters."),

    locale: z.enum(["ar", "en"]),
});

export type ContactFormData = z.infer<
    typeof contactFormSchema
>;