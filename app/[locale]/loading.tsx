
"use client";

import { usePathname } from "next/navigation";

export default function Loading() {
    const pathname = usePathname();

    const isEnglish =
        pathname === "/en" ||
        pathname.startsWith("/en/");

    return (
        <main
            dir={isEnglish ? "ltr" : "rtl"}
            aria-label={isEnglish ? "Loading page" : "جاري تحميل الصفحة"}
            aria-busy="true"
            className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-[var(--theme-secondary)] px-5"
        >
            {/* Background Glow */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse at center, color-mix(in srgb, var(--theme-primary) 10%, transparent), transparent 60%)",
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Animated Loader */}
                <div className="relative flex h-24 w-24 items-center justify-center">

                    <div
                        className="absolute inset-0 rounded-full border border-white/10"
                    />

                    <div
                        className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent"
                        style={{
                            borderTopColor: "var(--theme-primary)",
                            borderRightColor:
                                "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
                        }}
                    />

                    <div
                        className="absolute inset-3 animate-spin rounded-full border-2 border-transparent"
                        style={{
                            animationDirection: "reverse",
                            animationDuration: "1.8s",
                            borderBottomColor:
                                "color-mix(in srgb, var(--theme-primary) 60%, transparent)",
                        }}
                    />

                    <span
                        className="h-3 w-3 animate-pulse rounded-full"
                        style={{
                            backgroundColor: "var(--theme-primary)",
                        }}
                    />
                </div>

                {/* Brand */}
                <p className="mt-8 text-lg font-extrabold tracking-[0.18em] text-white">
                    EVENT
                    <span style={{ color: "var(--theme-primary)" }}>
                        {" "}MAKER
                    </span>
                </p>

                <p className="mt-3 text-sm text-white/55">
                    {isEnglish
                        ? "Preparing your experience..."
                        : "نجهّز لك تجربة مميزة..."}
                </p>

                {/* Loading Progress Decoration */}
                <div className="mt-7 h-1 w-36 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full w-1/2 animate-pulse rounded-full"
                        style={{
                            backgroundColor: "var(--theme-primary)",
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
