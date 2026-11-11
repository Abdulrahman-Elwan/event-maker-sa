// lib\data\landingPage\exhibitions.ts
import { adminDb } from "@/lib/firebase/admin";

import type {
    Exhibition,
    ExhibitionAboutCard,
    ExhibitionAboutSection,
    ExhibitionImage,
    ExhibitionLocation,
    ExhibitionMedia,
    ExhibitionPartner,
    ExhibitionSpeaker,
    ExhibitionStat,
    LocalizedText,
} from "@/types/landingPage/exhibition";

function normalizeLocalizedText(
    value: unknown,
): LocalizedText {
    if (!value || typeof value !== "object") {
        return {
            ar: "",
            en: "",
        };
    }

    const data = value as Record<string, unknown>;

    return {
        ar:
            typeof data.ar === "string"
                ? data.ar
                : "",
        en:
            typeof data.en === "string"
                ? data.en
                : "",
    };
}

function normalizeImage(
    value: unknown,
): ExhibitionImage | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    if (
        typeof data.url !== "string" ||
        !data.url.trim()
    ) {
        return null;
    }

    return {
        public_id:
            typeof data.public_id === "string"
                ? data.public_id
                : "",
        url: data.url,
    };
}

function normalizeDate(
    value: unknown,
): string | null {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof (
            value as {
                toDate?: unknown;
            }
        ).toDate === "function"
    ) {
        try {
            return (
                value as {
                    toDate: () => Date;
                }
            ).toDate().toISOString();
        } catch {
            return null;
        }
    }

    return null;
}

function normalizeLocation(
    value: unknown,
): ExhibitionLocation {
    if (!value || typeof value !== "object") {
        return {
            address: {
                ar: "",
                en: "",
            },
            google_map: "",
        };
    }

    const data = value as Record<string, unknown>;

    return {
        address: normalizeLocalizedText(
            data.address,
        ),
        google_map:
            typeof data.google_map === "string"
                ? data.google_map
                : "",
    };
}

function normalizeStats(
    value: unknown,
): ExhibitionStat[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (
                item,
            ): item is Record<string, unknown> =>
                !!item &&
                typeof item === "object",
        )
        .map((item) => ({
            value:
                typeof item.value === "string"
                    ? item.value
                    : typeof item.value === "number"
                        ? String(item.value)
                        : "",
            title: normalizeLocalizedText(
                item.title,
            ),
        }))
        .filter(
            (stat) =>
                stat.value ||
                stat.title.ar ||
                stat.title.en,
        );
}

function normalizeAboutCard(
    value: unknown,
): ExhibitionAboutCard | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    const title = normalizeLocalizedText(
        data.title,
    );

    const description =
        normalizeLocalizedText(
            data.description,
        );

    const icon =
        typeof data.icon === "string"
            ? data.icon
            : "";

    if (
        !title.ar &&
        !title.en &&
        !description.ar &&
        !description.en &&
        !icon
    ) {
        return null;
    }

    return {
        title,
        description,
        icon,
    };
}

function normalizeAboutSection(
    value: unknown,
): ExhibitionAboutSection {
    if (!value || typeof value !== "object") {
        return {
            cards: [],
        };
    }

    const data = value as Record<string, unknown>;

    const cards = Array.isArray(data.cards)
        ? data.cards
            .map(normalizeAboutCard)
            .filter(
                (
                    card,
                ): card is ExhibitionAboutCard =>
                    card !== null,
            )
        : [];

    return {
        cards,
    };
}

function normalizeGallery(
    value: unknown,
): ExhibitionMedia[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item): ExhibitionMedia | null => {
            const image = normalizeImage(item);

            if (!image) {
                return null;
            }

            const url = image.url.toLowerCase();

            const isVideo =
                url.includes("/video/upload/") ||
                /\.(mp4|webm|mov|m4v)(\?|$)/i.test(
                    url,
                );

            return {
                ...image,
                type: isVideo
                    ? "video"
                    : "image",
            };
        })
        .filter(
            (
                item,
            ): item is ExhibitionMedia =>
                item !== null,
        );
}

function normalizeSpeaker(
    value: unknown,
    index: number,
): ExhibitionSpeaker | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    const name = normalizeLocalizedText(
        data.name ?? data.title,
    );

    const title = normalizeLocalizedText(
        data.title ??
        data.job_title ??
        data.role,
    );

    const image = normalizeImage(
        data.image ??
        data.photo ??
        data.avatar,
    );

    const id =
        typeof data.id === "string"
            ? data.id
            : String(index);

    if (
        !name.ar &&
        !name.en &&
        !title.ar &&
        !title.en &&
        !image
    ) {
        return null;
    }

    return {
        id,
        name,
        title,
        image,
    };
}

function normalizeSpeakers(
    value: unknown,
): ExhibitionSpeaker[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item, index) =>
            normalizeSpeaker(item, index),
        )
        .filter(
            (
                speaker,
            ): speaker is ExhibitionSpeaker =>
                speaker !== null,
        );
}

function normalizePartner(
    value: unknown,
    index: number,
): ExhibitionPartner | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    const logo = normalizeImage(
        data.logo ??
        data.image ??
        data,
    );

    if (!logo) {
        return null;
    }

    const nameValue =
        data.name ??
        data.title;

    const name =
        nameValue &&
        typeof nameValue === "object"
            ? normalizeLocalizedText(nameValue)
            : undefined;

    return {
        id:
            typeof data.id === "string"
                ? data.id
                : String(index),
        name,
        logo,
    };
}

