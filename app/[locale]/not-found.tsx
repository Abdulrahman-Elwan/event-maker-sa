
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsArrowLeft, BsArrowRight, BsHouse } from "react-icons/bs";
import { LuSearchX } from "react-icons/lu";

export default function NotFound() {
    const pathname = usePathname();

    const isEnglish =
        pathname === "/en" ||
        pathname.startsWith("/en/");

    const homeHref = isEnglish ? "/en/" : "/";
    const contactHref = isEnglish ? "/en/contact/" : "/contact/";

    return (
        <main
            dir={isEnglish ? "ltr" : "rtl"}
            className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-[var(--theme-secondary)] px-5 py-20 text-white"
        >
            {/* Background Decorations */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--theme-primary) 13%, transparent), transparent 55%)",
                }}
            />

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                    backgroundSize: "55px 55px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-2xl text-center">

                {/* Icon */}
                <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--theme-primary)] shadow-xl">
                    <LuSearchX size={30} strokeWidth={1.5} />
                </div>

                {/* 404 */}
                <div
                    dir="ltr"
                    className="select-none text-[clamp(7rem,22vw,13rem)] font-black leading-none tracking-tighter"
                    style={{
                        color: "var(--theme-primary)",
                        textShadow:
                            "0 12px 50px color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                    }}
                >
                    404
                </div>

                <span className="mt-5 inline-block text-xs font-bold tracking-[0.3em] text-[var(--theme-primary)]">
                    {isEnglish ? "PAGE NOT FOUND" : "الصفحة غير موجودة"}
                </span>

                <h1 className="mt-4 text-2xl font-extrabold leading-relaxed sm:text-3xl">
                    {isEnglish
                        ? "Oops! We couldn't find this page"
                        : "عذرًا! لم نتمكن من العثور على هذه الصفحة"}
                </h1>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-white/55 sm:text-base">
                    {isEnglish
                        ? "The page you are looking for may have been moved, deleted, or the link may be incorrect."
                        : "يبدو أن الصفحة التي تبحث عنها غير متاحة، ربما تم نقلها أو حذفها أو أن الرابط الذي استخدمته غير صحيح."}
                </p>

                {/* Actions */}
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">

                    <Link
                        href={homeHref}
                        className="inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:brightness-110 hover:shadow-lg"
                        style={{
                            backgroundColor: "var(--theme-primary)",
                        }}
                    >
                        <BsHouse size={17} />
                        {isEnglish ? "Back to Home" : "العودة للرئيسية"}
                    </Link>

                    <Link
                        href={contactHref}
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
                    >
                        {isEnglish ? "Contact Us" : "تواصل معنا"}

                        {isEnglish ? (
                            <BsArrowRight size={17} />
                        ) : (
                            <BsArrowLeft size={17} />
                        )}
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="mt-14 text-[11px] tracking-wide text-white/30">
                    EVENT MAKER
                    <span className="mx-2">•</span>
                    {isEnglish
                        ? "Creating Experiences That Matter"
                        : "نصنع تجارب تترك أثرًا"}
                </p>
            </div>
        </main>
    );
}