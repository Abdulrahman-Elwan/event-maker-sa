// lib\data\homepage.ts
import { adminDb } from "@/lib/firebase/admin";
import { getExhibitionById } from "@/lib/data/landingPage/exhibitions";
import type { Exhibition } from "@/types/landingPage/exhibition";

/* Hero Slides */
export interface HeroSlide {
    id: number;
    image: string;

    ar: {
        eyebrow: string;
        title: string;
        description: string;
        primaryButton: string;
        secondaryButton: string;
    };

    en: {
        eyebrow: string;
        title: string;
        description: string;
        primaryButton: string;
        secondaryButton: string;
    };

    link1: string;
    link2: string;
}

function normalizeLocalizedContent(value: unknown): HeroSlide["ar"] | null {
    if (!value || typeof value !== "object") { return null; }

    const data = value as Record<string, unknown>;

    if (
        typeof data.eyebrow !== "string" ||
        typeof data.title !== "string" ||
        typeof data.description !== "string" ||
        typeof data.primaryButton !== "string" ||
        typeof data.secondaryButton !== "string"
    ) {
        return null;
    }

    return {
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
        primaryButton: data.primaryButton,
        secondaryButton: data.secondaryButton,
    };
}

function normalizeHeroSlide(value: unknown): HeroSlide | null {

    if (!value || typeof value !== "object") { return null; }

    const data = value as Record<string, unknown>;
    const ar = normalizeLocalizedContent(data.ar);
    const en = normalizeLocalizedContent(data.en);

    if (
        typeof data.id !== "number" ||
        typeof data.image !== "string" ||
        typeof data.link1 !== "string" ||
        typeof data.link2 !== "string" ||
        !ar ||
        !en
    ) {
        return null;
    }

    return {
        id: data.id,
        image: data.image,
        ar,
        en,
        link1: data.link1,
        link2: data.link2,
    };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    "use cache"
    const doc = await adminDb.collection("site_content").doc("home").get();

    if (!doc.exists) { return []; }

    const data = doc.data();

    if (!data?.hero || typeof data.hero !== "object") {
        return [];
    }

    const hero = data.hero as Record<string, unknown>;

    if (!Array.isArray(hero.slides)) {
        return [];
    }

    return hero.slides
        .map(normalizeHeroSlide)
        .filter((slide): slide is HeroSlide => slide !== null);
}

/* Home SEO */
export interface HomeSEO {
    title: {
        ar: string;
        en: string;
    };

    description: {
        ar: string;
        en: string;
    };

    keywords?: {
        ar: string;
        en: string;
    };
}

export async function getHomeSEO(): Promise<HomeSEO | null> {
    "use cache";

    const doc = await adminDb
        .collection("site_content")
        .doc("home")
        .get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();

    if (!data?.seo || typeof data.seo !== "object") {
        return null;
    }

    const seo = data.seo as Record<string, unknown>;

    const title = seo.title as Record<string, unknown> | undefined;
    const description = seo.description as Record<string, unknown> | undefined;
    const keywords = seo.keywords as Record<string, unknown> | undefined;

    if (
        !title ||
        !description ||
        typeof title.ar !== "string" ||
        !title.ar.trim() ||
        typeof title.en !== "string" ||
        !title.en.trim() ||
        typeof description.ar !== "string" ||
        !description.ar.trim() ||
        typeof description.en !== "string" ||
        !description.en.trim()
    ) {
        return null;
    }

    const validKeywords =
        keywords &&
        typeof keywords.ar === "string" &&
        typeof keywords.en === "string" &&
        keywords.ar.trim().length > 0 &&
        keywords.en.trim().length > 0;

    return {
        title: {
            ar: title.ar.trim(),
            en: title.en.trim(),
        },

        description: {
            ar: description.ar.trim(),
            en: description.en.trim(),
        },

        ...(validKeywords && {
            keywords: {
                ar: keywords.ar as string,
                en: keywords.en as string,
            },
        }),
    };
}

export interface HomepageSettings {
    mode: "company" | "exhibition";
    exhibition_id: string;
    landing_start_date: string;
}

export type HomepageExhibition = Exhibition;
export type HomepageData = | { mode: "company"; } | { mode: "exhibition"; exhibition: HomepageExhibition; };

export async function getHomepageSettings(): Promise<HomepageSettings> {
    "use cache"
    const doc = await adminDb.collection("site_settings").doc("settings_homepage").get();

    if (!doc.exists) {
        return {
            mode: "company",
            exhibition_id: "",
            landing_start_date: "",
        };
    }

    const data = doc.data();

    if (!data) {
        return {
            mode: "company",
            exhibition_id: "",
            landing_start_date: "",
        };
    }

    const mode: HomepageSettings["mode"] = data.mode === "exhibition" ? "exhibition" : "company";

    return {
        mode,
        exhibition_id: typeof data.exhibition_id === "string" ? data.exhibition_id : "",
        landing_start_date: typeof data.landing_start_date === "string" ? data.landing_start_date : "",
    };
}

export async function getHomepageData(): Promise<HomepageData> {
    const settings = await getHomepageSettings();
    if (settings.mode !== "exhibition" || !settings.exhibition_id) { return { mode: "company" }; }

    const exhibition = await getExhibitionById(settings.exhibition_id);
    if (!exhibition) { return { mode: "company" }; }

    return {
        mode: "exhibition",
        exhibition,
    };
}