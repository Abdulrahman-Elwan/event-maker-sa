// lib/data/exhibitions/getExhibitionsData.ts

import { adminDb } from "@/lib/firebase/admin";

import type {
    ExhibitionsData,
    ExhibitionImage,
    LocalizedText,
} from "@/types/exhibitions/exhibitions";

function isRecord(value: unknown,): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function normalizeString(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function normalizeLocalizedText(value: unknown,): LocalizedText {
    const data = isRecord(value) ? value : {};

    return {
        ar: normalizeString(data.ar),
        en: normalizeString(data.en),
    };
}

function normalizeImage(value: unknown,
): ExhibitionImage {
    const data = isRecord(value) ? value : {};

    return {
        url: normalizeString(data.url),
        public_id: normalizeString(data.public_id),
    };
}

function normalizeDate(
    value: unknown,
): Date | null {
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

function normalizeExhibitionsData(
    data: Record<string, unknown>,
): ExhibitionsData {
    const hero = isRecord(data.hero)
        ? data.hero
        : {};

    const seo = isRecord(data.seo)
        ? data.seo
        : {};

    return {
        hero: {
            title: normalizeLocalizedText(hero.title),
            description: normalizeLocalizedText(
                hero.description,
            ),
            image: normalizeImage(hero.image),
        },

        seo: {
            title: normalizeLocalizedText(seo.title),
            description: normalizeLocalizedText(
                seo.description,
            ),
            keywords: normalizeLocalizedText(
                seo.keywords,
            ),
        },

        updated_at: normalizeDate(data.updated_at),
    };
}

export async function getExhibitionsData(): Promise<ExhibitionsData | null> {
    "use cache";

    const snapshot = await adminDb
        .collection("site_content")
        .doc("exhibitions")
        .get();

    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();

    if (!data) {
        return null;
    }

    return normalizeExhibitionsData(data);
}