// lib\data\about\getAboutData.ts
import { adminDb } from "@/lib/firebase/admin";

import type {
    AboutData,
    AboutImage,
    AboutStat,
    AboutTeamMember,
    AboutWhyUsFeature,
    LocalizedText,
} from "@/types/about/about";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function normalizeString(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function normalizeLocalizedText(
    value: unknown
): LocalizedText {
    const data = isRecord(value) ? value : {};

    return {
        ar: normalizeString(data.ar),
        en: normalizeString(data.en),
    };
}

function normalizeImage(
    value: unknown
): AboutImage {
    const data = isRecord(value) ? value : {};

    return {
        url: normalizeString(data.url),
        public_id: normalizeString(data.public_id),
    };
}

function normalizeStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (item): item is string =>
            typeof item === "string"
    );
}

function normalizeDate(value: unknown): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (
        isRecord(value) &&
        typeof value.toDate === "function"
    ) {
        const date = value.toDate();

        return date instanceof Date ? date : null;
    }

    return null;
}

/* -------------------------------------------------------------------------- */
/* Normalizers                                                                */
/* -------------------------------------------------------------------------- */

function normalizeStat(value: unknown): AboutStat {
    const data = isRecord(value) ? value : {};

    return {
        title: normalizeLocalizedText(data.title),
        value: normalizeString(data.value),
    };
}

function normalizeTeamMember(
    value: unknown
): AboutTeamMember {
    const data = isRecord(value) ? value : {};

    return {
        image: normalizeString(data.image),
        name: normalizeLocalizedText(data.name),
        position: normalizeLocalizedText(data.position),
    };
}

function normalizeWhyUsFeature(
    value: unknown
): AboutWhyUsFeature {
    const data = isRecord(value) ? value : {};

    return {
        title: normalizeLocalizedText(data.title),
        description: normalizeLocalizedText(data.description),
        icon: normalizeString(data.icon),
    };
}

/* -------------------------------------------------------------------------- */
/* About Data                                                                  */
/* -------------------------------------------------------------------------- */

function normalizeAboutData(
    data: Record<string, unknown>
): AboutData {
    const hero = isRecord(data.hero) ? data.hero : {};
    const content = isRecord(data.content) ? data.content : {};
    const partners = isRecord(data.partners) ? data.partners : {};
    const stats = isRecord(data.stats) ? data.stats : {};
    const team = isRecord(data.team) ? data.team : {};
    const whyUs = isRecord(data.whyUs) ? data.whyUs : {};
    const seo = isRecord(data.seo) ? data.seo : {};

    return {
        hero: {
            title: normalizeLocalizedText(hero.title),
            description: normalizeLocalizedText(hero.description),
            image: normalizeImage(hero.image),
        },

        content: {
            content_ar: normalizeString(content.content_ar),
            content_en: normalizeString(content.content_en),
            main_image: normalizeImage(content.main_image),
            secondary_image_1: normalizeImage(
                content.secondary_image_1
            ),
            secondary_image_2: normalizeImage(
                content.secondary_image_2
            ),
        },

        partners: {
            title: normalizeLocalizedText(partners.title),
            description: normalizeLocalizedText(
                partners.description
            ),
            official: normalizeStringArray(partners.official),
            others: normalizeStringArray(partners.others),
        },

        stats: {
            title: normalizeLocalizedText(stats.title),
            description: normalizeLocalizedText(
                stats.description
            ),
            stats: Array.isArray(stats.stats)
                ? stats.stats.map(normalizeStat)
                : [],
        },

        team: {
            title: normalizeLocalizedText(team.title),
            description: normalizeLocalizedText(
                team.description
            ),
            members: Array.isArray(team.members)
                ? team.members.map(normalizeTeamMember)
                : [],
        },

        whyUs: {
            title: normalizeLocalizedText(whyUs.title),
            description: normalizeLocalizedText(
                whyUs.description
            ),
            features: Array.isArray(whyUs.features)
                ? whyUs.features.map(normalizeWhyUsFeature)
                : [],
        },

        seo: {
            title: normalizeLocalizedText(seo.title),
            description: normalizeLocalizedText(
                seo.description
            ),
            keywords: normalizeLocalizedText(seo.keywords),
        },

        updated_at: normalizeDate(data.updated_at),
    };
}

/* -------------------------------------------------------------------------- */
/* Get About Data                                                              */
/* -------------------------------------------------------------------------- */
export async function getAboutData(): Promise<AboutData> {
    "use cache"
    const snapshot = await adminDb
        .collection("site_content")
        .doc("about")
        .get();

    if (!snapshot.exists) {
        return normalizeAboutData({});
    }

    const data = snapshot.data();

    if (!data) {
        return normalizeAboutData({});
    }

    return normalizeAboutData(data);
}
