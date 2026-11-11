
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { locales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

import { getBlogPostBySlug } from "@/lib/data/blog/getBlogPostBySlug";
import { getBlogPosts } from "@/lib/data/blog/getBlogPosts";
import { getRelatedBlogPosts } from "@/lib/data/blog/getRelatedBlogPosts";

import BlogPostHero from "@/components/sections/blog/details/BlogPostHero";
import BlogPostContent from "@/components/sections/blog/details/BlogPostContent";
import BlogPostShare from "@/components/sections/blog/details/BlogPostShare";
import RelatedBlogPosts from "@/components/sections/blog/details/RelatedBlogPosts";
import BlogPostCTA from "@/components/sections/blog/details/BlogPostCTA";
import { connection } from "next/server";

const SITE_URL = "https://event-maker.sa";

const BLOG_URLS = {
    ar: SITE_URL,
    en: `${SITE_URL}/en`,
} as const;

interface BlogPostPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

interface RelatedPostsProps {
    locale: Locale;
    post: NonNullable<
        Awaited<ReturnType<typeof getBlogPostBySlug>>
    >;
}

function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

function getNonEmptyString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim()
        ? value.trim()
        : undefined;
}

function getValidImageUrl(value: unknown): string | undefined {
    if (typeof value !== "string" || !value.trim()) {
        return undefined;
    }

    try {
        const url = new URL(value);

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            return undefined;
        }

        return url.toString();
    } catch {
        return undefined;
    }
}

// --------------------------------------------------
// Static Params
// --------------------------------------------------

/**
 * Generate static article routes for each locale.
 *
 * The parent [locale] layout generates the locale params.
 * This function generates the published article slugs
 * for each locale.
 */
export async function generateStaticParams({
    params,
}: {
    params: { locale: string };
}) {
    if (!isValidLocale(params.locale)) {
        return [];
    }

    // Fetch the first page to determine the total page count.
    const firstPage = await getBlogPosts({
        sort: "latest",
        page: 1,
    });

    const allPosts = [...firstPage.posts];

    // Fetch the remaining pages so no published article is missed.
    for (
        let page = 2;
        page <= firstPage.totalPages;
        page++
    ) {
        const result = await getBlogPosts({
            sort: "latest",
            page,
        });

        allPosts.push(...result.posts);
    }

    // Keep only valid, unique SEO slugs.
    const uniqueSlugs = new Set<string>();

    for (const post of allPosts) {
        const slug = getNonEmptyString(post.seo.slug);

        if (slug) {
            uniqueSlugs.add(slug);
        }
    }

    return Array.from(uniqueSlugs).map((slug) => ({
        slug,
    }));
}

// --------------------------------------------------
// Related Posts
// --------------------------------------------------

async function RelatedPostsLoader({
    locale,
    post,
}: RelatedPostsProps) {

    await connection();
    const relatedPosts = await getRelatedBlogPosts(post, 3);

    return (
        <RelatedBlogPosts
            locale={locale}
            posts={relatedPosts}
        />
    );
}

function RelatedPostsFallback({
    locale,
}: {
    locale: Locale;
}) {
    return (
        <section
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="py-12 sm:py-16"
            aria-label={
                locale === "ar"
                    ? "المقالات ذات الصلة"
                    : "Related articles"
            }
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-(--theme-secondary)/10" />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-3xl border border-(--theme-secondary)/10"
                        >
                            <div className="aspect-16/10 animate-pulse bg-(--theme-secondary)/10" />

                            <div className="space-y-3 p-5">
                                <div className="h-5 w-full animate-pulse rounded bg-(--theme-secondary)/10" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-(--theme-secondary)/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --------------------------------------------------
// Main Article Fallback
// --------------------------------------------------

function BlogPostFallback() {
    return (
        <main
            className="min-h-screen"
            aria-hidden="true"
        >
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
                <div className="mb-8 h-8 w-2/3 animate-pulse rounded-lg bg-(--theme-secondary)/10" />

                <div className="mb-8 aspect-16/9 w-full animate-pulse rounded-3xl bg-(--theme-secondary)/10" />

                <div className="mx-auto max-w-4xl space-y-5">
                    <div className="h-6 w-full animate-pulse rounded bg-(--theme-secondary)/10" />
                    <div className="h-6 w-full animate-pulse rounded bg-(--theme-secondary)/10" />
                    <div className="h-6 w-4/5 animate-pulse rounded bg-(--theme-secondary)/10" />
                </div>
            </div>
        </main>
    );
}

// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) {
        return {};
    }

    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {};
    }

    const currentLocale = locale;

    // Use the current language only.
    const localizedTitle = getNonEmptyString(
        post.title[currentLocale]
    );

    const metaTitle = getNonEmptyString(
        post.seo.metaTitle?.[currentLocale]
    );

    const description = getNonEmptyString(
        post.seo.metaDescription?.[currentLocale]
    );

    // Use the article title in the same language
    // only when the SEO title is missing.
    const title = metaTitle || localizedTitle;

    // Use the stored SEO slug, falling back to the requested slug.
    const canonicalSlug =
        getNonEmptyString(post.seo.slug) || slug;

    const canonicalUrl =
        `${BLOG_URLS[currentLocale]}/${canonicalSlug}`;

    const arabicUrl =
        `${BLOG_URLS.ar}/${canonicalSlug}`;

    const englishUrl =
        `${BLOG_URLS.en}/${canonicalSlug}`;

    const image = getValidImageUrl(post.coverImage?.url);

    const imageAlt =
        getNonEmptyString(
            post.coverImage?.alt?.[currentLocale]
        ) || localizedTitle;

    return {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),

        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: arabicUrl,
                en: englishUrl,
                "x-default": arabicUrl,
            },
        },

        openGraph: {
            type: "article",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            url: canonicalUrl,
            siteName: "Event Maker",
            locale:
                currentLocale === "ar"
                    ? "ar_SA"
                    : "en_SA",
            alternateLocale:
                currentLocale === "ar"
                    ? ["en_SA"]
                    : ["ar_SA"],
            ...(image
                ? {
                      images: [
                          {
                              url: image,
                              ...(imageAlt
                                  ? { alt: imageAlt }
                                  : {}),
                          },
                      ],
                  }
                : {}),
        },

        twitter: {
            card: image
                ? "summary_large_image"
                : "summary",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(image ? { images: [image] } : {}),
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

// --------------------------------------------------
// Article Content Loader
// --------------------------------------------------

/**
 * All runtime params access and article data loading
 * happen inside the page Suspense boundary.
 */
async function BlogPostContentLoader({
    params,
}: BlogPostPageProps) {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const title =
        getNonEmptyString(post.title[locale]) || "";

    const canonicalSlug =
        getNonEmptyString(post.seo.slug) || slug;

    return (
        <>
            <BlogPostHero
                locale={locale}
                post={post}
            />

            <BlogPostContent
                locale={locale}
                post={post}
            />

            <BlogPostShare
                locale={locale}
                slug={canonicalSlug}
                title={title}
            />

            <Suspense
                fallback={
                    <RelatedPostsFallback locale={locale} />
                }
            >
                <RelatedPostsLoader
                    locale={locale}
                    post={post}
                />
            </Suspense>

            <BlogPostCTA locale={locale} />
        </>
    );
}

// --------------------------------------------------
// Blog Post Page
// --------------------------------------------------

export default function BlogPostPage({
    params,
}: BlogPostPageProps) {
    return (
        <Suspense fallback={<BlogPostFallback />}>
            <BlogPostContentLoader params={params} />
        </Suspense>
    );
}
