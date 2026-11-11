// app/api/registrations/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes,
} from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/mailer";
import {
    createRegistrationEmail,
    createAdminRegistrationBatchEmail,
} from "@/lib/email/registration-templates";
import { generateVisitorQrCode } from "@/lib/qr/visitor-ticket";

import type { Locale } from "@/lib/i18n/config";

const VERIFICATIONS_COLLECTION = "registration_email_verifications";
const REGISTRATIONS_COLLECTION = "exhibition_registrations";
const TICKETS_COLLECTION = "visitor_tickets";
const OUTBOX_COLLECTION = "email_outbox";

const ADMIN_BATCH_STATE_COLLECTION = "admin_notification_batches";
const ADMIN_BATCH_STATE_ID = "state";

const ADMIN_BATCH_SIZE = 100;

type VerificationResult =
    | {
        status: "success";
        registrationId: string;
        adminBatchId?: string;
    }
    | {
        status: "already_confirmed";
        registrationId: string;
    }
    | {
        status: "already_processed";
        registrationId?: string;
    }
    | { status: "expired" }
    | { status: "invalid" };

type RegistrationEmailDetails = {
    registrationId: string;
    registrationType: "visitor" | "exhibitor";
    locale: Locale;
    data: Record<string, unknown>;
    exhibition: {
        title: unknown;
        start_date: unknown;
        end_date: unknown;
        location: unknown;
    };
};

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

function verificationPage(
    title: string,
    message: string,
    success: boolean,
    token?: string,
) {
    const color = success ? "#16834a" : "#c0392b";

    const confirmButton = token
        ? `
            <form method="POST" action="/api/registrations/verify"
                onsubmit='
                    const button = this.querySelector("button");
                    if (!button || button.disabled) {return false;}
                    button.disabled = true;
                    button.setAttribute("aria-busy", "true");
                    button.textContent = "جاري تأكيد البريد الإلكتروني...";
                    button.style.opacity = "0.6";
                    button.style.cursor = "not-allowed";
                    return true;
                '
            >
                <input
                    type="hidden"
                    name="token"
                    value="${escapeHtml(token)}"
                />
                <button
                    type="submit"
                    style="background:#1677b8;color:#fff;border:0;padding:14px 28px;border-radius:6px;font-size:16px;cursor:pointer"
                >
                    تأكيد البريد الإلكتروني
                </button>
            </form>
        `
        : "";

    return new NextResponse(
        `<!DOCTYPE html>
        <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="robots" content="noindex,nofollow" />
                <title>${escapeHtml(title)} | Event Maker</title>
            </head>
            <body style="margin:0;background:#f5f7fa;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;box-sizing:border-box">
                <main style="background:#fff;max-width:480px;width:100%;padding:40px 28px;border-radius:12px;text-align:center;box-shadow:0 5px 25px rgba(0,0,0,.07)">
                    <h1 style="color:${color};font-size:25px">${escapeHtml(title)}</h1>
                    <p style="color:#555;line-height:1.9">${escapeHtml(message)}</p>
                    ${confirmButton}
                    <p style="margin-top:30px;color:#777;font-size:14px">Event Maker</p>
                </main>
            </body>
        </html>`,
        {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store",
                "X-Robots-Tag": "noindex, nofollow",
            },
        },
    );
}

/**
 * تشفير رمز التذكرة باستخدام AES-256-GCM.
 * المفتاح يجب أن يكون 64 خانة Hex = 32 bytes.
 */
