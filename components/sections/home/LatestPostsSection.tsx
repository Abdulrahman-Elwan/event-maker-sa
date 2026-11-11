import Link from "next/link";
import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";

import BlogCard from "@/components/cards/BlogCard";

interface LatestPostsSectionProps {
    locale: Locale;
    posts: BlogPost[];
}

export default function LatestPostsSection({
    locale,
    posts,
}: LatestPostsSectionProps) {
    const isArabic = locale === "ar";
    const latestPosts = posts.slice(0, 3);

    if (!latestPosts.length) {
        return null;
    }

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="relative overflow-hidden bg-white py-12 sm:py-15"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
                <div className="mb-10 flex flex-col gap-5 sm:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                    <div className="max-w-2xl">
                        <span
                            className="mb-4 block text-xl font-bold"
                            style={{
                                color: "var(--theme-primary)",
                            }}
                        >
                            {isArabic
                                ? "المدونة"
                                : "Our Blog"}
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            {isArabic
                                ? "أحدث المقالات"
                                : "Latest Articles"}
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                            {isArabic
                                ? "اكتشف أحدث مقالاتنا ونصائحنا حول تنظيم وإدارة المعارض والمؤتمرات والفعاليات."
                                : "Discover our latest articles, insights, and ideas about exhibitions, conferences, and events."}
                        </p>
                    </div>

                    <Link
                        href={isArabic ? "/blog" : "/en/blog"}
                        className="group hidden shrink-0 items-center gap-3 text-sm font-semibold text-slate-700 sm:inline-flex"
                    >
                        <span>
                            {isArabic
                                ? "عرض جميع المقالات"
                                : "View All Articles"}
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 group-hover:border-[var(--theme-primary)] group-hover:bg-[var(--theme-primary)] group-hover:text-slate-950">
                            {isArabic ? (
                                <FiArrowLeft />
                            ) : (
                                <FiArrowRight />
                            )}
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {latestPosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            locale={locale}
                        />
                    ))}
                </div>

                <div className="mt-9 flex justify-center sm:hidden">
                    <Link
                        href={isArabic ? "/blog" : "/en/blog"}
                        className="group inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-slate-950"
                    >
                        <span>
                            {isArabic
                                ? "عرض جميع المقالات"
                                : "View All Articles"}
                        </span>

                        {isArabic ? (
                            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                        ) : (
                            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                    </Link>
                </div>
            </div>
        </section>
    );
}