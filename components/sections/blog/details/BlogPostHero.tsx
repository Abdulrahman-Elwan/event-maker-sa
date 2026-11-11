import Image from "next/image";
import Link from "next/link";

import {
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
    FiClock,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";

interface BlogPostHeroProps {
    locale: Locale;
    post: BlogPost;
}

function getReadingTime(content: string) {
    const text = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const words = text
        ? text.split(/\s+/).length
        : 0;

    return Math.max(1, Math.ceil(words / 180));
}

export default function BlogPostHero({
    locale,
    post,
}: BlogPostHeroProps) {
    const isArabic = locale === "ar";

    const title =
        post.title[locale] || post.title.ar;

    const imageAlt =
        post.coverImage.alt[locale] ||
        post.coverImage.alt.ar ||
        title;

    const category = post.categories[0];

    const date = post.createdAt
        ? new Intl.DateTimeFormat(
            isArabic ? "ar-SA" : "en-US",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        ).format(post.createdAt)
        : "";

    const readingTime = getReadingTime(
        post.content[locale] || post.content.ar
    );

    return (
        <section className="relative isolate min-h-[620px] overflow-hidden bg-(--theme-secondary) text-white">
            {post.coverImage.url && (
                <Image
                    src={post.coverImage.url}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            )}

            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-linear-to-l from-(--theme-secondary) via-(--theme-secondary)/80 to-transparent" />

            <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-end px-5 pb-14 pt-32 sm:px-8 lg:px-10">
                <div className="max-w-4xl">

                    <h1 className="max-w-4xl text-3xl font-bold leading-[1.2] sm:text-[42px]">
                        {title}
                    </h1>

                    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-white/75">
                        {date && (
                            <span className="inline-flex items-center gap-2">
                                <FiCalendar className="text-(--theme-primary)" />
                                {date}
                            </span>
                        )}

                        <span className="inline-flex items-center gap-2">
                            <FiClock className="text-(--theme-primary)" />
                            {readingTime}{" "}
                            {isArabic
                                ? "دقائق قراءة"
                                : "min read"}
                        </span>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
                        <Link
                            href={
                                locale === "ar"
                                    ? "/blog"
                                    : "/en/blog"
                            }
                            className="inline-flex items-center gap-2 text-white/70 transition hover:text-(--theme-primary)"
                        >
                            {isArabic ? (
                                <>
                                    المدونة
                                    <FiArrowLeft />
                                </>
                            ) : (
                                <>
                                    <FiArrowLeft />
                                    Blog
                                </>
                            )}
                        </Link>

                        {category && (
                            <>
                                <span className="text-white/30">
                                    /
                                </span>

                                <span className="rounded-full border border-(--theme-primary)/50 bg-(--theme-primary)/15 px-4 py-1.5 text-(--theme-primary)">
                                    {category.name[locale] || category.name.ar}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}