function encryptTicketToken(token: string): string {
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

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

function decryptTicketToken(encryptedToken: string): string {
    const secret = process.env.TICKET_ENCRYPTION_KEY;

    if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) {
        throw new Error(
            "TICKET_ENCRYPTION_KEY must be a 64-character hexadecimal key.",
        );
    }

    const parts = encryptedToken.split(":");

    if (parts.length !== 3) {
        throw new Error("Invalid encrypted ticket token.");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;

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
 * تحويل بيانات التسجيل إلى الشكل المستخدم في قوالب البريد.
 */
function getRegistrationEmailDetails(
    registrationId: string,
    registrationData: FirebaseFirestore.DocumentData,
): RegistrationEmailDetails {
    const registrationType = registrationData.registrationType;

    if (
        registrationType !== "visitor" &&
        registrationType !== "exhibitor"
    ) {
        throw new Error("Invalid registration type.");
    }

    return {
        registrationId,
        registrationType,
        locale: registrationData.locale === "en" ? "en" : "ar",
        data: registrationData.data ?? {},
        exhibition: {
            title: registrationData.exhibition?.title ?? {},
            start_date: registrationData.exhibition?.start_date ?? "",
            end_date: registrationData.exhibition?.end_date ?? "",
            location: registrationData.exhibition?.location ?? null,
        },
    };
}

async function verifyToken(token: string): Promise<VerificationResult> {
    const tokenHash = hashToken(token);

    const verificationRef = adminDb
        .collection(VERIFICATIONS_COLLECTION)
        .doc(tokenHash);

    const batchStateRef = adminDb
        .collection(ADMIN_BATCH_STATE_COLLECTION)
        .doc(ADMIN_BATCH_STATE_ID);

    return adminDb.runTransaction(async (transaction) => {
        // 1. قراءة بيانات التحقق.
        const verificationDoc = await transaction.get(verificationRef);

        if (!verificationDoc.exists) return { status: "invalid" };

        const verificationData = verificationDoc.data();

        if (!verificationData) return { status: "invalid" };

        const registrationId = verificationData.registrationId;

        if (typeof registrationId !== "string" || !registrationId) {
            return { status: "invalid" };
        }

        if (!verificationData.expiresAt || typeof verificationData.expiresAt.toMillis !== "function" || verificationData.expiresAt.toMillis() <= Date.now()) {
            return { status: "expired" };
        }

        // 2. قراءة التسجيل.
        const registrationRef = adminDb
            .collection(REGISTRATIONS_COLLECTION)
            .doc(registrationId);

        const registrationDoc = await transaction.get(registrationRef);

        if (!registrationDoc.exists) {
            return { status: "invalid" };
        }

        const registrationData = registrationDoc.data();

        if (!registrationData) {
            return { status: "invalid" };
        }

        // 3. التعامل مع طلبات التحقق المكررة.
        // لو التسجيل اتأكد بالفعل، نرجع نجاح بدل رسالة خطأ.
        if (verificationData.usedAt || registrationData.status === "confirmed") {
            return {
                status: "already_confirmed",
                registrationId,
            };
        }

        // أي حالة أخرى غير pending_verification لا يتم معالجتها.
        if (registrationData.status !== "pending_verification") {
            return {
                status: "already_processed",
                registrationId,
            };
        }

        const registrationType = registrationData.registrationType;
        if (registrationType !== "visitor" && registrationType !== "exhibitor") return { status: "invalid" };

        // 4. قراءة مهمة تأكيد المسجل.
        const registrantJobRef = adminDb
            .collection(OUTBOX_COLLECTION)
            .doc(`${registrationId}_registrant_confirmation`);

        const registrantJobDoc = await transaction.get(registrantJobRef);

        // 5. قراءة التذكرة سواء كان التسجيل زائرًا أو عارضًا.
        const ticketRef = adminDb
            .collection(TICKETS_COLLECTION)
            .doc(registrationId);

        const ticketDoc = await transaction.get(ticketRef);

        // 6. قراءة حالة تجميع إشعارات الإدارة.
        const batchStateDoc = await transaction.get(batchStateRef);
        const batchStateData = batchStateDoc.data();

        const currentRegistrationIds: string[] =
            Array.isArray(batchStateData?.registrationIds) ? batchStateData.registrationIds.filter((id: unknown): id is string => typeof id === "string",) : [];

        const currentBatchNumber = typeof batchStateData?.batchNumber === "number" ? batchStateData.batchNumber : 0;

        // 7. تجهيز رمز التذكرة إذا لم تكن موجودة.
        let newTicketToken: string | null = null;
        let encryptedTicketToken: string | null = null;
        let ticketTokenHash: string | null = null;

        if (!ticketDoc.exists) {
            newTicketToken = randomBytes(32).toString("hex");
            encryptedTicketToken = encryptTicketToken(newTicketToken);
            ticketTokenHash = hashToken(newTicketToken);
        }

        // 8. التحقق من البريد الإلكتروني.
        const recipientEmail = registrationData.data?.email;

        if (typeof recipientEmail !== "string" || !recipientEmail.trim()) throw new Error("Registration email is missing.");

        // 9. إضافة التسجيل الحالي إلى طابور الإدارة.
        const updatedRegistrationIds = [...currentRegistrationIds, registrationId,];
        const shouldCreateAdminBatch = updatedRegistrationIds.length >= ADMIN_BATCH_SIZE;
        let adminBatchId: string | undefined;

        if (shouldCreateAdminBatch) {
            const nextBatchNumber = currentBatchNumber + 1;
            adminBatchId = `admin_batch_${String(nextBatchNumber).padStart(6, "0")}`;
        }

        // 10. تحديث التسجيل.
        transaction.update(registrationRef, {
            status: "confirmed",
            emailVerified: true,
            emailVerifiedAt: FieldValue.serverTimestamp(),
            registrantEmailStatus: registrantJobDoc.exists ? "queued" : "pending",
            adminEmailStatus: "queued",
            updatedAt: FieldValue.serverTimestamp(),
        });

        // 11. استهلاك رابط التحقق.
        transaction.update(verificationRef, {
            usedAt: FieldValue.serverTimestamp(),
        });

        // 12. إنشاء تذكرة للزائر أو العارض مرة واحدة فقط.
        if (!ticketDoc.exists && newTicketToken && encryptedTicketToken && ticketTokenHash) {
            transaction.set(ticketRef, {
                registrationId,
                registrationType,
                exhibitionId: registrationData.exhibition?.id ?? null,
                tokenHash: ticketTokenHash,
                encryptedToken: encryptedTicketToken,
                status: "valid",
                checkedIn: false,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        }

        // 13. إنشاء مهمة تأكيد المسجل.
        if (!registrantJobDoc.exists) {
            transaction.set(registrantJobRef, {
                registrationId,
                type: "registrant_confirmation",
                recipient: recipientEmail.trim(),
                status: "pending",
                attempts: 0,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        }

        // 14. تحديث طابور تجميع الإدارة.
        if (shouldCreateAdminBatch && adminBatchId) {
            const adminBatchRef = adminDb
                .collection(OUTBOX_COLLECTION)
                .doc(adminBatchId);

            transaction.set(adminBatchRef, {
                type: "admin_registration_batch",
                registrationIds: updatedRegistrationIds,
                recipient: process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ?? "",
                status: "pending",
                attempts: 0,
                registrationCount: updatedRegistrationIds.length,
                batchNumber: currentBatchNumber + 1,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });

            // بدء تجميع مجموعة جديدة.
            transaction.set(batchStateRef, {
                registrationIds: [],
                batchNumber: currentBatchNumber + 1,
                updatedAt: FieldValue.serverTimestamp(),
            });
        } else {
            transaction.set(
                batchStateRef,
                {
                    registrationIds: updatedRegistrationIds,
                    batchNumber: currentBatchNumber,
                    updatedAt: FieldValue.serverTimestamp(),
                },
                { merge: true },
            );
        }

        return {
            status: "success",
            registrationId,
            adminBatchId,
        };
    });
}

async function processRegistrantConfirmation(registrationId: string) {
    const jobId = `${registrationId}_registrant_confirmation`;

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

        if (!jobData || jobData.status !== "pending") {
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
            throw new Error("Outbox job or registration not found.");
        }

        const recipient = jobData.recipient;

        if (typeof recipient !== "string" || !recipient.trim()) {
            throw new Error("Email recipient is missing.");
        }

        const details = getRegistrationEmailDetails(registrationId, registrationData,);
        const email = createRegistrationEmail(details);

        const attachments: Array<{
            filename: string;
            content: Buffer;
            contentType: string;
            cid?: string;
        }> = [];

        // إرفاق QR للزائر أو العارض.
        const ticketDoc = await adminDb
            .collection(TICKETS_COLLECTION)
            .doc(registrationId)
            .get();

        const ticketData = ticketDoc.data();

        if (!ticketData || typeof ticketData.encryptedToken !== "string") {
            throw new Error("Registration ticket was not found.");
        }

        const ticketToken = decryptTicketToken(ticketData.encryptedToken,);
        const qrBuffer = await generateVisitorQrCode(ticketToken);

        attachments.push({
            filename: `event-maker-${details.registrationType}-ticket.png`,
            content: qrBuffer,
            contentType: "image/png",
            cid: "event-ticket",
        });

        await sendEmail({
            to: recipient,
            subject: email.subject,
            html: email.html,
            text: email.text,
            attachments,
        });

        // تحديث حالة المهمة بعد نجاح الإرسال.
        await jobRef.update({
            status: "sent",
            sentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            lastError: FieldValue.delete(),
        });

        await adminDb
            .collection(REGISTRATIONS_COLLECTION)
            .doc(registrationId)
            .update({
                registrantEmailStatus: "sent",
                updatedAt: FieldValue.serverTimestamp(),
            });
    } catch (error) {
        console.error(
            `Registrant confirmation error (${jobId}):`,
            error,
        );

        const errorMessage =
            error instanceof Error
                ? error.message.slice(0, 500)
                : "Unknown email delivery error.";

        // لا نعيد المحاولة تلقائيًا؛ فقد يكون SMTP استلم الرسالة بالفعل.
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
                registrantEmailStatus: "needs_review",
                updatedAt: FieldValue.serverTimestamp(),
            });
    }
}

async function processAdminBatchJob(batchId: string) {
    const jobRef = adminDb
        .collection(OUTBOX_COLLECTION)
        .doc(batchId);

    // حجز التقرير لمنع إرساله مرتين بالتزامن.
    const claimed = await adminDb.runTransaction(async (transaction) => {
        const jobDoc = await transaction.get(jobRef);

        if (!jobDoc.exists) {
            return false;
        }

        const jobData = jobDoc.data();

        if (
            !jobData ||
            jobData.status !== "pending" ||
            jobData.type !== "admin_registration_batch"
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
        const jobDoc = await jobRef.get();
        const jobData = jobDoc.data();

        if (!jobData) {
            throw new Error("Admin batch job was not found.");
        }

        const registrationIds: string[] = Array.isArray(
            jobData.registrationIds,
        )
            ? jobData.registrationIds.filter(
                (id: unknown): id is string =>
                    typeof id === "string",
            )
            : [];

        if (registrationIds.length !== ADMIN_BATCH_SIZE) {
            throw new Error(
                `Invalid admin batch size: expected ${ADMIN_BATCH_SIZE}, received ${registrationIds.length}.`,
            );
        }

        const recipient =
            typeof jobData.recipient === "string" &&
                jobData.recipient.trim()
                ? jobData.recipient.trim()
                : process.env.ADMIN_NOTIFICATION_EMAIL?.trim();

        if (!recipient) {
            throw new Error("ADMIN_NOTIFICATION_EMAIL is missing.");
        }

        // جلب التسجيلات المئة.
        const registrationDocs = await Promise.all(
            registrationIds.map((registrationId) =>
                adminDb
                    .collection(REGISTRATIONS_COLLECTION)
                    .doc(registrationId)
                    .get(),
            ),
        );

        const registrations: RegistrationEmailDetails[] =
            registrationDocs.map((registrationDoc, index) => {
                if (!registrationDoc.exists) {
                    throw new Error(
                        `Registration ${registrationIds[index]} was not found.`,
                    );
                }

                const registrationData = registrationDoc.data();

                if (!registrationData) {
                    throw new Error(
                        `Registration ${registrationIds[index]} has no data.`,
                    );
                }

                return getRegistrationEmailDetails(
                    registrationIds[index],
                    registrationData,
                );
            });

        const email = createAdminRegistrationBatchEmail(registrations);

        await sendEmail({
            to: recipient,
            subject: email.subject,
            html: email.html,
            text: email.text,
        });

        // تسجيل نجاح إرسال التقرير.
        await jobRef.update({
            status: "sent",
            sentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            lastError: FieldValue.delete(),
        });

        // تحديث حالة التسجيلات التابعة للتقرير.
        await Promise.all(
            registrationIds.map((registrationId) =>
                adminDb
                    .collection(REGISTRATIONS_COLLECTION)
                    .doc(registrationId)
                    .update({
                        adminEmailStatus: "sent",
                        adminEmailBatchId: batchId,
                        updatedAt: FieldValue.serverTimestamp(),
                    }),
            ),
        );
    } catch (error) {
        console.error(
            `Admin batch email error (${batchId}):`,
            error,
        );

        const errorMessage =
            error instanceof Error
                ? error.message.slice(0, 500)
                : "Unknown admin batch delivery error.";

        // لا نعيد إرسال التقرير تلقائيًا عند حدوث خطأ غير محسوم.
        await jobRef.update({
            status: "needs_review",
            lastError: errorMessage,
            failedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        const jobDoc = await jobRef.get();
        const jobData = jobDoc.data();

        const registrationIds: string[] = Array.isArray(
            jobData?.registrationIds,
        )
            ? jobData.registrationIds.filter(
                (id: unknown): id is string =>
                    typeof id === "string",
            )
            : [];

        await Promise.all(
            registrationIds.map((registrationId) =>
                adminDb
                    .collection(REGISTRATIONS_COLLECTION)
                    .doc(registrationId)
                    .update({
                        adminEmailStatus: "needs_review",
                        adminEmailBatchId: batchId,
                        updatedAt: FieldValue.serverTimestamp(),
                    }),
            ),
        );
    }
}

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
        return verificationPage(
            "رابط غير صالح",
            "رابط التحقق غير صحيح أو غير مكتمل.",
            false,
        );
    }

    return verificationPage(
        "تأكيد البريد الإلكتروني",
        "اضغط على الزر أدناه لتأكيد ملكيتك للبريد الإلكتروني وإكمال التسجيل.",
        true,
        token,
    );
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const token = formData.get("token");

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token)
        ) {
            return verificationPage(
                "رابط غير صالح",
                "رابط التحقق غير صحيح أو غير مكتمل.",
                false,
            );
        }

        const result = await verifyToken(token);

        if (result.status === "success" || result.status === "already_confirmed") {
            const tasks: Promise<void>[] = [processRegistrantConfirmation(result.registrationId),];

            // إرسال تقرير الإدارة فقط عند إنشاء مجموعة جديدة.
            if (result.status === "success" && result.adminBatchId) {
                tasks.push(processAdminBatchJob(result.adminBatchId),);
            }

            await Promise.all(tasks);

            return verificationPage("تم تأكيد بريدك الإلكتروني بنجاح",
                result.status === "already_confirmed" ? "تم تأكيد بريدك الإلكتروني وتسجيلك بالفعل. لا تحتاج إلى اتخاذ أي إجراء إضافي، وشكرًا لانضمامك إلينا!" : "شكرًا لك! تم التحقق من بريدك الإلكتروني وتأكيد تسجيلك. إذا لم تصلك رسالة التأكيد، فقد تكون قيد المعالجة.",
                true,
            );
        }

        if (result.status === "already_processed") {
            return verificationPage(
                "تمت معالجة هذا التسجيل",
                "تم استخدام رابط التحقق من قبل أو تمت معالجة التسجيل بالفعل.",
                false,
            );
        }

        if (result.status === "expired") {
            return verificationPage(
                "انتهت صلاحية الرابط",
                "انتهت صلاحية رابط التحقق. يرجى طلب رابط تحقق جديد.",
                false,
            );
        }

        return verificationPage(
            "رابط التحقق غير صالح",
            "تعذر التحقق من هذا الرابط. تأكد من استخدام الرابط الصحيح.",
            false,
        );
    } catch (error) {
        console.error("Email verification error:", error);

        return verificationPage(
            "حدث خطأ",
            "تم استلام طلبك، لكن حدث خطأ أثناء إكمال العملية. حاول مرة أخرى لاحقًا.",
            false,
        );
    }
}
