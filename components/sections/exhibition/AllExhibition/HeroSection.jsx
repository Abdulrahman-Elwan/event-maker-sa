import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/animations/Reveal";

export default function HeroSection({
    locale,
    hero,
}) {
    const isArabic = locale === "ar";

    const title = hero?.title?.[locale] || "";
    const description = hero?.description?.[locale] || "";
    const image = hero?.image?.url || "";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative isolate flex min-h-[460px] items-center overflow-hidden bg-(--theme-secondary) sm:min-h-[400px] lg:min-h-[450px]"
        >
            {image && (
                <Image
                    src={image}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className={`absolute inset-0 -z-20 object-cover ${isArabic ? "-scale-x-100" : "scale-x-100"}`}
                />
            )}

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />

            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-(--theme-secondary) via-transparent to-black/25" />

            <div className="pointer-events-none absolute -start-32 top-1/4 -z-10 h-80 w-80 rounded-full bg-(--theme-primary)/15 blur-[120px]" />

            <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-7 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
                <div className="max-w-3xl">
                    <Reveal delay={220} distance={30}>
                        <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
                            {title}
                        </h1>
                    </Reveal>

                    {description && (
                        <Reveal delay={360} distance={25}>
                            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/80 sm:text-base sm:leading-9">
                                {description}
                            </p>
                        </Reveal>
                    )}

                    <Reveal delay={500} distance={20}>
                        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                            <Link
                                href="#exhibitions-list"
                                className="group inline-flex items-center justify-center gap-3 rounded-full bg-(--theme-primary) px-6 py-3.5 text-sm font-bold text-(--theme-secondary) shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <span>
                                    {isArabic
                                        ? "استكشف المعارض"
                                        : "Explore Exhibitions"}
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    {isArabic ? "←" : "→"}
                                </span>
                            </Link>

                            <Link
                                href={
                                    isArabic
                                        ? "/contact"
                                        : "/en/contact"
                                }
                                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                            >
                                {isArabic
                                    ? "تواصل معنا"
                                    : "Contact Us"}
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}