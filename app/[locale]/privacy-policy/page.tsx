
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params, }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isArabic = locale === "ar";

    return {
        title: isArabic
            ? "سياسة الخصوصية"
            : "Privacy Policy",
        description: isArabic
            ? "تعرف على سياسة الخصوصية الخاصة بموقع Event Maker وكيفية جمع بياناتك الشخصية واستخدامها وحمايتها."
            : "Learn how Event Maker collects, uses, and protects your personal information and privacy.",
        alternates: {
            canonical: absoluteUrl(
                isArabic
                    ? "/privacy-policy/"
                    : "/en/privacy-policy/"
            ),
        },
    };
}

export default async function PrivacyPolicyPage({
    params,
}: PageProps) {
    const { locale } = await params;
    const isArabic = locale === "ar";

    const sections = isArabic
        ? [
            {
                title: "2. ما المعلومات التي نجمعها؟",
                paragraphs: [
                    <>
                        <strong>المعلومات التي تقدمها طوعاً:</strong> بيانات التسجيل مثل الاسم، ورقم الجوال، والبريد الإلكتروني، واسم الشركة أو الوظيفة، بالإضافة إلى طلبات التواصل والاستفسارات.
                    </>,
                    <>
                        <strong>المعلومات التي نجمعها تلقائياً:</strong> بيانات الاستخدام مثل الصفحات التي تزورها، ومدة الزيارة، وعنوان IP، وبيانات ملفات تعريف الارتباط (Cookies) المستخدمة لتحسين تجربة المستخدم وتحليل الأداء.
                    </>,
                    <>
                        <strong>المعلومات من أطراف ثالثة:</strong> قد نحصل على بيانات تسويقية من منصات التواصل الاجتماعي وفقاً لإعدادات الخصوصية والأذونات الخاصة بك.
                    </>,
                ],
            },
            {
                title: "3. كيفية استخدامنا للمعلومات",
                paragraphs: [
                    "نستخدم معلوماتك للأغراض التالية:",
                ],
                list: [
                    "تقديم الخدمات: تسجيلك في المعرض، وإصدار بطاقات الدخول، وإرسال التحديثات المتعلقة بالفعاليات.",
                    "التواصل: الرد على استفساراتك وإرسال الإشعارات ذات الصلة بالفعاليات.",
                    "التسويق: إرسال العروض والباقات والخدمات الجديدة، ويمكنك إلغاء الاشتراك في الرسائل التسويقية في أي وقت.",
                    "التحليل والتحسين: فهم سلوك الزوار لتحسين محتوى الموقع وتجربة المستخدم.",
                    "الامتثال القانوني: الالتزام باللوائح المحلية والعقود المبرمة مع الشركاء والرعاة.",
                ],
            },
            {
                title: "4. مشاركة المعلومات",
                paragraphs: [
                    "لا نقوم ببيع معلوماتك الشخصية لأطراف ثالثة. ومع ذلك، قد نشارك بعض المعلومات عند الضرورة مع الجهات التالية:",
                ],
                list: [
                    "الشركاء التقنيون: مزودو خدمات الاستضافة والتحليلات والخدمات التقنية، مع مراعاة متطلبات السرية والأمان.",
                    "الرعاة والشركاء الرسميون: عند الحاجة لتنسيق الفعاليات أو تقديم خدمات الرعاية المتفق عليها.",
                    "السلطات الرسمية: عندما يكون الإفصاح مطلوباً بموجب القانون أو لحماية حقوقنا.",
                ],
            },
            {
                title: "5. ملفات تعريف الارتباط (Cookies)",
                paragraphs: [
                    "نستخدم ملفات تعريف الارتباط لتحسين أداء الموقع وضمان عمل بعض الميزات. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع وتجربة الاستخدام.",
                ],
            },
            {
                title: "6. حماية بياناتك",
                paragraphs: [
                    "نتخذ تدابير تقنية وتنظيمية مناسبة للمساعدة في حماية معلوماتك الشخصية والحفاظ على سريتها وسلامتها، ومن هذه التدابير:",
                ],
                list: [
                    "تشفير البيانات أثناء نقلها باستخدام بروتوكولات SSL/TLS.",
                    "تطبيق ضوابط وصول مناسبة على الموظفين والشركاء المصرح لهم.",
                    "إجراء نسخ احتياطية دورية واتخاذ تدابير مناسبة لحماية البيانات.",
                ],
            },
            {
                title: "7. حقوقك وطرق ممارستها",
                paragraphs: [
                    <>
                        <strong>الوصول والتصحيح:</strong> يمكنك طلب نسخة من بياناتك الشخصية وطلب تصحيحها أو تحديثها.
                    </>,
                    <>
                        <strong>الحذف:</strong> يمكنك طلب حذف بياناتك الشخصية، ما لم يكن لدينا التزام قانوني بالاحتفاظ بها.
                    </>,
                    <>
                        <strong>الاعتراض على المعالجة:</strong> يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق.
                    </>,
                    <>
                        <strong>سحب الموافقة:</strong> إذا كانت المعالجة تعتمد على موافقتك، يمكنك سحبها دون التأثير على مشروعية المعالجة التي تمت قبل السحب.
                    </>,
                    "لممارسة حقوقك، يمكنك التواصل معنا عبر وسائل الاتصال الموضحة أدناه. وسنعمل على الرد على طلبك خلال 30 يوماً.",
                ],
            },
            {
                title: "8. تحديث سياسة الخصوصية",
                paragraphs: [
                    "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. وسيتم نشر النسخة المحدثة على هذه الصفحة، ويُعمل بها اعتباراً من تاريخ نشرها. ننصحك بمراجعة هذه الصفحة بشكل دوري للاطلاع على أي تغييرات.",
                ],
            },
            {
                title: "9. تواصل معنا",
                paragraphs: [
                    "إذا كان لديك أي استفسار أو طلب يتعلق بسياسة الخصوصية أو بياناتك الشخصية، يمكنك التواصل معنا من خلال المعلومات التالية:",
                ],
            },
        ]
        : [
            {
                title: "2. What Information Do We Collect?",
                paragraphs: [
                    <>
                        <strong>Information you voluntarily provide:</strong> Registration details such as your name, mobile number, email address, company name or job title, as well as contact requests and inquiries.
                    </>,
                    <>
                        <strong>Information collected automatically:</strong> Usage data such as pages visited, visit duration, IP address, and cookies used to improve user experience and analyze website performance.
                    </>,
                    <>
                        <strong>Information from third parties:</strong> We may receive marketing-related information from social media platforms, subject to your privacy settings and permissions.
                    </>,
                ],
            },
            {
                title: "3. How We Use Your Information",
                paragraphs: [
                    "We use your information for the following purposes:",
                ],
                list: [
                    "Service delivery: Registering you for exhibitions, issuing entry passes, and sending event updates.",
                    "Communication: Responding to your inquiries and sending notifications related to events.",
                    "Marketing: Sending offers, packages, and new service updates. You may unsubscribe from marketing communications at any time.",
                    "Analytics and improvement: Understanding visitor behavior to improve website content and user experience.",
                    "Legal compliance: Complying with applicable local regulations and agreements with partners and sponsors.",
                ],
            },
            {
                title: "4. Sharing Your Information",
                paragraphs: [
                    "We do not sell your personal information to third parties. However, we may share certain information when necessary with:",
                ],
                list: [
                    "Technology partners: Hosting, analytics, and technical service providers, subject to appropriate confidentiality and security requirements.",
                    "Sponsors and official partners: Where necessary to coordinate events or provide agreed sponsorship services.",
                    "Government authorities: Where disclosure is legally required or necessary to protect our rights.",
                ],
            },
            {
                title: "5. Cookies",
                paragraphs: [
                    "We use cookies to improve website performance and ensure certain features work properly. You can disable cookies through your browser settings, but doing so may affect some website functions and your browsing experience.",
                ],
            },
            {
                title: "6. Protecting Your Information",
                paragraphs: [
                    "We take appropriate technical and organizational measures to help protect your personal information and maintain its confidentiality and integrity. These measures include:",
                ],
                list: [
                    "Encrypting data in transit using SSL/TLS protocols.",
                    "Applying appropriate access controls for authorized employees and partners.",
                    "Performing regular backups and taking suitable measures to protect data.",
                ],
            },
            {
                title: "7. Your Rights and How to Exercise Them",
                paragraphs: [
                    <>
                        <strong>Access and correction:</strong> You may request a copy of your personal information and ask us to correct or update it.
                    </>,
                    <>
                        <strong>Deletion:</strong> You may request the deletion of your personal information unless we are legally required to retain it.
                    </>,
                    <>
                        <strong>Objection to processing:</strong> You may object to the processing of your information for marketing purposes.
                    </>,
                    <>
                        <strong>Withdrawal of consent:</strong> Where processing is based on your consent, you may withdraw it without affecting the lawfulness of processing carried out before withdrawal.
                    </>,
                    "To exercise your rights, contact us using the details below. We will endeavor to respond to your request within 30 days.",
                ],
            },
            {
                title: "8. Updates to This Privacy Policy",
                paragraphs: [
                    "We may update this Privacy Policy from time to time. Any updated version will be published on this page and will take effect upon publication. We encourage you to review this page periodically for changes.",
                ],
            },
            {
                title: "9. Contact Us",
                paragraphs: [
                    "If you have any questions or requests regarding this Privacy Policy or your personal information, you can contact us using the details below:",
                ],
            },
        ];

    const content = {
        title: isArabic
            ? "سياسة الخصوصية"
            : "Privacy Policy",

        subtitle: isArabic
            ? "نحرص على حماية خصوصيتك وبياناتك أثناء استخدام موقعنا وخدماتنا."
            : "We are committed to protecting your privacy and personal information when you use our website and services.",

        intro: isArabic
            ? "نحن شركة إيفنت ميكر نحرص على حماية خصوصيتك عند استخدامك موقعنا الإلكتروني"
            : "We, Event Maker, are committed to protecting your privacy when you use our website",

        introEnd: isArabic
            ? "وخدمات معرض فرص الامتياز التجاري الدولي، الذي يُعَد من أبرز معارض الامتياز الدولية في المملكة العربية السعودية. توضح هذه السياسة كيفية جمع معلوماتك الشخصية، ولماذا وكيف نستخدمها، وما هي حقوقك وكيفية ممارستها."
            : "and the services of the International Franchise Opportunities Exhibition, one of the prominent international franchise exhibitions in the Kingdom of Saudi Arabia. This policy explains how we collect your personal information, why and how we use it, and what rights you have and how to exercise them.",

        contactTitle: isArabic
            ? "معلومات التواصل"
            : "Contact Information",

        email: isArabic ? "البريد الإلكتروني" : "Email",
        phone: isArabic ? "الهاتف" : "Phone",
        address: isArabic ? "العنوان" : "Address",
        addressValue: isArabic
            ? "مركز جدة للمعارض والمؤتمرات"
            : "Jeddah Center for Exhibitions and Events",

        closing: isArabic
            ? "باستخدامك موقعنا وخدماتنا، فإنك توافق على جمع واستخدام بياناتك وفقاً لأحكام هذه السياسة."
            : "By using our website and services, you agree to the collection and use of your information in accordance with this Privacy Policy.",
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
                    <p className="text-sm leading-8 text-slate-600 sm:text-base">
                        {content.intro}{" "}
                        <a
                            href={absoluteUrl("/")}
                            className="font-medium text-amber-600 transition-colors hover:text-amber-700"
                        >
                            {absoluteUrl("/")}
                        </a>{" "}
                        {content.introEnd}
                    </p>

                    <div className="mt-10 space-y-10">
                        {sections.map((section) => (
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

                                    {section.list && (
                                        <ul className="list-disc space-y-2 ps-6 marker:text-amber-500">
                                            {section.list.map((item, index) => (
                                                <li key={index}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
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
