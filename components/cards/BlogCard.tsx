import Image from "next/image";
import Link from "next/link";
import {
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
    post: BlogPost;
    locale: Locale;
}

function getExcerpt(
    html: string,
    maxLength = 150
) {
    const text = html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

export default function BlogCard({
    post,
    locale,
}: BlogCardProps) {
    const isArabic = locale === "ar";

    const title =
        post.title[locale] ||
        post.title[isArabic ? "en" : "ar"];

    const content =
        post.content[locale] ||
        post.content[isArabic ? "en" : "ar"];

    const imageAlt =
        post.coverImage.alt[locale] ||
        post.coverImage.alt[
        isArabic ? "en" : "ar"
        ] ||
        title;

    const excerpt = getExcerpt(content);

    const formattedDate = post.createdAt
        ? new Intl.DateTimeFormat(
            isArabic ? "ar-SA" : "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        ).format(post.createdAt)
        : "";

    const category =
        post.categories?.[0]?.name[locale] ||
        post.categories?.[0]?.name[
        isArabic ? "en" : "ar"
        ] ||
        "";

    const href = isArabic
        ? `/${post.seo.slug}`
        : `/en/${post.seo.slug}`;

    return (
        <article
            dir={isArabic ? "rtl" : "ltr"}
            className="group overflow-hidden rounded-3xl border border-(--theme-secondary)/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
            <Link
                href={href}
                className="block"
            >
                <div className="relative aspect-16/10 overflow-hidden bg-(--theme-secondary)/5">
                    {post.coverImage.url ? (
                        <Image
                            src={
                                post.coverImage.url
                            }
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-(--theme-secondary)/5" />
                    )}
                </div>

                <div className="p-5 sm:p-6">
                    <h2 className="line-clamp-2 text-xl font-bold leading-8 text-(--theme-secondary) transition-colors duration-300 group-hover:text-(--theme-primary) sm:text-2xl">
                        {title}
                    </h2>

                    {excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-(--theme-text)/60">
                            {excerpt}
                        </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-(--theme-secondary)/10 pt-4">
                        {formattedDate && (
                            <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-(--theme-text)/40">
                                <FiCalendar className="shrink-0 text-(--theme-primary)" />

                                <span className="truncate">
                                    {formattedDate}
                                </span>
                            </div>
                        )}

                        {category && (
                            <span className="max-w-[50%] truncate text-xs font-semibold text-(--theme-primary)">
                                {category}
                            </span>
                        )}
                    </div>

                    <div className="mt-5 flex">
                        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--theme-primary) px-4 py-3 text-sm font-semibold text-(--theme-primary) transition-all duration-300 group-hover:bg-(--theme-primary) group-hover:text-white">
                            <span>
                                {isArabic
                                    ? "اقرأ المزيد"
                                    : "Read More"}
                            </span>

                            {isArabic ? (
                                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                            ) : (
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            )}
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}