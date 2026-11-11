// lib\data\services\getServiceBySlug.ts
import type { ServiceItem } from "@/types/services/services";
import { getServicesData } from "./getServicesData";

export async function getServiceBySlug(
    slug: string,
): Promise<ServiceItem | null> {
    "use cache";

    if (!slug) {
        return null;
    }

    const data = await getServicesData();

    if (!Array.isArray(data?.services)) {
        return null;
    }

    return (
        data.services.find((item) => item?.slug === slug) ?? null
    );
}