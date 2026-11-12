// lib\data\siteSettings.ts
import { adminDb } from "@/lib/firebase/admin";
import type {
    ContactEmail,
    ContactPhone,
    ContactSettings,
    LocalizedText,
    SocialLink,
    SocialSettings,
} from "@/types/siteSettings";

function normalizeLocalizedText(
    value: unknown
): LocalizedText {
    if (!value || typeof value !== "object") {
        return {
            ar: "",
            en: "",
        };
    }

    const data = value as Record<string, unknown>;

    return {
        ar: typeof data.ar === "string" ? data.ar : "",
        en: typeof data.en === "string" ? data.en : "",
    };
}

function normalizePhone(
    value: unknown
): ContactPhone | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    if (
        typeof data.id !== "string" ||
        typeof data.number !== "string"
    ) {
        return null;
    }

    return {
        id: data.id,
        label:
            typeof data.label === "string"
                ? data.label
                : "",
        number: data.number,
        active: data.active === true,
    };
}

function normalizeEmail(
    value: unknown
): ContactEmail | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    if (
        typeof data.id !== "string" ||
        typeof data.address !== "string"
    ) {
        return null;
    }

    const location =
        data.location &&
        typeof data.location === "object"
            ? normalizeLocalizedText(data.location)
            : undefined;

    return {
        id: data.id,
        label:
            typeof data.label === "string"
                ? data.label
                : "",
        email: data.address,
        active: data.active === true,
        location,
        mapUrl:
            typeof data.mapUrl === "string"
                ? data.mapUrl
                : "",
    };
}

function normalizeSocial(
    value: unknown
): SocialLink | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    if (
        typeof data.id !== "string" ||
        typeof data.platform !== "string" ||
        typeof data.url !== "string"
    ) {
        return null;
    }

    return {
        id: data.id,
        label:
            typeof data.label === "string"
                ? data.label
                : "",
        platform: data.platform,
        url: data.url,
        active: data.active === true,
    };
}

export async function getContactSettings(): Promise<ContactSettings> {
    "use cache";

    const snapshot = await adminDb
        .collection("site_settings")
        .doc("settings_contact")
        .get();

    if (!snapshot.exists) {
        return {
            phones: [],
            emails: [],
            workingHours: {
                ar: "",
                en: "",
            },
        };
    }

    const data = snapshot.data() ?? {};

    const phones = Array.isArray(data.phones)
        ? data.phones
            .map(normalizePhone)
            .filter(
                (
                    phone
                ): phone is ContactPhone =>
                    phone !== null
            )
            .filter((phone) => phone.active)
        : [];

    const emails = Array.isArray(data.emails)
        ? data.emails
            .map(normalizeEmail)
            .filter(
                (
                    email
                ): email is ContactEmail =>
                    email !== null
            )
            .filter((email) => email.active)
        : [];

    return {
        phones,
        emails,
        workingHours: normalizeLocalizedText(
            data.workingHours
        ),
    };
}

export async function getSocialSettings(): Promise<SocialSettings> {
    "use cache"
    const snapshot = await adminDb
        .collection("site_settings")
        .doc("settings_social")
        .get();

    if (!snapshot.exists) {
        return {
            socials: [],
        };
    }

    const data = snapshot.data();

    const socials = Array.isArray(data?.socials)
        ? data.socials
            .map(normalizeSocial)
            .filter(
                (
                    social
                ): social is SocialLink =>
                    social !== null
            )
            .filter((social) => social.active)
        : [];

    return {
        socials,
    };
}

export async function getCompanyProfileUrl(): Promise<string | null> {
    "use cache";

    const snapshot = await adminDb
        .collection("site_settings")
        .doc("settings_company_profile")
        .get();

    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();
    const file = data?.file;

    if (
        !file ||
        typeof file.url !== "string" ||
        !file.url.trim()
    ) {
        return null;
    }

    return file.url;
}