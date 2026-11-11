
import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email/mailer";

export async function POST() {
    // منع تشغيل اختبار SMTP في بيئة الإنتاج.
    if (
        process.env.NODE_ENV === "production" ||
        process.env.SMTP_TEST_ENABLED !== "true"
    ) {
        return NextResponse.json(
            { success: false, message: "Not found." },
            { status: 404 },
        );
    }

    try {
        const info = await sendTestEmail();

        return NextResponse.json({
            success: true,
            message: "Test email sent successfully.",
            messageId: info.messageId,
        });
    } catch (error) {
        console.error("SMTP test failed:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to send test email. Check the server terminal for details.",
            },
            { status: 500 },
        );
    }
}