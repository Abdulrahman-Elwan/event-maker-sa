export interface LocalizedText {
    ar: string;
    en: string;
}

export interface BlogCategory {
    id: string;
    name: LocalizedText;
    slug: string;
}

export interface BlogImage {
    url: string;
    publicId: string;
    alt: LocalizedText;
}

export interface BlogPost {
    id: string;
    title: LocalizedText;
    content: LocalizedText;
    coverImage: BlogImage;
    categories: BlogCategory[];
    seo: {
        metaTitle: LocalizedText;
        metaDescription: LocalizedText;
        slug: string;
    };
    status: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface BlogHero {
    title: LocalizedText;
    description: LocalizedText;
    image: BlogImage;
}

export interface BlogSeo {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText;
}

export interface BlogData {
    hero: BlogHero;
    seo: BlogSeo;
}

export interface BlogPostsResult {
    posts: BlogPost[];
    totalPosts: number;
    totalPages: number;
    currentPage: number;
}