function normalizePartners(
    value: unknown,
): ExhibitionPartner[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item, index) =>
            normalizePartner(item, index),
        )
        .filter(
            (
                partner,
            ): partner is ExhibitionPartner =>
                partner !== null,
        );
}

function normalizePortfolioPdf(
    value: unknown,
): Exhibition["portfolio_pdf"] {
    if (!value || typeof value !== "object") {
        return null;
    }

    const data = value as Record<string, unknown>;

    if (
        typeof data.url !== "string" ||
        !data.url.trim()
    ) {
        return null;
    }

    return {
        public_id:
            typeof data.public_id === "string"
                ? data.public_id
                : "",
        url: data.url,
        original_filename:
            typeof data.original_filename === "string"
                ? data.original_filename
                : undefined,
        format:
            typeof data.format === "string"
                ? data.format
                : undefined,
        bytes:
            typeof data.bytes === "number"
                ? data.bytes
                : undefined,
    };
}

export function normalizeExhibition(
    id: string,
    data: FirebaseFirestore.DocumentData,
): Exhibition {
    const startDate =
        normalizeDate(data.start_date) ?? "";

    const endDate =
        normalizeDate(data.end_date) ?? "";

    return {
        id,

        slug:
            typeof data.slug === "string"
                ? data.slug
                : id,

        title: normalizeLocalizedText(
            data.title,
        ),

        description:
            normalizeLocalizedText(
                data.description,
            ),

        meta: normalizeLocalizedText(
            data.meta,
        ),

        start_date: startDate,
        end_date: endDate,

        location: normalizeLocation(
            data.location,
        ),

        category_ids:
            Array.isArray(data.category_ids)
                ? data.category_ids.filter(
                    (
                        value: unknown,
                    ): value is string =>
                        typeof value === "string",
                )
                : [],

        sector_ids:
            Array.isArray(data.sector_ids)
                ? data.sector_ids.filter(
                    (
                        value: unknown,
                    ): value is string =>
                        typeof value === "string",
                )
                : [],

        series_id:
            typeof data.series_id === "string"
                ? data.series_id
                : "",

        speakers: normalizeSpeakers(
            data.speakers,
        ),

        partners: normalizePartners(
            data.partners,
        ),

        stats: normalizeStats(
            data.stats,
        ),

        about_section:
            normalizeAboutSection(
                data.about_section,
            ),

        main_image:
            normalizeImage(
                data.main_image,
            ),

        main_video:
            normalizeImage(
                data.main_video,
            ),

        exhibition_logo:
            normalizeImage(
                data.exhibition_logo,
            ),

        portfolio_pdf:
            normalizePortfolioPdf(
                data.portfolio_pdf,
            ),

        gallery:
            normalizeGallery(
                data.gallery,
            ),

        is_active:
            data.is_active !== false,

        version:
            typeof data.version === "string"
                ? data.version
                : "",

        created_at:
            normalizeDate(
                data.created_at,
            ),

        updated_at:
            normalizeDate(
                data.updated_at,
            ),
    };
}

export async function getExhibitions(): Promise<Exhibition[]> {
    "use cache";

    const snapshot = await adminDb
        .collection("exhibitions")
        .get();

    const exhibitions = snapshot.docs
        .map((doc) =>
            normalizeExhibition(
                doc.id,
                doc.data(),
            ),
        )
        .filter(
            (exhibition) =>
                exhibition.is_active,
        );

    return exhibitions.sort((a, b) =>
        b.start_date.localeCompare(
            a.start_date,
        ),
    );
}

export async function getExhibitionById(
    id: string,
): Promise<Exhibition | null> {
    "use cache";

    if (!id) {
        return null;
    }

    const doc = await adminDb
        .collection("exhibitions")
        .doc(id)
        .get();

    if (!doc.exists) {
        return null;
    }

    const exhibition =
        normalizeExhibition(
            doc.id,
            doc.data() ?? {},
        );

    if (!exhibition.is_active) {
        return null;
    }

    return exhibition;
}

export async function getExhibitionBySlug(
    slug: string,
): Promise<Exhibition | null> {
    "use cache";

    if (!slug) {
        return null;
    }

    const snapshot = await adminDb
        .collection("exhibitions")
        .where("slug", "==", slug)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];

    const exhibition =
        normalizeExhibition(
            doc.id,
            doc.data(),
        );

    if (!exhibition.is_active) {
        return null;
    }

    return exhibition;
}

export async function getPreviousEditions(
    currentExhibition: Exhibition,
): Promise<Exhibition[]> {
    "use cache";

    if (
        !currentExhibition.series_id ||
        !currentExhibition.start_date
    ) {
        return [];
    }

    const exhibitions = await getExhibitions();

    return exhibitions
        .filter((exhibition) => {
            if (
                exhibition.id ===
                currentExhibition.id
            ) {
                return false;
            }

            if (
                exhibition.series_id !==
                currentExhibition.series_id
            ) {
                return false;
            }

            if (!exhibition.end_date) {
                return false;
            }

            return (
                exhibition.end_date <
                currentExhibition.start_date
            );
        })
        .sort((a, b) =>
            b.start_date.localeCompare(
                a.start_date,
            ),
        );
}