import Link from "next/link";
import {
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";

interface CTASectionProps {
    locale: Locale;
}

export default function CTASection({
    locale,
}: CTASectionProps) {
    const isArabic = locale === "ar";

    return (
        <section
            className="relative overflow-hidden bg-slate-950"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Decorative elements */}
            <div
                className="pointer-events-none absolute -top-32 inset-s-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                style={{
                    backgroundColor:
                        "var(--theme-primary)",
                }}
            />
            <div
                className="pointer-events-none absolute -button-1 inset-e-3/4 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                style={{
                    backgroundColor:
                        "var(--theme-primary)",
                }}
            />

            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Eyebrow */}
                    <div className="mb-5 flex items-center justify-center gap-3">
                        <span
                            className="h-px w-10"
                            style={{
                                backgroundColor:
                                    "var(--theme-primary)",
                            }}
                        />

                        <span
                            className="mb-4 block text-xl font-bold"
                            style={{
                                color:
                                    "var(--theme-primary)",
                            }}
                        >
                            {isArabic
                                ? "لنصنع شيئًا استثنائيًا"
                                : "Let's Create Something Exceptional"}
                        </span>

                        <span
                            className="h-px w-10"
                            style={{
                                backgroundColor:
                                    "var(--theme-primary)",
                            }}
                        />
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                        {isArabic
                            ? "هل أنتم مستعدون لصناعة حدث يُذكر؟"
                            : "Ready to Create an Event Worth Remembering?"}
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                        {isArabic
                            ? "من الفكرة الأولى إلى التنفيذ الكامل، نساعدكم على بناء تجربة استثنائية تترك أثرًا حقيقيًا لدى جمهوركم."
                            : "From the first idea to full execution, we help you build an exceptional experience that leaves a lasting impression on your audience."}
                    </p>

                    {/* Actions */}
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href={
                                isArabic
                                    ? "/contact"
                                    : "/en/contact"
                            }
                            className="group inline-flex min-w-48 items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(232,184,92,0.25)]"
                            style={{
                                backgroundColor:
                                    "var(--theme-primary)",
                            }}
                        >
                            <FiCalendar className="text-base" />

                            <span>
                                {isArabic
                                    ? "ابدأ معرضك معنا"
                                    : "Start Your Exhibition"}
                            </span>

                            {isArabic ? (
                                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                            ) : (
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            )}
                        </Link>

                        <Link
                            href={
                                isArabic
                                    ? "/contact"
                                    : "/en/contact"
                            }
                            className="inline-flex min-w-40 items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/5"
                        >
                            {isArabic
                                ? "تواصل معنا"
                                : "Contact Us"}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}