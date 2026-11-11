// lib\email\mailer.ts
import "server-only";

import nodemailer from "nodemailer";
import type { SendMailOptions, Transporter } from "nodemailer";

type SendEmailOptions = Pick<
    SendMailOptions,
    "to" | "subject" | "text" | "html" | "attachments"
>;

let transporter: Transporter | null = null;

function getMailer(): Transporter {
    if (transporter) {
        return transporter;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host || !user || !password) {
        throw new Error("SMTP configuration is incomplete.");
    }

    if (!Number.isInteger(port) || port <= 0) {
        throw new Error("Invalid SMTP_PORT configuration.");
    }

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass: password,
        },
    });

    return transporter;
}

export async function sendEmail(options: SendEmailOptions) {
    const from = process.env.EMAIL_FROM;

    if (!from) {
        throw new Error("EMAIL_FROM is missing.");
    }

    return getMailer().sendMail({
        ...options,
        from,
    });
}

export async function sendTestEmail() {
    const user = process.env.SMTP_USER;

    if (!user) {
        throw new Error("SMTP_USER is missing.");
    }

    return sendEmail({
        to: user,
        subject: "Event Maker - SMTP Test",
        text: "SMTP email sending is working successfully.",
        html: `
            <div style="font-family:Arial,sans-serif;padding:24px;color:#222">
                <h2 style="color:#1677b8">Event Maker</h2>
                <p>SMTP connection and email delivery test completed.</p>
            </div>
        `,
    });
}
