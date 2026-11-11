// lib\data\services\getServicesData.ts
import { adminDb } from "@/lib/firebase/admin";
import type { ServicesData } from "@/types/services/services";

function serializeFirestoreData(value: unknown): unknown {
    if (value === null || value === undefined) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(serializeFirestoreData);
    }

    if (typeof value !== "object") {
        return value;
    }

    const objectValue = value as Record<string, unknown>;

    // Firestore Timestamp instance
    if (typeof objectValue.toDate === "function") {
        return (objectValue.toDate as () => Date)().toISOString();
    }

    // Firestore Timestamp represented by its internal fields
    const seconds =
        typeof objectValue._seconds === "number"
            ? objectValue._seconds
            : objectValue.seconds;

    const nanoseconds =
        typeof objectValue._nanoseconds === "number"
            ? objectValue._nanoseconds
            : objectValue.nanoseconds;

    if (
        typeof seconds === "number" &&
        typeof nanoseconds === "number"
    ) {
        return new Date(
            seconds * 1000 + nanoseconds / 1_000_000,
        ).toISOString();
    }

    // Convert nested objects into regular plain objects
    return Object.fromEntries(
        Object.entries(objectValue).map(([key, nestedValue]) => [
            key,
            serializeFirestoreData(nestedValue),
        ]),
    );
}

export async function getServicesData(): Promise<ServicesData | null> {
    "use cache";

    const snapshot = await adminDb
        .collection("site_content")
        .doc("services")
        .get();

    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();

    if (!data) {
        return null;
    }

    return serializeFirestoreData(data) as ServicesData;
}