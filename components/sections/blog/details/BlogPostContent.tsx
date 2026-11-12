
import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/types/blog";

interface BlogPostContentProps {
    locale: Locale;
    post: BlogPost;
}

interface HeadingItem {
    id: string;
    text: string;
    level: number;
}

function cleanBlogContent(
    html: string,
    postTitle: string
): string {
    if (!html) return "";

    let content = html;

    // Prepare article title for safe HTML attribute insertion
    const safeTitle = postTitle
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Add article title to images with missing or empty alt attributes
    content = content.replace(
        /<img\b[^>]*>/gi,
        (imageTag) => {
            const altMatch = imageTag.match(
                /\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
            );

            if (!altMatch) {
                return imageTag.replace(
                    /<img\b/i,
                    `<img alt="${safeTitle}"`
                );
            }

            const currentAlt =
                altMatch[1] ?? altMatch[2] ?? altMatch[3] ?? "";

            if (!currentAlt.trim()) {
                return imageTag.replace(
                    /\balt\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
                    `alt="${safeTitle}"`
                );
            }

            return imageTag;
        }
    );

    content = content
        .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
        .replace(/&ZeroWidthSpace;|&#8203;|&#x200B;/gi, "")
        .replace(/&amp;#x20;|&amp;#32;/gi, " ")
        .replace(/&#xA0;|&#160;|&nbsp;/gi, " ");

    content = content.replace(/[ \t]{2,}/g, " ");

    content = content.replace(
        /<span\b[^>]*>\s*(?:&nbsp;|&#160;|&#xA0;|\s|<br\s*\/?>)*\s*<\/span>/gi,
        ""
    );

    content = content.replace(
        /(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi,
        (match, tag, attributes, innerContent) => {
            const cleanHeading = innerContent
                .replace(/<span\b[^>]*>/gi, "")
                .replace(/<\/span>/gi, "");

            return `<${tag}${attributes}>${cleanHeading}</${tag}>`;
        }
    );

    content = content.replace(
        /<p\b[^>]*>\s*(?:(?:&nbsp;|&#160;|&#xA0;)\s*|<br\s*\/?>\s*)*<\/p>/gi,
        ""
    );

    content = content.replace(
        /<p\b[^>]*>(?:\s|<span\b[^>]*>\s*<\/span>)*<\/p>/gi,
        ""
    );

    content = content
        .replace(/>\s+</g, "><")
        .replace(/\n\s*\n+/g, "\n")
        .trim();

    return content;
}

function extractHeadings(html: string): HeadingItem[] {
    const headings: HeadingItem[] = [];

    const regex =
        /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;

    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
        const level = Number(match[1]);

        const text = match[3]
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, " ")
            .trim();

        if (!text) {
            continue;
        }

        headings.push({
            id: `heading-${headings.length + 1}`,
            text,
            level,
        });
    }

    return headings;
}

function addHeadingIds(
    html: string,
    headings: HeadingItem[]
) {
    let index = 0;

    return html.replace(
        /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi,
        (match, level, attributes, content) => {
            const heading = headings[index];

            if (!heading) {
                return match;
            }

            index += 1;

            if (/\sid=["'][^"']*["']/i.test(attributes)) {
                return match;
            }

            return `<h${level}${attributes} id="${heading.id}">${content}</h${level}>`;
        }
    );
}

export default function BlogPostContent({
    locale,
    post,
}: BlogPostContentProps) {
    const isArabic = locale === "ar";

    const rawContent =
        post.content[locale] || post.content.ar;

    const postTitle =
        post.title[locale] || post.title.ar;

    const content = cleanBlogContent(
        rawContent,
        postTitle
    );

    const headings = extractHeadings(content);

    const contentWithIds = addHeadingIds(
        content,
        headings
    );

    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-10 lg:py-20">
            <article
                dir={isArabic ? "rtl" : "ltr"}
                className="min-w-0 text-(--theme-text)"
            >
                <div
                    className="
                        text-base leading-8 text-(--theme-text)/80
                        [&_a]:text-(--theme-primary) [&_a]:underline [&_a]:underline-offset-4

                        [&_blockquote]:my-8 [&_blockquote]:border-s-4 [&_blockquote]:border-(--theme-primary)
                        [&_blockquote]:bg-(--theme-backgroundColor) [&_blockquote]:px-6 [&_blockquote]:py-5
                        [&_blockquote]:text-lg [&_blockquote]:font-medium [&_blockquote]:leading-8

                        [&_figure]:my-8 [&_figure]:overflow-hidden [&_figure]:rounded-2xl
                        [&_figure_img]:m-0 [&_figure_img]:h-auto [&_figure_img]:w-full

                        [&_h2]:mb-3 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-(--theme-primary)
                        [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:text-(--theme-primary)

                        [&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl

                        [&_li]:relative [&_li]:mb-1.5 [&_li]:leading-8
                        [&_li:last-child]:mb-0

                        [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pe-7
                        [&_ol_ol]:my-1 [&_ol_ol]:pe-6

                        [&_p]:mb-3 [&_p]:leading-8
                        [&_p:last-child]:mb-0

                        [&_strong]:font-bold [&_strong]:text-(--theme-text)

                        [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pe-7
                        [&_ul_ul]:my-1 [&_ul_ul]:pe-6
                    "
                    dangerouslySetInnerHTML={{
                        __html: contentWithIds,
                    }}
                />
            </article>

            {headings.length > 0 && (
                <aside
                    className="lg:sticky hidden lg:block lg:top-28 lg:self-start"
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    <div className="rounded-2xl border border-(--theme-secondary)/10 bg-(--theme-backgroundColor) p-6">
                        <div className="relative mb-5 flex items-center justify-between gap-4">
                            <h2 className="text-base font-bold text-(--theme-text) ps-1.5">
                                {isArabic
                                    ? "جدول المحتويات"
                                    : "Table of Contents"}
                            </h2>

                            <span
                                className={`absolute ${isArabic ? "-right-2" : "-left-2"
                                    } h-10 w-1 rounded-full bg-(--theme-primary)`}
                            />
                        </div>

                        <nav>
                            <ol className="space-y-1">
                                {headings.map((heading, index) => (
                                    <li key={heading.id}>
                                        <a
                                            href={`#${heading.id}`}
                                            className={`block border-s-2 border-transparent py-2.5 text-sm leading-6 text-(--theme-text)/80 transition hover:border-(--theme-primary) hover:text-(--theme-primary)${heading.level === 3
                                                    ? " ps-5 text-xs"
                                                    : " ps-3"
                                                }`}
                                        >
                                            <span className="me-2 text-(--theme-primary)/85">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </aside>
            )}
        </div>
    );
}
