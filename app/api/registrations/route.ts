// app\api\registrations\route.ts
import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes,
} from "node:crypto";

import { adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/mailer";
import type { Locale } from "@/lib/i18n/config";

import {
    createVisitorRegistrationSchema,
    createExhibitorRegistrationSchema,
} from "@/lib/validations/registration";

const REGISTRATIONS_COLLECTION = "exhibition_registrations";
const EXHIBITIONS_COLLECTION = "exhibitions";
const VERIFICATIONS_COLLECTION = "registration_email_verifications";
const OUTBOX_COLLECTION = "email_outbox";

const VERIFICATION_EXPIRY_MINUTES = 30;

type RegistrationType = "visitor" | "exhibitor";

function getErrorMessage(
    locale: Locale,
    type: "invalid" | "notFound" | "inactive" | "server",
) {
    const messages = {
        ar: {
            invalid: "البيانات المرسلة غير صحيحة.",
            notFound: "المعرض المطلوب غير موجود.",
            inactive: "التسجيل في هذا المعرض غير متاح حاليًا.",
            server: "حدث خطأ أثناء إرسال التسجيل. حاول مرة أخرى.",
        },
        en: {
            invalid: "The submitted data is invalid.",
            notFound: "The requested exhibition was not found.",
            inactive: "Registration for this exhibition is currently unavailable.",
            server: "An error occurred while submitting your registration. Please try again.",
        },
    };

    return messages[locale][type];
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

function getLocalizedText(value: unknown, locale: Locale): string {
    if (typeof value === "string") return value;

    if (value && typeof value === "object") {
        const localized = value as Record<string, unknown>;
        const result = localized[locale] ?? localized.ar ?? localized.en;

        return typeof result === "string" ? result : "";
    }

    return "";
}

/**
 * تشفير رمز التحقق باستخدام AES-256-GCM.
 * نستخدم TICKET_ENCRYPTION_KEY الحالي لتجنب إضافة متغير بيئة جديد.
 */
function encryptVerificationToken(token: string): string {
    const secret = process.env.TICKET_ENCRYPTION_KEY;

    if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) {
        throw new Error(
            "TICKET_ENCRYPTION_KEY must be a 64-character hexadecimal key.",
        );
    }

    const key = Buffer.from(secret, "hex");
    const iv = randomBytes(12);

    const cipher = createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(token, "utf8"),
        cipher.final(),
    ]);

    return [
        iv.toString("hex"),
        cipher.getAuthTag().toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

/**
 * فك تشفير رمز التحقق.
 */
function decryptVerificationToken(encryptedToken: string): string {
    const secret = process.env.TICKET_ENCRYPTION_KEY;

    if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) {
        throw new Error(
            "TICKET_ENCRYPTION_KEY must be a 64-character hexadecimal key.",
        );
    }

    const parts = encryptedToken.split(":");

    if (parts.length !== 3) {
        throw new Error("Invalid encrypted verification token.");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;

    if (
        !/^[a-f0-9]{24}$/i.test(ivHex) ||
        !/^[a-f0-9]{32}$/i.test(authTagHex) ||
        !/^[a-f0-9]+$/i.test(encryptedHex)
    ) {
        throw new Error("Invalid encrypted verification token format.");
    }

    const key = Buffer.from(secret, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = createDecipheriv("aes-256-gcm", key, iv);

    decipher.setAuthTag(authTag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).toString("utf8");
}

function hashToken(token: string) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

/**
 * إرسال رسالة التحقق من خلال Outbox.
 */
async function processVerificationEmail(registrationId: string) {
    const jobId = `${registrationId}_verification_email`;

    const jobRef = adminDb
        .collection(OUTBOX_COLLECTION)
        .doc(jobId);

    // حجز المهمة لمنع تنفيذها بالتزامن مرتين.
    const claimed = await adminDb.runTransaction(async (transaction) => {
        const jobDoc = await transaction.get(jobRef);

        if (!jobDoc.exists) {
            return false;
        }

        const jobData = jobDoc.data();

        if (
            !jobData ||
            jobData.type !== "verification_email" ||
            jobData.status !== "pending"
        ) {
            return false;
        }

        transaction.update(jobRef, {
            status: "sending",
            attempts: FieldValue.increment(1),
            startedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return true;
    });

    if (!claimed) {
        return;
    }

    try {
        const [jobDoc, registrationDoc] = await Promise.all([
            jobRef.get(),
            adminDb
                .collection(REGISTRATIONS_COLLECTION)
                .doc(registrationId)
                .get(),
        ]);

        const jobData = jobDoc.data();
        const registrationData = registrationDoc.data();

        if (!jobData || !registrationData) {
            throw new Error("Verification job or registration not found.");
        }

        const recipient = jobData.recipient;

        if (
            typeof recipient !== "string" ||
            !recipient.trim()
        ) {
            throw new Error("Verification email recipient is missing.");
        }

        if (typeof jobData.encryptedToken !== "string") {
            throw new Error("Encrypted verification token is missing.");
        }

        if (typeof jobData.siteUrl !== "string") {
            throw new Error("Verification site URL is missing.");
        }

        const token = decryptVerificationToken(jobData.encryptedToken);

        const verificationUrl = new URL(
            "/api/registrations/verify",
            jobData.siteUrl,
        );

        verificationUrl.searchParams.set("token", token);

        const locale: Locale =
            registrationData.locale === "en" ? "en" : "ar";

        const personName =
            typeof registrationData.data?.name === "string"
                ? registrationData.data.name
                : "";

        const exhibitionName = getLocalizedText(
            registrationData.exhibition?.title,
            locale,
        );

        const safePersonName = escapeHtml(personName);
        const safeExhibitionName = escapeHtml(exhibitionName);
        const verificationLink = escapeHtml(verificationUrl.toString());

        const subject =
            locale === "ar"
                ? "تأكيد البريد الإلكتروني - Event Maker"
                : "Verify your email - Event Maker";

        const html =
            locale === "ar"
                ? `
                    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#222;line-height:1.8">
                        <h2 style="color:#1677b8">مرحبًا ${safePersonName}</h2>
                        <p>شكرًا لتسجيل اهتمامك في معرض <strong>${safeExhibitionName}</strong>.</p>
                        <p>لتأكيد ملكيتك للبريد الإلكتروني وإكمال التسجيل، اضغط على الزر التالي:</p>
                        <p style="margin:30px 0">
                            <a href="${verificationLink}" style="background:#1677b8;color:#fff;text-decoration:none;padding:13px 24px;border-radius:6px;display:inline-block">
                                تأكيد البريد الإلكتروني
                            </a>
                        </p>
                        <p>صلاحية الرابط ${VERIFICATION_EXPIRY_MINUTES} دقيقة، ويمكن استخدامه مرة واحدة فقط.</p>
                        <p>إذا لم تقم بهذا التسجيل، يمكنك تجاهل الرسالة.</p>
                        <p>فريق Event Maker</p>
                    </div>
                `
                : `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#222;line-height:1.8">
                        <h2 style="color:#1677b8">Hello ${safePersonName}</h2>
                        <p>Thank you for registering your interest in <strong>${safeExhibitionName}</strong>.</p>
                        <p>Please verify your email address to complete your registration:</p>
                        <p style="margin:30px 0">
                            <a href="${verificationLink}" style="background:#1677b8;color:#fff;text-decoration:none;padding:13px 24px;border-radius:6px;display:inline-block">
                                Verify Email Address
                            </a>
                        </p>
                        <p>This link expires in ${VERIFICATION_EXPIRY_MINUTES} minutes and can only be used once.</p>
                        <p>If you did not submit this registration, you can ignore this email.</p>
                        <p>Event Maker Team</p>
                    </div>
                `;

        const text =
            locale === "ar"
                ? `مرحبًا ${personName}، لتأكيد بريدك الإلكتروني وإكمال التسجيل في معرض ${exhibitionName}، افتح الرابط التالي: ${verificationUrl.toString()} . الرابط صالح لمدة ${VERIFICATION_EXPIRY_MINUTES} دقيقة ويستخدم مرة واحدة.`
                : `Hello ${personName}, verify your email to complete your registration for ${exhibitionName}: ${verificationUrl.toString()}. This link expires in ${VERIFICATION_EXPIRY_MINUTES} minutes and can only be used once.`;

        await sendEmail({
            to: recipient,
            subject,
            text,
            html,
        });

        await jobRef.update({
            status: "sent",
            sentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            lastError: FieldValue.delete(),
            encryptedToken: FieldValue.delete(),
        });

        await adminDb
            .collection(REGISTRATIONS_COLLECTION)
            .doc(registrationId)
            .update({
                emailStatus: "verification_sent",
                updatedAt: FieldValue.serverTimestamp(),
            });
    } catch (error) {
        console.error(
            `Verification email error (${jobId}):`,
            error,
        );

        const errorMessage =
            error instanceof Error
                ? error.message.slice(0, 500)
                : "Unknown verification email error.";

        await jobRef.update({
            status: "needs_review",
            lastError: errorMessage,
            failedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        await adminDb
            .collection(REGISTRATIONS_COLLECTION)
            .doc(registrationId)
            .update({
                emailStatus: "verification_needs_review",
                updatedAt: FieldValue.serverTimestamp(),
            });
    }
}

export async function POST(request: NextRequest) {
    let locale: Locale = "ar";

    try {
        const contentLength = Number(
            request.headers.get("content-length") ?? 0,
        );

        if (contentLength > 30_000) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "invalid"),
                },
                { status: 413 },
            );
        }

        const body: unknown = await request.json();

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "invalid"),
                },
                { status: 400 },
            );
        }

        const payload = body as Record<string, unknown>;

        if (payload.locale === "ar" || payload.locale === "en") {
            locale = payload.locale;
        }

        const { registrationType, exhibitionId, data } = payload;

        if (
            (registrationType !== "visitor" &&
                registrationType !== "exhibitor") ||
            typeof exhibitionId !== "string" ||
            !exhibitionId.trim() ||
            exhibitionId.length > 150 ||
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "invalid"),
                },
                { status: 400 },
            );
        }

        const typedRegistrationType = registrationType as RegistrationType;

        const schema =
            typedRegistrationType === "visitor"
                ? createVisitorRegistrationSchema(locale)
                : createExhibitorRegistrationSchema(locale);

        const validation = schema.safeParse(data);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "invalid"),
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        // التأكد من إعداد رابط الموقع قبل إنشاء التسجيل.
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

        if (!siteUrl) {
            throw new Error("NEXT_PUBLIC_SITE_URL is missing.");
        }

        const parsedSiteUrl = new URL(siteUrl);

        if (
            parsedSiteUrl.protocol !== "https:" &&
            parsedSiteUrl.protocol !== "http:"
        ) {
            throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
        }

        // جلب بيانات المعرض.
        const exhibitionRef = adminDb
            .collection(EXHIBITIONS_COLLECTION)
            .doc(exhibitionId);

        const exhibitionDoc = await exhibitionRef.get();

        if (!exhibitionDoc.exists) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "notFound"),
                },
                { status: 404 },
            );
        }

        const exhibitionData = exhibitionDoc.data();

        if (!exhibitionData || exhibitionData.is_active === false) {
            return NextResponse.json(
                {
                    success: false,
                    message: getErrorMessage(locale, "inactive"),
                },
                { status: 403 },
            );
        }

        const exhibitionSnapshot = {
            id: exhibitionDoc.id,
            slug: exhibitionData.slug ?? "",
            title: exhibitionData.title ?? { ar: "", en: "" },
            series_id: exhibitionData.series_id ?? "",
            version: exhibitionData.version ?? "",
            start_date: exhibitionData.start_date ?? "",
            end_date: exhibitionData.end_date ?? "",
            location: exhibitionData.location ?? null,
        };

        // إنشاء معرف التسجيل.
        const registrationRef = adminDb
            .collection(REGISTRATIONS_COLLECTION)
            .doc();

        // إنشاء رمز التحقق وتخزين Hash فقط في مستند التحقق.
        const token = randomBytes(32).toString("hex");

        const tokenHash = hashToken(token);
        const encryptedToken = encryptVerificationToken(token);

        const verificationRef = adminDb
            .collection(VERIFICATIONS_COLLECTION)
            .doc(tokenHash);

        const verificationJobRef = adminDb
            .collection(OUTBOX_COLLECTION)
            .doc(`${registrationRef.id}_verification_email`);

        const recipientEmail = validation.data.email.trim();

        // حفظ التسجيل والتحقق ومهمة البريد في Transaction واحدة.
        await adminDb.runTransaction(async (transaction) => {
            transaction.set(registrationRef, {
                registrationType: typedRegistrationType,
                exhibition: exhibitionSnapshot,
                locale,
                data: validation.data,
                status: "pending_verification",
                emailVerified: false,
                emailStatus: "verification_pending",
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });

            transaction.set(verificationRef, {
                registrationId: registrationRef.id,
                expiresAt: Timestamp.fromDate(
                    new Date(
                        Date.now() +
                            VERIFICATION_EXPIRY_MINUTES * 60 * 1000,
                    ),
                ),
                usedAt: null,
                createdAt: FieldValue.serverTimestamp(),
            });

            transaction.set(verificationJobRef, {
                registrationId: registrationRef.id,
                type: "verification_email",
                recipient: recipientEmail,
                encryptedToken,
                siteUrl: parsedSiteUrl.origin,
                status: "pending",
                attempts: 0,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        });

        // محاولة الإرسال فورًا، مع الاحتفاظ بالمهمة في Outbox.
        await processVerificationEmail(registrationRef.id);

        return NextResponse.json(
            {
                success: true,
                message:
                    locale === "ar"
                        ? "تم استلام بياناتك. تحقق من بريدك الإلكتروني واضغط على رابط التأكيد لإكمال التسجيل."
                        : "Your details have been received. Check your email and click the verification link to complete your registration.",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: getErrorMessage(locale, "server"),
            },
            { status: 500 },
        );
    }
}