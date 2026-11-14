// lib\data\landingPage\exhibitions.ts
import { adminDb } from "@/lib/firebase/admin";
import type { Exhibition, ExhibitionAboutCard, ExhibitionAboutSection, ExhibitionImage, ExhibitionLocation, ExhibitionMedia, ExhibitionPartner, ExhibitionSpeaker, ExhibitionStat, LocalizedText, ExhibitionCardData, } from "@/types/landingPage/exhibition";
import { cacheLife } from "next/cache";
import { getExhibitionStatus, } from "@/lib/utils/exhibition";

function normalizeLocalizedText(value: unknown,): LocalizedText {
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

export function normalizeExhibition(id: string, data: FirebaseFirestore.DocumentData,): Exhibition {
    const startDate = normalizeDate(data.start_date)?.slice(0, 10) ?? "";
    const endDate = normalizeDate(data.end_date)?.slice(0, 10) ?? "";

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

type ExhibitionBucket =
    | "ongoing"
    | "upcoming"
    | "finished"
    | "inactive";

const EXHIBITION_BUCKETS: ExhibitionBucket[] = [
    "ongoing",
    "upcoming",
    "finished",
    "inactive",
];

function normalizeExhibitionCard(id: string, data: FirebaseFirestore.DocumentData,): ExhibitionCardData {
    return {
        id,

        slug:
            typeof data.slug === "string"
                ? data.slug
                : id,

        title: normalizeLocalizedText(data.title),

        start_date:
            normalizeDate(data.start_date)?.slice(0, 10) ?? "",

        end_date:
            normalizeDate(data.end_date)?.slice(0, 10) ?? "",

        location: normalizeLocation(data.location),

        main_image: normalizeImage(data.main_image),
    };
}

async function getBucketCount(bucket: ExhibitionBucket, today: string,): Promise<number> {
    const snapshot = await getExhibitionBucketQuery(bucket, today,)
        .count()
        .get();

    return snapshot.data().count;
}

async function getBucketExhibitions(
    bucket: ExhibitionBucket,
    today: string,
    limit: number,
    offset = 0,
): Promise<ExhibitionCardData[]> {
    if (limit <= 0) {
        return [];
    }

    let query = getExhibitionBucketQuery(
        bucket,
        today,
    );

    if (offset > 0) {
        query = query.offset(offset);
    }

    const snapshot = await query
        .limit(limit)
        .get();

    return snapshot.docs.map((doc) =>
        normalizeExhibitionCard(
            doc.id,
            doc.data(),
        ),
    );
}

function getExhibitionBucketQuery(bucket: ExhibitionBucket, today: string,): FirebaseFirestore.Query {
    const collection = adminDb.collection("exhibitions");

    switch (bucket) {
        case "ongoing":
            return collection
                .where("is_active", "==", true)
                .where("start_date", "<=", today)
                .where("end_date", ">=", today)
                .orderBy("start_date", "desc");

        case "upcoming":
            return collection
                .where("is_active", "==", true)
                .where("start_date", ">", today)
                .orderBy("start_date", "asc");

        case "finished":
            return collection
                .where("is_active", "==", true)
                .where("end_date", "<", today)
                .orderBy("end_date", "desc");

        case "inactive":
            return collection
                .where("is_active", "==", false)
                .orderBy("start_date", "desc");
    }
}

export async function getExhibitions(): Promise<Exhibition[]> {
    "use cache";

    cacheLife("hours");

    const snapshot = await adminDb
        .collection("exhibitions")
        .get();

    const exhibitions = snapshot.docs.map((doc) =>
        normalizeExhibition(
            doc.id,
            doc.data(),
        ),
    );

    return exhibitions.sort((a, b) => {
        if (a.is_active !== b.is_active) {
            return a.is_active ? -1 : 1;
        }

        return b.start_date.localeCompare(a.start_date);
    });
}

export async function getExhibitionById(id: string,): Promise<Exhibition | null> {
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

export async function getExhibitionBySlug(slug: string,): Promise<Exhibition | null> {
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

export async function getPreviousEditions(currentExhibition: Exhibition,): Promise<Exhibition[]> {
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

export interface HomepageExhibitionsResult {
    exhibitions: ExhibitionCardData[];
    totalCount: number;
    statusCounts: {
        ongoing: number;
        upcoming: number;
        finished: number;
    };
}

export async function getHomepageExhibitions(today: string,): Promise<HomepageExhibitionsResult> {
    "use cache";

    cacheLife("hours");

    const buckets = [
        "ongoing",
        "upcoming",
        "finished",
        "inactive",
    ] as const;

    const [counts, results] = await Promise.all([
        Promise.all(
            buckets.map((bucket) =>
                getBucketCount(bucket, today),
            ),
        ),

        Promise.all(
            buckets.map((bucket) =>
                getBucketExhibitions(
                    bucket,
                    today,
                    6,
                ),
            ),
        ),
    ]);

    const exhibitions = results.flat();

    const statusCounts = {
        ongoing: counts[0],
        upcoming: counts[1],
        finished: counts[2],
    };

    return {
        exhibitions,
        totalCount: counts.reduce(
            (total, count) => total + count,
            0,
        ),
        statusCounts,
    };
}

export interface PaginatedExhibitionsResult {
    exhibitions: ExhibitionCardData[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export async function getPaginatedExhibitions(today: string, requestedPage: number, pageSize: number,): Promise<PaginatedExhibitionsResult> {
    "use cache";

    cacheLife("hours");

    const buckets = [
        "ongoing",
        "upcoming",
        "finished",
        "inactive",
    ] as const;

    const counts = await Promise.all(
        buckets.map((bucket) =>
            getBucketCount(bucket, today),
        ),
    );

    const totalCount = counts.reduce(
        (total, count) => total + count,
        0,
    );

    const totalPages = Math.ceil(
        totalCount / pageSize,
    );

    const currentPage = totalPages > 0
        ? Math.min(Math.max(requestedPage, 1), totalPages)
        : 1;

    const pageStart = (currentPage - 1) * pageSize;
    const pageEnd = pageStart + pageSize;

    let bucketStart = 0;

    const pageRequests = buckets.map(
        (bucket, index) => {
            const bucketEnd = bucketStart + counts[index];

            const overlapStart = Math.max(
                pageStart,
                bucketStart,
            );

            const overlapEnd = Math.min(
                pageEnd,
                bucketEnd,
            );

            const offset = Math.max(
                0,
                overlapStart - bucketStart,
            );

            const limit = Math.max(
                0,
                overlapEnd - overlapStart,
            );

            bucketStart = bucketEnd;

            return {
                bucket,
                offset,
                limit,
            };
        },
    );

    const results = await Promise.all(
        pageRequests.map(
            ({ bucket, offset, limit }) =>
                getBucketExhibitions(
                    bucket,
                    today,
                    limit,
                    offset,
                ),
        ),
    );

    return {
        exhibitions: results.flat(),
        totalCount,
        totalPages,
        currentPage,
    };
}