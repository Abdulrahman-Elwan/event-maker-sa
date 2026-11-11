import { adminDb } from "@/lib/firebase/admin";

import type { ExhibitionSector } from "@/types/landingPage/sector";

interface SectorDocument {
    slug?: string;
    title?: {
        ar?: string;
        en?: string;
    };
    meta_description?: {
        ar?: string;
        en?: string;
    };
    is_active?: boolean;
    created_at?: {
        toDate?: () => Date;
    } | null;
    updated_at?: {
        toDate?: () => Date;
    } | null;
}

function normalizeSector(
    id: string,
    data: SectorDocument,
): ExhibitionSector {
    return {
        id,
        slug: data.slug ?? "",
        title: {
            ar: data.title?.ar ?? "",
            en: data.title?.en ?? "",
        },
        meta_description: {
            ar: data.meta_description?.ar ?? "",
            en: data.meta_description?.en ?? "",
        },
        is_active: data.is_active ?? false,
        created_at:
            data.created_at?.toDate?.()?.toISOString() ??
            null,
        updated_at:
            data.updated_at?.toDate?.()?.toISOString() ??
            null,
    };
}

export async function getExhibitionSectors(
    sectorIds: string[],
): Promise<ExhibitionSector[]> {
    "use cache";

    if (!sectorIds.length) {
        return [];
    }

    const uniqueIds = [
        ...new Set(sectorIds),
    ];

    const snapshots = await Promise.all(
        uniqueIds.map((id) =>
            adminDb
                .collection("exhibition_sectors")
                .doc(id)
                .get(),
        ),
    );

    const sectorsById =
        new Map<string, ExhibitionSector>();

    snapshots.forEach((snapshot) => {
        if (!snapshot.exists) {
            return;
        }

        const data =
            snapshot.data() as SectorDocument;

        if (data.is_active === false) {
            return;
        }

        sectorsById.set(
            snapshot.id,
            normalizeSector(
                snapshot.id,
                data,
            ),
        );
    });

    return sectorIds
        .map((id) =>
            sectorsById.get(id),
        )
        .filter(
            (
                sector,
            ): sector is ExhibitionSector =>
                Boolean(sector),
        );
}