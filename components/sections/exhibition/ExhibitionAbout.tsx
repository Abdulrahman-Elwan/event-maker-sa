
import type { IconType } from "react-icons";

import type { Locale } from "@/lib/i18n/config";
import type { Exhibition } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";

interface ExhibitionAboutProps {
    locale: Locale;
    exhibition: Exhibition;
}

type IconModule = Record<string, IconType>;

async function resolveIcon(iconName?: string): Promise<IconType | null> {
    if (!iconName?.trim()) return null;

    try {
        let icons: IconModule;

        if (iconName.startsWith("Fa6")) {
            icons = await import("react-icons/fa6") as unknown as IconModule;
        } else if (iconName.startsWith("Fa")) {
            icons = await import("react-icons/fa") as unknown as IconModule;
        } else if (iconName.startsWith("Hi2")) {
            icons = await import("react-icons/hi2") as unknown as IconModule;
        } else if (iconName.startsWith("Hi")) {
            icons = await import("react-icons/hi") as unknown as IconModule;
        } else if (iconName.startsWith("Io5")) {
            icons = await import("react-icons/io5") as unknown as IconModule;
        } else if (iconName.startsWith("Io")) {
            icons = await import("react-icons/io") as unknown as IconModule;
        } else {
            const libraries: Record<string, () => Promise<IconModule>> = {
                Ai: async () => await import("react-icons/ai") as unknown as IconModule,
                Bi: async () => await import("react-icons/bi") as unknown as IconModule,
                Bs: async () => await import("react-icons/bs") as unknown as IconModule,
                Cg: async () => await import("react-icons/cg") as unknown as IconModule,
                Ci: async () => await import("react-icons/ci") as unknown as IconModule,
                Di: async () => await import("react-icons/di") as unknown as IconModule,
                Fc: async () => await import("react-icons/fc") as unknown as IconModule,
                Fi: async () => await import("react-icons/fi") as unknown as IconModule,
                Gi: async () => await import("react-icons/gi") as unknown as IconModule,
                Go: async () => await import("react-icons/go") as unknown as IconModule,
                Gr: async () => await import("react-icons/gr") as unknown as IconModule,
                Im: async () => await import("react-icons/im") as unknown as IconModule,
                Lia: async () => await import("react-icons/lia") as unknown as IconModule,
                Lu: async () => await import("react-icons/lu") as unknown as IconModule,
                Md: async () => await import("react-icons/md") as unknown as IconModule,
                Pi: async () => await import("react-icons/pi") as unknown as IconModule,
                Ri: async () => await import("react-icons/ri") as unknown as IconModule,
                Rx: async () => await import("react-icons/rx") as unknown as IconModule,
                Si: async () => await import("react-icons/si") as unknown as IconModule,
                Sl: async () => await import("react-icons/sl") as unknown as IconModule,
                Tb: async () => await import("react-icons/tb") as unknown as IconModule,
                Tfi: async () => await import("react-icons/tfi") as unknown as IconModule,
                Ti: async () => await import("react-icons/ti") as unknown as IconModule,
                Vsc: async () => await import("react-icons/vsc") as unknown as IconModule,
                Wi: async () => await import("react-icons/wi") as unknown as IconModule,
            };

            const prefix = Object.keys(libraries)
                .sort((a, b) => b.length - a.length)
                .find((key) => iconName.startsWith(key));

            if (!prefix) return null;

            icons = await libraries[prefix]();
        }

        return icons[iconName] ?? null;
    } catch {
        return null;
    }
}

export default async function ExhibitionAbout({
    locale,
    exhibition,
}: ExhibitionAboutProps) {
    const isArabic = locale === "ar";

    // Validate About Section

    const cards = exhibition.about_section?.cards ?? [];

    const validCards = cards.filter((card) => {
        const title = isArabic ? card.title?.ar : card.title?.en;
        const description = isArabic ? card.description?.ar : card.description?.en;

        return Boolean(title?.trim() && description?.trim());
    });

    if (!validCards.length) return null;

    // Resolve Dynamic Icons

    const cardsWithIcons = await Promise.all(
        validCards.map(async (card) => ({
            ...card,
            resolvedIcon: await resolveIcon(card.icon),
        }))
    );

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-[var(--theme-secondary)] py-10"
        >
            {/* Background Decoration */}

            <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-[var(--theme-primary)] opacity-[0.04] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[var(--theme-primary)] opacity-[0.04] blur-3xl" />

            <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                {/* Section Header */}

                <Reveal threshold={0.2} distance={30}>
                    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
                        <h2 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl">
                            {isArabic
                                ? "ركائز تجربة المعرض"
                                : "The Pillars of the Exhibition Experience"}
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                            {isArabic
                                ? "مساحة متكاملة تجمع أصحاب الامتيازات التجارية والمستثمرين، وتفتح آفاقًا جديدة للتواصل والتعلم واستكشاف الفرص الاستثمارية وبناء العلامات التجارية."
                                : "An integrated platform connecting franchise owners and investors, creating new opportunities for networking, learning, investment discovery, and brand growth."}
                        </p>
                    </div>
                </Reveal>

                {/* About Cards */}

                <div className="grid grid-cols-2 md:grid-cols-4">
                    {cardsWithIcons.map((card, index) => {
                        const title = isArabic ? card.title?.ar : card.title?.en;
                        const description = isArabic
                            ? card.description?.ar
                            : card.description?.en;

                        const Icon = card.resolvedIcon;

                        return (
                            <Reveal
                                key={`${card.icon}-${index}`}
                                delay={index * 120}
                                threshold={0.2}
                                distance={30}
                            >
                                <article
                                    className={`flex h-full min-w-0 flex-col items-center px-4 py-6 text-center sm:px-6 sm:py-8 ${index % 2 !== 0 ? "border-s border-white/10" : ""} ${index >= 2 ? "border-t border-white/10 md:border-t-0" : ""} ${index > 0 ? "md:border-s md:border-white/10" : ""}`}
                                >
                                    {/* Icon */}

                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] transition-all duration-300">
                                        {Icon && <Icon className="text-xl" />}
                                    </div>

                                    {/* Title */}

                                    <h3 className="text-sm font-bold leading-6 text-white sm:text-base">
                                        {title}
                                    </h3>

                                    {/* Description */}

                                    <p className="mt-3 max-w-[280px] text-[11px] leading-6 text-white/60 sm:text-xs sm:leading-7">
                                        {description}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
