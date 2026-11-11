// lib\data\services.ts
import { adminDb } from "@/lib/firebase/admin";
import type { Service, ServiceImage, LocalizedText } from "@/types/service";

function normalizeImage(value: unknown): ServiceImage | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const image = value as Record<string, unknown>;

    return {
        public_id:
            typeof image.public_id === "string"
                ? image.public_id
                : "",
        url:
            typeof image.url === "string"
                ? image.url
                : "",
    };
}

function normalizeLocalizedText(value: unknown): LocalizedText {
    if (!value || typeof value !== "object") {
        return {
            ar: "",
            en: "",
        };
    }

    const text = value as Record<string, unknown>;

    return {
        ar: typeof text.ar === "string" ? text.ar : "",
        en: typeof text.en === "string" ? text.en : "",
    };
}

function normalizeImages(value: unknown): ServiceImage[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(normalizeImage)
        .filter((image): image is ServiceImage => Boolean(image?.url));
}

function normalizeLocalizedArray(value: unknown): LocalizedText[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(normalizeLocalizedText);
}

function normalizeService(
    id: string,
    data: FirebaseFirestore.DocumentData
): Service {
    const content = data.content ?? {};
    const main = content.main ?? {};
    const features = main.features ?? {};
    const introduction = content.introduction ?? {};
    const usageFields = content.usageFields ?? {};

    return {
        id,
        slug: typeof data.slug === "string" ? data.slug : "",
        order: typeof data.order === "number" ? data.order : 999,

        title: normalizeLocalizedText(data.title),

        shortDescription: normalizeLocalizedText(
            data.shortDescription
        ),

        mainDescription: normalizeLocalizedText(
            data.mainDescription
        ),

        coverImage: normalizeImage(data.coverImage),

        content: {
            main: {
                cta: normalizeLocalizedText(main.cta),

                features: {
                    title: normalizeLocalizedText(
                        features.title
                    ),

                    description: normalizeLocalizedText(
                        features.description
                    ),

                    items: normalizeLocalizedArray(
                        features.items
                    ),
                },
            },

            introduction: {
                title: normalizeLocalizedText(
                    introduction.title
                ),

                description: normalizeLocalizedText(
                    introduction.description
                ),

                images: normalizeImages(
                    introduction.images
                ),
            },

            usageFields: {
                items: normalizeLocalizedArray(
                    usageFields.items
                ),

                images: normalizeImages(
                    usageFields.images
                ),
            },
        },

        gallery: normalizeImages(data.gallery),

        usageFields: {
            items: normalizeLocalizedArray(
                data.usageFields?.items
            ),

            images: normalizeImages(
                data.usageFields?.images
            ),
        },
    };
}

export async function getServices(): Promise<Service[]> {
    "use cache"
    const snapshot = await adminDb
        .collection("site_content")
        .doc("services")
        .get();

    if (!snapshot.exists) {
        return [];
    }

    const data = snapshot.data();

    const services = (data?.services ?? []) as Record<string, unknown>[];

    return services
        .map((service) =>
            normalizeService(
                String(service.id ?? ""),
                service
            )
        )
        .sort((a, b) => a.order - b.order);
}