
import "server-only";

import type { Locale } from "@/lib/i18n/config";

export type RegistrationEmailDetails = {
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

const BRAND = {
    name: "Event Maker",
    primary: "#1677b8",
    dark: "#123b59",
    background: "#f3f6fa",
    border: "#e5eaf0",
    muted: "#64748b",
};

function escapeHtml(value: string): string {
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

function getString(value: unknown): string {
    if (typeof value === "string") return value.trim();

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    return "";
}

function getText(value: unknown, locale: Locale): string {
    if (typeof value === "string") return value.trim();

    if (value && typeof value === "object" && !Array.isArray(value)) {
        const localized = value as Record<string, unknown>;

        return (
            getString(localized[locale]) ||
            getString(localized.ar) ||
            getString(localized.en)
        );
    }

    return "";
}

function getLocationAddress(value: unknown, locale: Locale): string {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return "";
    }

    const location = value as Record<string, unknown>;

    return getText(location.address, locale);
}

function getRegistrationTypeLabel(
    registrationType: RegistrationEmailDetails["registrationType"],
    locale: Locale,
) {
    if (locale === "ar") {
        return registrationType === "visitor" ? "زائر" : "عارض";
    }

    return registrationType === "visitor" ? "Visitor" : "Exhibitor";
}

function getRegistrationFields(
    details: RegistrationEmailDetails,
    locale: Locale,
): Array<[string, string]> {
    const { data, registrationType } = details;

    const fields: Array<[string, string]> = [
        [locale === "ar" ? "الاسم بالكامل" : "Full Name", getString(data.name)],
        [
            locale === "ar" ? "البريد الإلكتروني" : "Email Address",
            getString(data.email),
        ],
        [
            locale === "ar" ? "رقم الهاتف" : "Phone Number",
            getString(data.phone),
        ],
    ];

    if (registrationType === "visitor") {
        fields.push([
            locale === "ar" ? "نوع الاهتمام" : "Opportunity Type",
            getString(data.opportunity_type),
        ]);
    } else {
        fields.push(
            [
                locale === "ar" ? "اسم الشركة" : "Company Name",
                getString(data.company_name),
            ],
            [
                locale === "ar" ? "المسمى الوظيفي" : "Job Title",
                getString(data.job_title),
            ],
            [
                locale === "ar" ? "مجال العمل" : "Business Type",
                getString(data.business_type),
            ],
            [
                locale === "ar" ? "المساحة المطلوبة" : "Required Space",
                getString(data.required_space),
            ],
        );
    }

    if (data.inquiries) {
        fields.push([
            locale === "ar" ? "الاستفسارات والملاحظات" : "Inquiries",
            getString(data.inquiries),
        ]);
    }

    return fields.filter(([, value]) => value !== "");
}


function getExhibitionFields(
    details: RegistrationEmailDetails,
    locale: Locale,
): Array<[string, string]> {
    const { exhibition } = details;

    const fields: Array<[string, string]> = [
        [
            locale === "ar" ? "اسم المعرض" : "Exhibition Name",
            getText(exhibition.title, locale),
        ],
        [
            locale === "ar" ? "تاريخ البداية" : "Start Date",
            getText(exhibition.start_date, locale),
        ],
        [
            locale === "ar" ? "تاريخ النهاية" : "End Date",
            getText(exhibition.end_date, locale),
        ],
        [
            locale === "ar" ? "موقع المعرض" : "Exhibition Location",
            getLocationAddress(exhibition.location, locale),
        ],
    ];

    return fields.filter(([, value]) => value !== "");
}

function createInfoRows(
    fields: Array<[string, string]>,
    isArabic: boolean,
): string {
    return fields
        .map(
            ([label, value]) => `
                <tr>
                    <td
                        align="${isArabic ? "right" : "left"}"
                        style="
                            padding:12px 14px;
                            width:38%;
                            color:#64748b;
                            font-size:13px;
                            font-weight:600;
                            border-bottom:1px solid #edf0f4;
                            vertical-align:top;
                        "
                    >
                        ${escapeHtml(label)}
                    </td>

                    <td
                        align="${isArabic ? "right" : "left"}"
                        style="
                            padding:12px 14px;
                            color:#1e293b;
                            font-size:14px;
                            font-weight:600;
                            border-bottom:1px solid #edf0f4;
                            vertical-align:top;
                            word-break:break-word;
                        "
                    >
                        ${escapeHtml(value)}
                    </td>
                </tr>
            `,
        )
        .join("");
}

function createSection(
    title: string,
    fields: Array<[string, string]>,
    isArabic: boolean,
): string {
    if (!fields.length) return "";

    return `
        <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
                width:100%;
                border:1px solid #e5eaf0;
                border-radius:10px;
                border-collapse:separate;
                border-spacing:0;
                overflow:hidden;
                margin-bottom:22px;
                background:#ffffff;
            "
        >
            <tr>
                <td
                    colspan="2"
                    align="${isArabic ? "right" : "left"}"
                    style="
                        padding:15px 16px;
                        background:#f5f9fc;
                        color:${BRAND.dark};
                        font-size:15px;
                        font-weight:700;
                        border-bottom:1px solid #e5eaf0;
                    "
                >
                    ${escapeHtml(title)}
                </td>
            </tr>

            ${createInfoRows(fields, isArabic)}
        </table>
    `;
}

function createEmailLayout(options: {
    locale: Locale;
    preheader: string;
    content: string;
}) {
    const isArabic = options.locale === "ar";
    const direction = isArabic ? "rtl" : "ltr";
    const align = isArabic ? "right" : "left";

    return `
        <!DOCTYPE html>
        <html lang="${isArabic ? "ar" : "en"}" dir="${direction}">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="color-scheme" content="light" />
                <meta name="supported-color-schemes" content="light" />

                <title>${BRAND.name}</title>
            </head>

            <body
                style="
                    margin:0;
                    padding:0;
                    background:${BRAND.background};
                    font-family:Arial,Helvetica,sans-serif;
                    color:#1e293b;
                "
            >
                <div
                    style="
                        display:none;
                        max-height:0;
                        overflow:hidden;
                        opacity:0;
                        color:transparent;
                    "
                >
                    ${escapeHtml(options.preheader)}
                </div>

                <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="width:100%;background:${BRAND.background}"
                >
                    <tr>
                        <td align="center" style="padding:30px 12px">
                            <table
                                role="presentation"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    max-width:650px;
                                    width:100%;
                                    background:#ffffff;
                                    border-radius:14px;
                                    overflow:hidden;
                                    border:1px solid #e8edf2;
                                "
                            >
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding:27px 20px;
                                            background:${BRAND.dark};
                                            border-bottom:4px solid ${BRAND.primary};
                                        "
                                    >
                                        <div
                                            style="
                                                color:#ffffff;
                                                font-size:25px;
                                                font-weight:800;
                                                letter-spacing:.3px;
                                            "
                                        >
                                            ${BRAND.name}
                                        </div>

                                        <div
                                            style="
                                                margin-top:6px;
                                                color:#c8d9e7;
                                                font-size:12px;
                                            "
                                        >
                                            ${isArabic
            ? "منصة تنظيم وإدارة الفعاليات والمعارض"
            : "Events & Exhibitions Management"
        }
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        align="${align}"
                                        dir="${direction}"
                                        style="padding:30px 24px 18px"
                                    >
                                        ${options.content}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding:22px 20px;
                                            background:#f8fafc;
                                            border-top:1px solid #e8edf2;
                                        "
                                    >
                                        <div
                                            style="
                                                color:#64748b;
                                                font-size:13px;
                                                font-weight:600;
                                            "
                                        >
                                            ${BRAND.name}
                                        </div>

                                        <div
                                            style="
                                                margin-top:7px;
                                                color:#94a3b8;
                                                font-size:11px;
                                                line-height:1.7;
                                            "
                                        >
                                            ${isArabic
            ? "هذه رسالة آلية، يرجى عدم الرد عليها مباشرة."
            : "This is an automated email. Please do not reply directly."
        }
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <div
                                style="
                                    max-width:600px;
                                    margin-top:15px;
                                    color:#94a3b8;
                                    font-size:11px;
                                    line-height:1.7;
                                    text-align:center;
                                "
                            >
                                © ${new Date().getFullYear()} ${BRAND.name}
                            </div>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}

export function createRegistrationEmail(
    details: RegistrationEmailDetails,
) {
    const { locale, registrationType, data } = details;

    const isArabic = locale === "ar";
    const isVisitor = registrationType === "visitor";

    const personName = getString(data.name);
    const exhibitionName = getText(details.exhibition.title, locale);

    const registrationFields = getRegistrationFields(details, locale);
    const exhibitionFields = getExhibitionFields(details, locale);

    const registrationLabel = getRegistrationTypeLabel(
        registrationType,
        locale,
    );

    const subject = isArabic
        ? isVisitor
            ? "تم تأكيد تسجيلك كزائر - Event Maker"
            : "تم تأكيد تسجيلك كعارض - Event Maker"
        : isVisitor
            ? "Your Visitor Registration Is Confirmed - Event Maker"
            : "Your Exhibitor Registration Is Confirmed - Event Maker";

    const heading = isArabic
        ? "تم تأكيد تسجيلك بنجاح"
        : "Your Registration Is Confirmed";

    const greeting = isArabic
        ? `مرحبًا ${escapeHtml(personName)}،`
        : `Hello ${escapeHtml(personName)},`;

    const introduction = isArabic
        ? "يسعدنا تأكيد تسجيلك في الفعالية. نرفق لك أدناه ملخص بيانات التسجيل وتفاصيل المعرض."
        : "We are pleased to confirm your registration. Below is a summary of your registration and exhibition details.";

    const ticketNotice = `
            <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    width:100%;
                    margin-top:20px;
                    background:#eff8ff;
                    border:1px solid #cfe8fb;
                    border-radius:10px;
                "
            >
                <tr>
                    <td
                        align="${isArabic ? "right" : "left"}"
                        style="padding:17px 18px"
                    >
                        <div
                            style="
                                color:${BRAND.dark};
                                font-size:15px;
                                font-weight:700;
                                margin-bottom:7px;
                            "
                        >
                            ${isArabic
                    ? "تذكرتك ورمز QR"
                    : "Your Ticket & QR Code"
                }
                        </div>

                        <div
                            style="
                                color:#475569;
                                font-size:13px;
                                line-height:1.8;
                            "
                        >
                            ${isArabic
                    ? "تم إرفاق رمز QR الخاص بتذكرتك مع هذه الرسالة. يرجى الاحتفاظ بالصورة وإظهارها عند الوصول إلى المعرض لتسجيل الدخول. يُسمح باستخدام التذكرة للدخول مرة واحدة فقط."
                    : "Your ticket QR code is attached to this email. Please keep the image and present it when you arrive at the exhibition. Each ticket can be used for entry once only."
                }
                        </div>
                    </td>
                </tr>
            </table>
        `;

    const content = `
        <div
            style="
                display:inline-block;
                padding:6px 12px;
                background:#eaf5fc;
                color:${BRAND.primary};
                border-radius:20px;
                font-size:12px;
                font-weight:700;
                margin-bottom:15px;
            "
        >
            ${escapeHtml(registrationLabel)}
        </div>

        <h1
            style="
                margin:0 0 12px;
                color:${BRAND.dark};
                font-size:23px;
                line-height:1.5;
            "
        >
            ${heading}
        </h1>

        <p
            style="
                margin:0 0 10px;
                color:#334155;
                font-size:15px;
                line-height:1.8;
            "
        >
            ${greeting}
        </p>

        <p
            style="
                margin:0 0 24px;
                color:#64748b;
                font-size:14px;
                line-height:1.9;
            "
        >
            ${introduction}
        </p>

        <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
                width:100%;
                margin-bottom:22px;
                background:#f8fafc;
                border:1px solid #e5eaf0;
                border-radius:10px;
            "
        >
            <tr>
                <td
                    align="${isArabic ? "right" : "left"}"
                    style="padding:14px 16px"
                >
                    <div
                        style="
                            color:#64748b;
                            font-size:12px;
                            margin-bottom:5px;
                        "
                    >
                        ${isArabic
            ? "رقم التسجيل"
            : "Registration Reference"
        }
                    </div>

                    <div
                        dir="ltr"
                        style="
                            color:${BRAND.dark};
                            font-size:15px;
                            font-weight:700;
                            word-break:break-all;
                            text-align:${isArabic ? "right" : "left"};
                        "
                    >
                        ${escapeHtml(details.registrationId)}
                    </div>
                </td>
            </tr>
        </table>

        ${createSection(
            isArabic ? "بيانات المسجل" : "Registrant Information",
            registrationFields,
            isArabic,
        )}

        ${createSection(
            isArabic ? "تفاصيل المعرض" : "Exhibition Details",
            exhibitionFields,
            isArabic,
        )}

        ${ticketNotice}

        <p
            style="
                margin:25px 0 0;
                color:#64748b;
                font-size:13px;
                line-height:1.8;
            "
        >
            ${isArabic
            ? "نتطلع إلى رؤيتك. شكرًا لاختيارك Event Maker."
            : "We look forward to seeing you. Thank you for choosing Event Maker."
        }
        </p>
    `;

    const html = createEmailLayout({
        locale,
        preheader: isArabic
            ? "تم تأكيد تسجيلك بنجاح في المعرض."
            : "Your exhibition registration has been confirmed.",
        content,
    });

    const text = [
        `${isArabic ? "مرحبًا" : "Hello"} ${personName},`,
        "",
        heading,
        introduction,
        "",
        `${isArabic ? "رقم التسجيل" : "Registration Reference"}: ${details.registrationId}`,
        `${isArabic ? "نوع التسجيل" : "Registration Type"}: ${registrationLabel}`,
        "",
        isArabic ? "بيانات المسجل:" : "Registrant Information:",
        ...registrationFields.map(([label, value]) => `${label}: ${value}`),
        "",
        isArabic ? "تفاصيل المعرض:" : "Exhibition Details:",
        ...exhibitionFields.map(([label, value]) => `${label}: ${value}`),
        "",
        isVisitor
            ? isArabic
                ? "رمز QR الخاص بتذكرتك مرفق مع الرسالة. يرجى الاحتفاظ به وإظهاره عند مدخل المعرض."
                : "Your visitor ticket QR code is attached. Please keep it and present it at the exhibition entrance."
            : isArabic
                ? "سيقوم فريقنا بمراجعة بياناتك والتواصل معك عند الحاجة."
                : "Our team will review your details and contact you if needed.",
        "",
        isArabic
            ? "شكرًا لاختيارك Event Maker."
            : "Thank you for choosing Event Maker.",
    ].join("\n");

    return {
        subject,
        html,
        text,
        exhibitionName,
    };
}

/**
 * تقرير إداري مجمع لعدة تسجيلات.
 * يستخدم لاحقًا لإرسال رسالة واحدة لكل 100 تسجيل.
 */
export function createAdminRegistrationBatchEmail(
    registrations: RegistrationEmailDetails[],
) {
    if (!registrations.length) {
        throw new Error("At least one registration is required.");
    }

    const isArabic = registrations[0].locale === "ar";
    const locale = registrations[0].locale;

    const visitorCount = registrations.filter(
        (item) => item.registrationType === "visitor",
    ).length;

    const exhibitorCount = registrations.filter(
        (item) => item.registrationType === "exhibitor",
    ).length;

    const registrationCards = registrations
        .map((details, index) => {
            const itemLocale = details.locale;
            const itemIsArabic = itemLocale === "ar";

            const fields = getRegistrationFields(details, itemLocale);
            const exhibitionFields = getExhibitionFields(
                details,
                itemLocale,
            );

            const name = getString(details.data.name);
            const type = getRegistrationTypeLabel(
                details.registrationType,
                itemLocale,
            );

            return `
                <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        width:100%;
                        margin-bottom:16px;
                        border:1px solid #e5eaf0;
                        border-radius:10px;
                        border-collapse:separate;
                        border-spacing:0;
                        overflow:hidden;
                    "
                >
                    <tr>
                        <td
                            align="${itemIsArabic ? "right" : "left"}"
                            style="
                                padding:14px 15px;
                                background:#f5f9fc;
                                border-bottom:1px solid #e5eaf0;
                            "
                        >
                            <div
                                style="
                                    color:${BRAND.dark};
                                    font-size:15px;
                                    font-weight:700;
                                "
                            >
                                ${index + 1}. ${escapeHtml(name || (itemIsArabic ? "بدون اسم" : "Unnamed"))}
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    color:#64748b;
                                    font-size:12px;
                                "
                            >
                                ${escapeHtml(type)}
                                ·
                                <span dir="ltr">${escapeHtml(details.registrationId)}</span>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 15px">
                            <table
                                role="presentation"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                            >
                                ${createInfoRows(fields, itemIsArabic)}
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 15px">
                            <div
                                style="
                                    margin-bottom:8px;
                                    color:${BRAND.dark};
                                    font-size:13px;
                                    font-weight:700;
                                "
                            >
                                ${itemIsArabic ? "المعرض" : "Exhibition"}
                            </div>

                            <table
                                role="presentation"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                            >
                                ${createInfoRows(exhibitionFields, itemIsArabic)}
                            </table>
                        </td>
                    </tr>
                </table>
            `;
        })
        .join("");

    const content = `
        <h1
            style="
                margin:0 0 10px;
                color:${BRAND.dark};
                font-size:22px;
                line-height:1.5;
            "
        >
            ${isArabic ? "تقرير التسجيلات الجديدة" : "New Registrations Report"}
        </h1>

        <p
            style="
                margin:0 0 22px;
                color:#64748b;
                font-size:14px;
                line-height:1.8;
            "
        >
            ${isArabic
            ? "فيما يلي تفاصيل مجموعة التسجيلات المؤكدة الأخيرة."
            : "Below are the details of the latest confirmed registrations."
        }
        </p>

        <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width:100%;margin-bottom:24px"
        >
            <tr>
                <td
                    width="33%"
                    align="center"
                    style="
                        padding:14px 5px;
                        background:#f0f7fc;
                        border:1px solid #e1edf6;
                    "
                >
                    <div style="font-size:22px;font-weight:700;color:${BRAND.dark}">
                        ${registrations.length}
                    </div>
                    <div style="margin-top:5px;font-size:11px;color:#64748b">
                        ${isArabic ? "إجمالي التسجيلات" : "Total"}
                    </div>
                </td>

                <td width="4"></td>

                <td
                    width="33%"
                    align="center"
                    style="
                        padding:14px 5px;
                        background:#f0fdf4;
                        border:1px solid #dcfce7;
                    "
                >
                    <div style="font-size:22px;font-weight:700;color:#166534">
                        ${visitorCount}
                    </div>
                    <div style="margin-top:5px;font-size:11px;color:#64748b">
                        ${isArabic ? "زوار" : "Visitors"}
                    </div>
                </td>

                <td width="4"></td>

                <td
                    width="33%"
                    align="center"
                    style="
                        padding:14px 5px;
                        background:#eff6ff;
                        border:1px solid #dbeafe;
                    "
                >
                    <div style="font-size:22px;font-weight:700;color:#1d4ed8">
                        ${exhibitorCount}
                    </div>
                    <div style="margin-top:5px;font-size:11px;color:#64748b">
                        ${isArabic ? "عارضون" : "Exhibitors"}
                    </div>
                </td>
            </tr>
        </table>

        <h2
            style="
                margin:0 0 15px;
                color:${BRAND.dark};
                font-size:16px;
            "
        >
            ${isArabic ? "تفاصيل التسجيلات" : "Registration Details"}
        </h2>

        ${registrationCards}
    `;

    const html = createEmailLayout({
        locale,
        preheader: isArabic
            ? `تقرير يحتوي على ${registrations.length} تسجيل جديد.`
            : `A report containing ${registrations.length} new registrations.`,
        content,
    });

    const text = registrations
        .map((details, index) => {
            const itemLocale = details.locale;
            const isItemArabic = itemLocale === "ar";

            const fields = getRegistrationFields(details, itemLocale);
            const exhibitionFields = getExhibitionFields(
                details,
                itemLocale,
            );

            return [
                `${index + 1}. ${getString(details.data.name)}`,
                `${isItemArabic ? "رقم التسجيل" : "Registration ID"}: ${details.registrationId}`,
                `${isItemArabic ? "نوع التسجيل" : "Registration Type"}: ${getRegistrationTypeLabel(details.registrationType, itemLocale)}`,
                ...fields.map(([label, value]) => `${label}: ${value}`),
                isItemArabic ? "بيانات المعرض:" : "Exhibition Details:",
                ...exhibitionFields.map(([label, value]) => `${label}: ${value}`),
            ].join("\n");
        })
        .join("\n\n------------------------------\n\n");

    return {
        subject: isArabic
            ? `تقرير تسجيلات Event Maker (${registrations.length} تسجيل)`
            : `Event Maker Registrations Report (${registrations.length})`,
        html,
        text: [
            isArabic ? "تقرير التسجيلات الجديدة" : "New Registrations Report",
            `${isArabic ? "الإجمالي" : "Total"}: ${registrations.length}`,
            `${isArabic ? "زوار" : "Visitors"}: ${visitorCount}`,
            `${isArabic ? "عارضون" : "Exhibitors"}: ${exhibitorCount}`,
            "",
            text,
        ].join("\n"),
    };
}

/**
 * للتوافق مع الكود الحالي لحين تعديل verify route.
 * سيُستبدل استخدامه لاحقًا بتقرير الدفعات.
 */
export function createAdminRegistrationEmail(
    details: RegistrationEmailDetails,
) {
    const email = createAdminRegistrationBatchEmail([details]);

    return {
        subject: email.subject,
        html: email.html,
        text: email.text,
    };
}