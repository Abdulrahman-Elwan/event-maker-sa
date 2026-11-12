
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { locales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getBlogCategories } from "@/lib/data/blog/getBlogCategories";
import { getBlogData } from "@/lib/data/blog/getBlogData";
import { getBlogPosts } from "@/lib/data/blog/getBlogPosts";
import BlogHero from "@/components/sections/blog/BlogHero";
import BlogFilters from "@/components/sections/blog/BlogFilters";
import BlogPostsSection from "@/components/sections/blog/BlogPostsSection";
import { absoluteUrl } from "@/lib/site";

const BLOG_SEO_FALLBACK: Record<
    Locale,
    {
        title: string;
        description: string;
        keywords: string[];
    }
> = {
    ar: {
        title: "المدونة | Event Maker",
        description:
            "اطلع على مقالات وأخبار Event Maker المتعلقة بالمعارض والمؤتمرات والفعاليات.",
        keywords: [
            "Event Maker",
            "المدونة",
            "المعارض",
            "المؤتمرات",
            "الفعاليات",
        ],
    },
    en: {
        title: "Blog | Event Maker",
        description:
            "Explore Event Maker articles and updates about exhibitions, conferences, and events.",
        keywords: [
            "Event Maker",
            "Blog",
            "Exhibitions",
            "Conferences",
            "Events",
        ],
    },
};

interface BlogPageProps {
    params: Promise<{
        locale: string;
    }>;
    searchParams: Promise<{
        page?: string;
        category?: string;
        sort?: string;
    }>;
}

interface BlogListingContentProps {
    locale: Locale;
    searchParams: BlogPageProps["searchParams"];
    categories: Awaited<ReturnType<typeof getBlogCategories>>;
}

// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata({ params, searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        page?: string;
        category?: string;
        sort?: string;
    }>;
}): Promise<Metadata> {

    const [{ locale }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    if (!locales.includes(locale as Locale)) {
        return {};
    }

    const currentLocale = locale as Locale;
    const isArabic = currentLocale === "ar";

    let blog: Awaited<ReturnType<typeof getBlogData>> | null = null;

    try {
        blog = await getBlogData();
    } catch (error) {
        console.error(
            "[Blog Metadata] Failed to fetch Blog SEO data:",
            error
        );
    }

    const fallback = BLOG_SEO_FALLBACK[currentLocale];
    const seo = blog?.seo;

    const firebaseTitle = seo?.title?.[currentLocale];
    const firebaseDescription = seo?.description?.[currentLocale];
    const firebaseKeywords = seo?.keywords?.[currentLocale];

    const title =
        typeof firebaseTitle === "string" && firebaseTitle.trim()
            ? firebaseTitle.trim()
            : fallback.title;

    const description =
        typeof firebaseDescription === "string" &&
            firebaseDescription.trim()
            ? firebaseDescription.trim()
            : fallback.description;

    const keywords =
        typeof firebaseKeywords === "string" &&
            firebaseKeywords.trim()
            ? firebaseKeywords
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : fallback.keywords;

    const BLOG_URLS = {
        ar: absoluteUrl("/blog/"),
        en: absoluteUrl("/en/blog/"),
    } as const;

    const basePath = isArabic ? "/blog/" : "/en/blog/";

    // Normalize query parameters.
    const category =
        typeof query.category === "string"
            ? query.category.trim().replace(/\/+$/, "")
            : "";

    const pageNumber = Number(query.page ?? "1");

    const page =
        Number.isInteger(pageNumber) && pageNumber > 1
            ? pageNumber
            : 1;

    const isOldest = query.sort === "oldest";

    // Build the canonical URL for indexable listing pages.
    const canonicalParams = new URLSearchParams();

    if (category) {
        canonicalParams.set("category", category);
    }

    if (page > 1) {
        canonicalParams.set("page", String(page));
    }

    const canonicalQuery = canonicalParams.toString();

    const canonicalUrl = absoluteUrl(
        canonicalQuery
            ? `${basePath}?${canonicalQuery}`
            : basePath
    );

    return {
        title,
        description,
        keywords,

        ...(isOldest
            ? {
                robots: {
                    index: false,
                    follow: true,
                },
            }
            : {
                alternates: {
                    canonical: canonicalUrl,
                    languages: {
                        ar: BLOG_URLS.ar,
                        en: BLOG_URLS.en,
                        "x-default": BLOG_URLS.ar,
                    },
                },
            }),

        openGraph: {
            type: "website",
            siteName: "Event Maker",
            url: isOldest ? BLOG_URLS[currentLocale] : canonicalUrl,
            title,
            description,
            locale: isArabic ? "ar_SA" : "en_SA",
            alternateLocale: isArabic ? ["en_SA"] : ["ar_SA"],
        },

        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

// --------------------------------------------------
// Server Component: Blog Listing Content
// --------------------------------------------------

async function BlogListingContent({
    locale,
    searchParams,
    categories,
}: BlogListingContentProps) {
    // Read searchParams inside the Suspense boundary.
    const query = await searchParams;

    const pageNumber = Number(query.page ?? "1");

    const currentPage =
        Number.isFinite(pageNumber) && pageNumber > 0
            ? Math.floor(pageNumber)
            : 1;

    const activeSort =
        query.sort === "oldest"
            ? "oldest"
            : "latest";

    const activeCategory =
        typeof query.category === "string" &&
            query.category.trim()
            ? query.category.trim().replace(/\/+$/, "")
            : undefined;

    const blogQueryStart = performance.now();

    const postsData = await getBlogPosts({
        category: activeCategory,
        sort: activeSort,
        page: currentPage,
    });

    const blogQueryDuration =
        performance.now() - blogQueryStart;

    console.log("[BLOG PERFORMANCE]", {
        category: activeCategory ?? "all",
        sort: activeSort,
        page: currentPage,
        duration: `${blogQueryDuration.toFixed(2)} ms`,
        postsCount: postsData.posts.length,
    });

    return (
        <>
            <section
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="bg-(--theme-backgroundColor) pt-14 sm:pt-16 lg:pt-20"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                    <BlogFilters
                        locale={locale}
                        categories={categories}
                        activeCategory={activeCategory}
                        activeSort={activeSort}
                    />
                </div>
            </section>

            <BlogPostsSection
                locale={locale}
                posts={postsData.posts}
                currentPage={postsData.currentPage}
                totalPages={postsData.totalPages}
                activeCategory={activeCategory}
                activeSort={activeSort}
            />
        </>
    );
}

// --------------------------------------------------
// Suspense Fallback
// --------------------------------------------------

function BlogListingFallback({
    locale,
}: {
    locale: Locale;
}) {
    return (
        <div
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="bg-(--theme-backgroundColor) px-5 py-16 sm:px-8 lg:px-10"
            aria-busy="true"
            aria-label={
                locale === "ar"
                    ? "جاري تحميل المقالات"
                    : "Loading blog posts"
            }
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 h-10 w-full max-w-md animate-pulse rounded-full bg-(--theme-secondary)/10" />

                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl"
                        >
                            <div className="aspect-[16/10] animate-pulse bg-(--theme-secondary)/10" />

                            <div className="space-y-4 p-5">
                                <div className="h-4 w-1/3 animate-pulse rounded bg-(--theme-secondary)/10" />
                                <div className="h-6 w-full animate-pulse rounded bg-(--theme-secondary)/10" />
                                <div className="h-4 w-4/5 animate-pulse rounded bg-(--theme-secondary)/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// Blog Page
// --------------------------------------------------

export default async function BlogPage({
    params,
    searchParams,
}: BlogPageProps) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;

    // These requests do not depend on searchParams.
    const [blog, categories] = await Promise.all([
        getBlogData(),
        getBlogCategories(),
    ]);

    return (
        <main>
            <BlogHero
                locale={currentLocale}
                hero={blog.hero}
            />

            <Suspense
                fallback={
                    <BlogListingFallback
                        locale={currentLocale}
                    />
                }
            >
                <BlogListingContent
                    locale={currentLocale}
                    searchParams={searchParams}
                    categories={categories}
                />
            </Suspense>
        </main>
    );
}
