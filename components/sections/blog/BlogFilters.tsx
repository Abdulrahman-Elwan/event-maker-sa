// components\sections\blog\BlogFilters.tsx
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { BlogCategory } from "@/types/blog";

interface BlogFiltersProps {
    locale: Locale;
    categories: BlogCategory[];
    activeCategory?: string;
    activeSort: "latest" | "oldest";
}

export default function BlogFilters({
    locale,
    categories,
    activeCategory,
    activeSort,
}: BlogFiltersProps) {
    const isArabic = locale === "ar";

    const basePath = isArabic
        ? "/blog"
        : "/en/blog";

    const getHref = (
        category?: string,
        sort: "latest" | "oldest" = activeSort
    ) => {
        const params = new URLSearchParams();

        if (category) {
            params.set("category", category);
        }

        if (sort !== "latest") {
            params.set("sort", sort);
        }

        const query = params.toString();

        return query
            ? `${basePath}?${query}`
            : basePath;
    };

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="flex flex-col gap-5 border-b border-(--theme-secondary)/10 pb-7 lg:flex-row lg:items-center lg:justify-between"
        >
            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={getHref()}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                        !activeCategory
                            ? "border-(--theme-primary) bg-(--theme-primary) text-white"
                            : "border-(--theme-secondary)/10 text-(--theme-text)/65 hover:border-(--theme-primary)/40 hover:text-(--theme-secondary)"
                    }`}
                >
                    {isArabic ? "الكل" : "All"}
                </Link>

                {categories.map((category) => {
                    const name =
                        category.name[locale] ||
                        category.name[
                            isArabic ? "en" : "ar"
                        ];

                    return (
                        <Link
                            key={category.id}
                            href={getHref(
                                category.slug
                            )}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                                activeCategory ===
                                category.slug
                                    ? "border-(--theme-primary) bg-(--theme-primary) text-white"
                                    : "border-(--theme-secondary)/10 text-(--theme-text)/65 hover:border-(--theme-primary)/40 hover:text-(--theme-secondary)"
                            }`}
                        >
                            {name}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-(--theme-text)/45">
                    {isArabic
                        ? "ترتيب:"
                        : "Sort:"}
                </span>

                <Link
                    href={getHref(
                        activeCategory,
                        "latest"
                    )}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                        activeSort === "latest"
                            ? "border-(--theme-secondary) bg-(--theme-secondary) text-white"
                            : "border-(--theme-secondary)/10 text-(--theme-text)/65 hover:border-(--theme-secondary)/30"
                    }`}
                >
                    {isArabic
                        ? "الأحدث"
                        : "Newest"}
                </Link>

                <Link
                    href={getHref(
                        activeCategory,
                        "oldest"
                    )}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                        activeSort === "oldest"
                            ? "border-(--theme-secondary) bg-(--theme-secondary) text-white"
                            : "border-(--theme-secondary)/10 text-(--theme-text)/65 hover:border-(--theme-secondary)/30"
                    }`}
                >
                    {isArabic
                        ? "الأقدم"
                        : "Oldest"}
                </Link>
            </div>
        </div>
    );
}