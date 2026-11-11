import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import type { AboutContent } from "@/types/about/about";

import Reveal from "@/components/animations/Reveal";

interface AboutStorySectionProps {
    locale: Locale;
    content: AboutContent;
}

function cleanEmptyHtmlTags(html: string): string {
    let cleaned = html;
    let previous: string;

    const emptyTagRegex =
        /<([a-z][a-z0-9:-]*)(\s[^>]*)?>\s*(?:(?:&nbsp;|&#160;|&#xA0;|&#8203;)|<br\s*\/?>|\u00a0|\u200b|\ufeff|\s)*<\/\1>/gi;

    do {
        previous = cleaned;
        cleaned = cleaned.replace(emptyTagRegex, "");
    } while (cleaned !== previous);

    return cleaned.trim();
}

export default function AboutStorySection({
    locale,
    content,
}: AboutStorySectionProps) {
    const isArabic = locale === "ar";

    const storyContent = cleanEmptyHtmlTags(
        isArabic ? content.content_ar : content.content_en
    );

    return (
        <section
            id="about-story"
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-white py-10 md:py-16"
        >
            {/* Decorative Background */}
            <div className="pointer-events-none absolute -end-40 top-20 h-96 w-96 rounded-full bg-[var(--theme-primary)]/[0.06] blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">

                {/* Editorial Layout */}
                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

                    {/* Images Composition */}
                    <div className="relative mx-auto w-full max-w-[620px] lg:mx-0">

                        {/* Main Image */}
                        <Reveal delay={150} distance={35}>
                            <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_25px_70px_rgba(15,23,42,0.12)] sm:rounded-[36px]">
                                {content.main_image?.url && (
                                    <Image
                                        src={content.main_image.url}
                                        alt={isArabic ? "إيفنت ميكر - قصتنا" : "Event Maker - Our Story"}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                        className="object-cover transition-transform duration-1000 hover:scale-105"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#081225]/45 via-transparent to-transparent" />
                            </div>
                        </Reveal>

                        {/* Secondary Images */}
                        <div className="relative z-10 mt-4 grid grid-cols-2 gap-4 sm:absolute sm:-bottom-12 sm:-end-5 sm:mt-0 sm:w-[75%] sm:gap-5">

                            <Reveal delay={350} distance={25}>
                                <div className="relative aspect-[1.2/1] overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.13)] sm:aspect-[1.15/1] sm:rounded-3xl">
                                    {content.secondary_image_1?.url && (
                                        <Image
                                            src={content.secondary_image_1.url}
                                            alt={isArabic ? "من فعاليات إيفنت ميكر" : "Event Maker Events"}
                                            fill
                                            sizes="(max-width: 640px) 45vw, 220px"
                                            className="object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                    )}
                                </div>
                            </Reveal>

                            <Reveal delay={480} distance={25}>
                                <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.13)] sm:aspect-[1.15/1] sm:rounded-3xl">
                                    {content.secondary_image_2?.url && (
                                        <Image
                                            src={content.secondary_image_2.url}
                                            alt={isArabic ? "تجارب ومعارض إيفنت ميكر" : "Event Maker Experiences"}
                                            fill
                                            sizes="(max-width: 640px) 45vw, 220px"
                                            className="object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="relative pt-2 sm:pt-8 lg:pt-0">
                        <Reveal delay={320} distance={30}>
                            <div
                                className="about-story-content text-sm leading-9 text-slate-600 sm:text-base sm:leading-[2.2]"
                                dangerouslySetInnerHTML={{
                                    __html: storyContent,
                                }}
                            />
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Rich Text Styling */}
            <style>{`
                .about-story-content {
                    --story-primary: var(--theme-primary, #b89a61);
                    --story-secondary: var(--theme-secondary, #101B30);
                }

                /* Main Heading */
                .about-story-content h2 {
                    position: relative;
                    display: table;
                    margin-bottom: 1.75rem;
                    padding-bottom: 1rem;

                    color: var(--story-secondary);
                    font-size: clamp(1.7rem, 3vw, 2.35rem);
                    font-weight: 900;
                    line-height: 1.5;
                    letter-spacing: -0.04em;
                }

                .about-story-content h2::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    inset-inline-start: 0;

                    width: 65px;
                    height: 4px;
                    border-radius: 999px;

                    background: linear-gradient(
                        90deg,
                        var(--story-primary),
                        color-mix(in srgb, var(--story-primary), transparent 35%)
                    );
                }

                /* Strong Text */
                .about-story-content strong,
                .about-story-content b {
                    color: var(--story-primary);
                    font-weight: 800;
                }

                /* Lists */
                .about-story-content ul,
                .about-story-content ol {
                    margin-top: 15px;
                    margin-bottom: 15px;
                    padding-inline-start: 1.5rem;
                }

                .about-story-content ul {
                    list-style-type: disc;
                }

                .about-story-content ol {
                    list-style-type: decimal;
                }

                .about-story-content li strong {
                    margin-bottom: 0.65rem;
                    padding-inline-start: 0.35rem;
                    color: var(--story-primary);
                    line-height: 1.9;
                }

                .about-story-content li::marker {
                    color: var(--story-primary);
                    font-weight: 800;
                }

                /* Nested Lists */
                .about-story-content li ul,
                .about-story-content li ol {
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                /* Links */
                .about-story-content a {
                    color: var(--story-primary);
                    font-weight: 700;
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    transition: opacity 0.2s ease;
                }

                .about-story-content a:hover {
                    opacity: 0.7;
                }

                /* Last Paragraph */
                .about-story-content p:last-child {
                    margin-bottom: 0;
                }

                /* Quill Alignment */
                .about-story-content .ql-align-right {
                    text-align: right;
                }

                .about-story-content .ql-align-center {
                    text-align: center;
                }

                .about-story-content .ql-align-left {
                    text-align: left;
                }

                .about-story-content .ql-align-justify {
                    text-align: justify;
                }

                /* Mobile */
                @media (max-width: 640px) {
                    .about-story-content h2 {
                        margin-bottom: 1.25rem;
                        padding-bottom: 0.8rem;
                    }

                    .about-story-content h2::after {
                        width: 48px;
                        height: 3px;
                    }

                    .about-story-content ul,
                    .about-story-content ol {
                        padding-inline-start: 1.25rem;
                    }
                }
            `}</style>
        </section>
    );
}

