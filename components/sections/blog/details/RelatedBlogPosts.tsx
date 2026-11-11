import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";

import BlogCard from "@/components/cards/BlogCard";

interface RelatedBlogPostsProps {
    locale: Locale;
    posts: BlogPost[];
}

export default function RelatedBlogPosts({
    locale,
    posts,
}: RelatedBlogPostsProps) {
    if (!posts.length) {
        return null;
    }

    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="bg-(--theme-backgroundColor) py-10"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <div>
                        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                            {isArabic
                                ? "استكشف المزيد"
                                : "Explore More"}
                        </span>

                        <h2 className="text-3xl font-bold text-(--theme-text) sm:text-4xl">
                            {isArabic
                                ? "مقالات ذات صلة"
                                : "Related Articles"}
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}