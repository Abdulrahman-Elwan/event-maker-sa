
import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { HomepageSettings } from "@/lib/data/homepage";
import type { ThemeSettings } from "@/types/theme";

const themeFields: (keyof ThemeSettings)[] = [
    "arabicFont",
    "englishFont",
    "backgroundColor",
    "primaryColor",
    "secondaryColor",
    "textColor",
];

type ThemeDocumentData = {
    company: ThemeSettings;
    exhibitions: Record<string, Partial<ThemeSettings>>;
};

/* Validate Plain Object */
function isThemeObject(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

/* Normalize Complete Theme */
function normalizeTheme(value: unknown): ThemeSettings {
    if (!isThemeObject(value)) {
        throw new Error("Invalid theme data received from Firestore.");
    }

    const theme = {} as ThemeSettings;

    for (const field of themeFields) {
        const fieldValue = value[field];

        if (
            typeof fieldValue !== "string" ||
            !fieldValue.trim()
        ) {
            throw new Error(
                `Theme is missing required field: ${field}`
            );
        }

        theme[field] = fieldValue;
    }

    return theme;
}

/* Normalize Partial Theme */
function normalizePartialTheme(
    value: unknown
): Partial<ThemeSettings> {
    if (!isThemeObject(value)) {
        return {};
    }

    const theme: Partial<ThemeSettings> = {};

    for (const field of themeFields) {
        const fieldValue = value[field];

        if (
            typeof fieldValue === "string" &&
            fieldValue.trim()
        ) {
            theme[field] = fieldValue;
        }
    }

    return theme;
}

/* Get Theme Document */
async function getThemeDocument(): Promise<ThemeDocumentData> {
    "use cache";

    const snapshot = await adminDb
        .collection("site_settings")
        .doc("settings_themes")
        .get();

    if (!snapshot.exists) {
        throw new Error("Theme settings document not found.");
    }

    const data = snapshot.data();

    if (!data) {
        throw new Error("Theme settings data is empty.");
    }

    const company = normalizeTheme(data.company);

    const rawExhibitions = isThemeObject(data.exhibitions)
        ? data.exhibitions
        : {};

    const exhibitions: Record<string, Partial<ThemeSettings>> = {};

    for (const [id, value] of Object.entries(rawExhibitions)) {
        exhibitions[id] = normalizePartialTheme(value);
    }

    // Return only normalized plain objects.
    // Firestore metadata such as updated_at is intentionally excluded.
    return {
        company,
        exhibitions,
    };
}

/* Get Company Theme */
function getCompanyTheme(
    data: ThemeDocumentData
): ThemeSettings {
    return data.company;
}

/* Get Exhibition Theme */
function getExhibitionTheme(
    data: ThemeDocumentData,
    exhibitionId: string
): Partial<ThemeSettings> | null {
    if (!exhibitionId) return null;

    return data.exhibitions[exhibitionId] ?? null;
}

/* Get Active Theme */
export async function getActiveTheme(
    settings: HomepageSettings
): Promise<ThemeSettings> {
    const data = await getThemeDocument();

    const companyTheme = getCompanyTheme(data);

    const exhibitionTheme = getExhibitionTheme(
        data,
        settings.exhibition_id
    );

    if (settings.mode === "exhibition" && exhibitionTheme) {
        return {
            ...companyTheme,
            ...exhibitionTheme,
        };
    }

    return companyTheme;
}
