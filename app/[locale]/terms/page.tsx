
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isArabic = locale === "ar";

    return {
        title: isArabic
            ? "الشروط والأحكام"
            : "Terms & Conditions",
        description: isArabic
            ? "تعرف على شروط وأحكام استخدام موقع Event Maker والخدمات المقدمة من خلاله."
            : "Read the terms and conditions governing your use of the Event Maker website and its services.",
        alternates: {
            canonical: isArabic
                ? "/terms"
                : "/en/terms",
        },
    };
}

export default async function TermsPage({
    params,
}: PageProps) {
    const { locale } = await params;
    const isArabic = locale === "ar";

    const content = {
        title: isArabic
            ? "الشروط والأحكام"
            : "Terms & Conditions",

        subtitle: isArabic
            ? "يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا وخدماتنا."
            : "Please read these terms carefully before using our website and services.",

        intro: isArabic
            ? "تحكم هذه الشروط والأحكام استخدامك لموقع Event Maker والخدمات المقدمة من خلاله. باستخدامك الموقع، فإنك توافق على الالتزام بهذه الشروط."
            : "These terms and conditions govern your use of the Event Maker website and the services provided through it. By using this website, you agree to comply with these terms.",

        sections: isArabic
            ? [
                {
                    title: "1. التعريفات",
                    paragraphs: [
                        <>
                            <strong>الموقع:</strong> الموقع الإلكتروني المعنون بـ{" "}
                            <a href="https://event-maker-sa.com/" target="_blank" rel="noopener noreferrer">
                                https://event-maker-sa.com/
                            </a>.
                        </>,
                        <>
                            <strong>المستخدم:</strong> أي شخص يزور أو يتصفح أو يستخدم الموقع وخدماته.
                        </>,
                        <>
                            <strong>المحتوى:</strong> جميع النصوص والصور والفيديوهات والبيانات والمواد المنشورة على الموقع.
                        </>,
                        <>
                            <strong>الخدمات:</strong> التسجيل في المعارض، وحجز التذاكر، والاشتراك في ورش العمل، ووسائل التواصل المتاحة على الموقع.
                        </>,
                    ],
                },
                {
                    title: "2. قبول الشروط",
                    paragraphs: [
                        "باستخدامك الموقع وخدماته، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أيٍ منها، يُرجى عدم استخدام الموقع أو التسجيل في أي خدمة.",
                    ],
                },
                {
                    title: "3. نطاق الاستخدام المسموح",
                    paragraphs: [
                        <>
                            <strong>الاستخدام الشخصي وغير التجاري:</strong> يحق للمستخدم تصفح الموقع والاطلاع على المحتوى لأغراض شخصية أو مهنية بحتة، دون إعادة بيع أو توزيع أو تعديل المحتوى لأي غرض تجاري.
                        </>,
                        <>
                            <strong>الالتزام بالقوانين:</strong> يلتزم المستخدم بعدم نشر أو رفع أي محتوى ينتهك حقوق الغير أو القوانين المعمول بها.
                        </>,
                        <>
                            <strong>حظر السلوك الضار:</strong> يُمنع استخدام الموقع في الإضرار بأنظمتنا التقنية، مثل الاختراق أو نشر البرمجيات الضارة، أو مضايقة المستخدمين الآخرين.
                        </>,
                    ],
                },
                {
                    title: "4. حساب المستخدم",
                    paragraphs: [
                        <>
                            <strong>التسجيل:</strong> بعض الخدمات قد تتطلب إنشاء حساب، ويجب أن تكون بياناتك صحيحة وحديثة.
                        </>,
                        <>
                            <strong>الأمن:</strong> أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك.
                        </>,
                        <>
                            <strong>الإلغاء:</strong> يحق للمنظم تعليق حساب المستخدم أو حذفه عند مخالفة هذه الشروط.
                        </>,
                    ],
                },
                {
                    title: "5. حقوق الملكية الفكرية",
                    paragraphs: [
                        "جميع الحقوق المتعلقة بالمحتوى، بما في ذلك النصوص والصور والشعارات والعلامات التجارية، مملوكة لشركة إيفنت ميكر أو الجهات المرخصة لها. لا يحق للمستخدم نسخ أو إعادة إنتاج أو نشر أي جزء من المحتوى دون الحصول على إذن كتابي مسبق.",
                    ],
                },
                {
                    title: "6. إخلاء المسؤولية",
                    paragraphs: [
                        "يُقدم الموقع كما هو، دون أي ضمانات صريحة أو ضمنية. ولا يتحمل المنظم المسؤولية عن الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام الموقع أو الاعتماد على المعلومات الواردة فيه.",
                    ],
                },
                {
                    title: "7. الروابط الخارجية",
                    paragraphs: [
                        "قد يحتوي الموقع على روابط لمواقع أخرى. تُقدم هذه الروابط للتيسير فقط، ولا يعني وجودها تبنّي المنظم لمحتويات تلك المواقع. ويكون استخدامك لأي موقع خارجي على مسؤوليتك الخاصة.",
                    ],
                },
                {
                    title: "8. التعديلات على الشروط",
                    paragraphs: [
                        "يحتفظ المنظم بالحق في تعديل هذه الشروط في أي وقت. يتم نشر النسخة المحدثة على الموقع وتصبح نافذة فور نشرها. ويُنصح بمراجعة الشروط بانتظام.",
                    ],
                },
                {
                    title: "9. القانون الواجب التطبيق والاختصاص",
                    paragraphs: [
                        "تخضع هذه الشروط وتُفسر وفقاً لأنظمة المملكة العربية السعودية. وأي نزاع ينشأ عنها يكون من اختصاص المحاكم المختصة في المملكة.",
                    ],
                },
            ]
            : [
                {
                    title: "1. Definitions",
                    paragraphs: [
                        <>
                            <strong>Website:</strong> The website available at{" "}
                            <a href="https://event-maker-sa.com/" target="_blank" rel="noopener noreferrer">
                                https://event-maker-sa.com/
                            </a>.
                        </>,
                        <>
                            <strong>User:</strong> Any person who visits, browses, or uses the website and its services.
                        </>,
                        <>
                            <strong>Content:</strong> All text, images, videos, data, and materials published on the website.
                        </>,
                        <>
                            <strong>Services:</strong> Exhibition registration, ticket booking, workshop participation, and communication services available through the website.
                        </>,
                    ],
                },
                {
                    title: "2. Acceptance of Terms",
                    paragraphs: [
                        "By using this website and its services, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use the website or register for any service.",
                    ],
                },
                {
                    title: "3. Permitted Use",
                    paragraphs: [
                        <>
                            <strong>Personal and non-commercial use:</strong> Users may browse the website and view its content for personal or professional purposes, but may not resell, distribute, or modify the content for commercial purposes.
                        </>,
                        <>
                            <strong>Compliance with laws:</strong> Users must not publish or upload any content that violates the rights of others or applicable laws.
                        </>,
                        <>
                            <strong>Prohibited conduct:</strong> Users must not damage our technical systems through hacking, malware distribution, or any activity that harasses other users.
                        </>,
                    ],
                },
                {
                    title: "4. User Accounts",
                    paragraphs: [
                        <>
                            <strong>Registration:</strong> Certain services may require an account. You must provide accurate and up-to-date information.
                        </>,
                        <>
                            <strong>Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.
                        </>,
                        <>
                            <strong>Termination:</strong> The organizer reserves the right to suspend or delete user accounts that violate these terms.
                        </>,
                    ],
                },
                {
                    title: "5. Intellectual Property Rights",
                    paragraphs: [
                        "All rights relating to the website content, including text, images, logos, and trademarks, belong to Event Maker or its licensors. Users may not copy, reproduce, or publish any part of the content without prior written permission.",
                    ],
                },
                {
                    title: "6. Disclaimer",
                    paragraphs: [
                        "The website is provided on an as-is basis without express or implied warranties. The organizer shall not be liable for direct or indirect damages resulting from the use of the website or reliance on the information provided through it.",
                    ],
                },
                {
                    title: "7. External Links",
                    paragraphs: [
                        "The website may contain links to external websites for convenience. These links do not imply endorsement of their content by the organizer. Accessing and using external websites is at your own risk.",
                    ],
                },
                {
                    title: "8. Changes to These Terms",
                    paragraphs: [
                        "The organizer reserves the right to modify these terms at any time. Updated terms will be published on the website and become effective upon publication. Users are encouraged to review these terms regularly.",
                    ],
                },
                {
                    title: "9. Governing Law and Jurisdiction",
                    paragraphs: [
                        "These terms shall be governed by and interpreted in accordance with the laws and regulations of the Kingdom of Saudi Arabia. Any dispute arising from these terms shall fall under the jurisdiction of the competent courts in the Kingdom.",
                    ],
                },
            ],

        closing: isArabic
            ? "باستخدامك الموقع وخدماتنا، فإنك تقر بقراءتك وفهمك والتزامك بهذه الشروط."
            : "By using our website and services, you acknowledge that you have read, understood, and agreed to these terms.",

        contactTitle: isArabic
            ? "لديك استفسار؟ تواصل معنا"
            : "Have a question? Contact us",

        email: isArabic ? "البريد الإلكتروني" : "Email",
        phone: isArabic ? "الهاتف" : "Phone",
        address: isArabic ? "العنوان" : "Address",
        addressValue: isArabic
            ? "مركز جدة للمعارض والمؤتمرات"
            : "Jeddah Center for Exhibitions and Events",
    };

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-slate-50"
        >
            {/* Hero */}
            <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-20 text-center sm:py-24 lg:py-28">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative mx-auto max-w-3xl">
                    <span className="mb-5 inline-block text-xs font-bold tracking-[0.2em] text-amber-400">
                        EVENT MAKER
                    </span>

                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                        {content.title}
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                        {content.subtitle}
                    </p>

                    <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-amber-400" />
                </div>
            </header>

            {/* Content */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
                    <p className="mb-10 text-sm leading-8 text-slate-600 sm:text-base">
                        {content.intro}
                    </p>

                    <div className="space-y-10">
                        {content.sections.map((section) => (
                            <section key={section.title}>
                                <h2
                                    className="border-r-4 border-amber-400 pr-4 text-lg font-bold text-slate-900 sm:text-xl"
                                    style={{
                                        borderColor: "var(--theme-primary, #fbbf24)",
                                    }}
                                >
                                    {section.title}
                                </h2>

                                <div className="mt-4 space-y-3 text-sm leading-8 text-slate-600 sm:text-base">
                                    {section.paragraphs.map((paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <p className="mt-12 border-t border-slate-100 pt-8 text-sm font-medium leading-8 text-slate-700 sm:text-base">
                        {content.closing}
                    </p>

                    {/* Contact */}
                    <div className="mt-10 rounded-xl border-r-4 border-amber-400 bg-slate-50 p-6 sm:p-8">
                        <h2 className="mb-5 text-lg font-bold text-slate-900">
                            {content.contactTitle}
                        </h2>

                        <div className="space-y-4 text-sm text-slate-600">
                            <p>
                                <strong className="text-slate-900">
                                    {content.email}:
                                </strong>{" "}
                                <a
                                    href="mailto:info@event-maker-sa.com"
                                    className="font-medium text-amber-600 transition-colors hover:text-amber-700"
                                >
                                    info@event-maker-sa.com
                                </a>
                            </p>

                            <p>
                                <strong className="text-slate-900">
                                    {content.phone}:
                                </strong>{" "}
                                <a
                                    href="tel:+966565414847"
                                    dir="ltr"
                                    className="inline-block font-medium text-slate-700"
                                >
                                    +966 56 541 4847
                                </a>
                            </p>

                            <p>
                                <strong className="text-slate-900">
                                    {content.address}:
                                </strong>{" "}
                                {content.addressValue}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
