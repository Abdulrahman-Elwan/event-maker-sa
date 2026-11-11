
import type { Locale } from "@/lib/i18n/config";
import type { ExhibitionSpeaker } from "@/types/landingPage/exhibition";

import Reveal from "@/components/animations/Reveal";
import ExhibitionSpeakersCarousel from "./ExhibitionSpeakersCarousel";

interface ExhibitionSpeakersSectionProps {
    locale: Locale;
    speakers: ExhibitionSpeaker[];
}

export default function ExhibitionSpeakersSection({
    locale,
    speakers,
}: ExhibitionSpeakersSectionProps) {
    const isArabic = locale === "ar";

    const validSpeakers = (speakers ?? []).flatMap(
        (speaker, index) => {
            const image = speaker?.image;
            const imageUrl = image?.url;

            const name =
                speaker?.name?.[locale] ||
                speaker?.name?.[isArabic ? "en" : "ar"];

            const title =
                speaker?.title?.[locale] ||
                speaker?.title?.[isArabic ? "en" : "ar"];

            if (!imageUrl || !name || !title) {
                return [];
            }

            return [
                {
                    ...speaker,
                    image,
                    displayName: name,
                    displayTitle: title,
                    uniqueKey:
                        speaker.id ||
                        image.public_id ||
                        String(index),
                },
            ];
        }
    );

    if (validSpeakers.length < 3) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="section relative overflow-hidden bg-[var(--theme-background)] py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <ExhibitionSpeakersCarousel
                    locale={locale}
                    speakers={validSpeakers}
                    header={
                        <div className="text-center lg:text-start">
                            <Reveal threshold={0.2} distance={25}>
                                <span className="mb-4 block text-sm font-bold tracking-[0.14em] text-[var(--theme-primary)] sm:text-base">
                                    {isArabic
                                        ? "متحدثو المعرض"
                                        : "OUR SPEAKERS"}
                                </span>
                            </Reveal>

                            <Reveal
                                threshold={0.2}
                                distance={25}
                                delay={120}
                            >
                                <h2 className="text-3xl font-extrabold leading-snug text-[var(--theme-text)] sm:text-4xl lg:text-[2.65rem]">
                                    {isArabic
                                        ? "خبرات تلهم المستقبل"
                                        : "Experts Shaping The Future"}
                                </h2>
                            </Reveal>

                            <Reveal
                                threshold={0.2}
                                distance={25}
                                delay={240}
                            >
                                <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-[var(--theme-text)] opacity-70 sm:text-base lg:mx-0">
                                    {isArabic
                                        ? "نخبة من الخبراء والمتخصصين في مجالاتهم المختلفة، يشاركون خبراتهم ورؤاهم لإثراء تجربة المعرض."
                                        : "Meet a distinguished group of experts and industry leaders sharing their knowledge and insights to enrich the exhibition experience."}
                                </p>
                            </Reveal>
                        </div>
                    }
                />
            </div>
        </section>
    );
}
