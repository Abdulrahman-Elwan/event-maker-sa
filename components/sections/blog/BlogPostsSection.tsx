
import Link from "next/link";
import {
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";
import BlogCard from "@/components/cards/BlogCard";

interface BlogPostsSectionProps {
    locale: Locale;
    posts: BlogPost[];
    currentPage: number;
    totalPages: number;
    activeCategory?: string;
    activeSort: "latest" | "oldest";
}

export default function BlogPostsSection({
    locale,
    posts,
    currentPage,
    totalPages,
    activeCategory,
    activeSort,
}: BlogPostsSectionProps) {
    const isArabic = locale === "ar";

    const basePath = isArabic ? "/blog" : "/en/blog";

    // Normalize pagination values defensively.
    const safeTotalPages = Math.max(
        1,
        Math.floor(totalPages || 1)
    );

    const safeCurrentPage = Math.min(
        Math.max(1, Math.floor(currentPage || 1)),
        safeTotalPages
    );

    const getPageHref = (page: number) => {
        const params = new URLSearchParams();

        if (activeCategory) {
            params.set("category", activeCategory);
        }

        if (activeSort === "oldest") {
            params.set("sort", "oldest");
        }

        if (page > 1) {
            params.set("page", String(page));
        }

        const query = params.toString();

        return query ? `${basePath}?${query}` : basePath;
    };

    // Display a compact range of page numbers.
    const getVisiblePages = () => {
        const maxVisiblePages = 5;

        if (safeTotalPages <= maxVisiblePages) {
            return Array.from(
                { length: safeTotalPages },
                (_, index) => index + 1
            );
        }

        let start = Math.max(1, safeCurrentPage - 2);
        let end = Math.min(
            safeTotalPages,
            start + maxVisiblePages - 1
        );

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(
                1,
                end - maxVisiblePages + 1
            );
        }

        return Array.from(
            { length: end - start + 1 },
            (_, index) => start + index
        );
    };

    const visiblePages = getVisiblePages();

    const hasPreviousPage = safeCurrentPage > 1;
    const hasNextPage = safeCurrentPage < safeTotalPages;

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="bg-(--theme-backgroundColor) py-10 sm:py-16"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                {posts.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    locale={locale}
                                    post={post}
                                />
                            ))}
                        </div>

                        {safeTotalPages > 1 && (
                            <nav
                                aria-label={
                                    isArabic
                                        ? "صفحات المدونة"
                                        : "Blog pagination"
                                }
                                className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:mt-14"
                            >
                                {/* Previous page */}
                                <Link
                                    href={getPageHref(
                                        Math.max(safeCurrentPage - 1, 1)
                                    )}
                                    aria-label={
                                        isArabic
                                            ? "الصفحة السابقة"
                                            : "Previous page"
                                    }
                                    aria-disabled={!hasPreviousPage}
                                    tabIndex={
                                        hasPreviousPage ? 0 : -1
                                    }
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                                        !hasPreviousPage
                                            ? "pointer-events-none border-(--theme-secondary)/5 text-(--theme-secondary)/20"
                                            : "border-(--theme-secondary)/10 text-(--theme-secondary) hover:border-(--theme-primary)/40 hover:bg-(--theme-primary) hover:text-white"
                                    }`}
                                >
                                    {isArabic ? (
                                        <FiArrowRight />
                                    ) : (
                                        <FiArrowLeft />
                                    )}
                                </Link>

                                {/* First page and leading ellipsis */}
                                {visiblePages[0] > 1 && (
                                    <>
                                        <Link
                                            href={getPageHref(1)}
                                            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-(--theme-secondary)/10 px-3 text-sm font-semibold text-(--theme-secondary) transition-all hover:border-(--theme-primary)/40"
                                        >
                                            1
                                        </Link>

                                        {visiblePages[0] > 2 && (
                                            <span
                                                aria-hidden="true"
                                                className="px-1 text-(--theme-text)/40"
                                            >
                                                ...
                                            </span>
                                        )}
                                    </>
                                )}

                                {/* Visible pages */}
                                <div className="flex items-center gap-2">
                                    {visiblePages.map((page) => (
                                        <Link
                                            key={page}
                                            href={getPageHref(page)}
                                            aria-current={
                                                page === safeCurrentPage
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-all duration-300 ${
                                                page === safeCurrentPage
                                                    ? "border-(--theme-primary) bg-(--theme-primary) text-white"
                                                    : "border-(--theme-secondary)/10 text-(--theme-secondary) hover:border-(--theme-primary)/40"
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>

                                {/* Trailing ellipsis and last page */}
                                {visiblePages[
                                    visiblePages.length - 1
                                ] < safeTotalPages && (
                                    <>
                                        {visiblePages[
                                            visiblePages.length - 1
                                        ] < safeTotalPages - 1 && (
                                            <span
                                                aria-hidden="true"
                                                className="px-1 text-(--theme-text)/40"
                                            >
                                                ...
                                            </span>
                                        )}

                                        <Link
                                            href={getPageHref(
                                                safeTotalPages
                                            )}
                                            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-(--theme-secondary)/10 px-3 text-sm font-semibold text-(--theme-secondary) transition-all hover:border-(--theme-primary)/40"
                                        >
                                            {safeTotalPages}
                                        </Link>
                                    </>
                                )}

                                {/* Next page */}
                                <Link
                                    href={getPageHref(
                                        Math.min(
                                            safeCurrentPage + 1,
                                            safeTotalPages
                                        )
                                    )}
                                    aria-label={
                                        isArabic
                                            ? "الصفحة التالية"
                                            : "Next page"
                                    }
                                    aria-disabled={!hasNextPage}
                                    tabIndex={
                                        hasNextPage ? 0 : -1
                                    }
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                                        !hasNextPage
                                            ? "pointer-events-none border-(--theme-secondary)/5 text-(--theme-secondary)/20"
                                            : "border-(--theme-secondary)/10 text-(--theme-secondary) hover:border-(--theme-primary)/40 hover:bg-(--theme-primary) hover:text-white"
                                    }`}
                                >
                                    {isArabic ? (
                                        <FiArrowLeft />
                                    ) : (
                                        <FiArrowRight />
                                    )}
                                </Link>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="flex min-h-72 items-center justify-center rounded-[1.5rem] border border-(--theme-secondary)/10 bg-white">
                        <p className="text-sm text-(--theme-text)/50">
                            {isArabic
                                ? "لا توجد مقالات متاحة حاليًا."
                                : "No articles are available at the moment."}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
