import type { Locale } from "@/lib/i18n/config";
import type { Session } from "@/types/sessions";

import SessionsSlider from "./SessionsSlider";
import Reveal from "@/components/animations/Reveal";

interface SessionsSectionProps {
    locale: Locale;
    sessions: Session[];
}

export default function SessionsSection({
    locale,
    sessions,
}: SessionsSectionProps) {
    const isArabic = locale === "ar";

    const sessionsStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": isArabic
            ? "جلسات ولقاءات"
            : "Sessions & Talks",
        "numberOfItems": sessions.length,
        "itemListElement": sessions.map((session, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": session.title[isArabic ? "ar" : "en"],
            "url": session.youtubeUrl,
            "image": session.poster.url,
        })),
    };

    if (sessions.length === 0) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-(--theme-backgroundColor) py-12 sm:py-16 lg:py-18"
        >
            <div
                className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full opacity-[0.06] blur-3xl"
                style={{
                    backgroundColor:
                        "var(--theme-primary)",
                }}
            />

            <div
                className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full opacity-[0.04] blur-3xl"
                style={{
                    backgroundColor:
                        "var(--theme-secondary)",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(sessionsStructuredData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <Reveal
                    distance={35}
                    duration={850}
                    threshold={0.05}
                >
                    <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                        <div className="max-w-2xl">
                            <span
                                className="mb-4 block text-xl font-bold"
                                style={{
                                    color: "var(--theme-primary)",
                                }}
                            >
                                {isArabic
                                    ? "جلسات ولقاءات"
                                    : "Sessions & Talks"}
                            </span>

                            <h2 className="text-3xl font-bold tracking-tight text-(--theme-secondary) sm:text-4xl lg:text-5xl">
                                {isArabic
                                    ? "أفكار وتجارب من قلب صناعة الفعاليات"
                                    : "Ideas and Insights from the World of Events"}
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-(--theme-text)/55 sm:text-base">
                                {isArabic
                                    ? "شاهد أبرز الجلسات واللقاءات التي تسلط الضوء على الخبرات والأفكار الملهمة في قطاع المعارض والفعاليات."
                                    : "Explore selected sessions and talks featuring insights, experiences, and inspiring ideas from the exhibitions and events industry."}
                            </p>
                        </div>

                        <div className="hidden shrink-0 items-center gap-2 text-xs font-medium text-(--theme-text)/40 lg:flex">
                            <span>
                                {String(sessions.length).padStart(2, "0")}
                            </span>

                            <span className="h-px w-8 bg-(--theme-secondary)/15" />

                            <span>
                                {isArabic ? "جلسات" : "Sessions"}
                            </span>
                        </div>
                    </div>
                </Reveal>

                <Reveal
                    distance={40}
                    duration={900}
                    delay={150}
                    threshold={0.05}
                >
                    <SessionsSlider
                        locale={locale}
                        sessions={sessions}
                    />
                </Reveal>
            </div>
        </section>
    );
}