// lib\data\getSessions.ts
import { adminDb } from "@/lib/firebase/admin";
import type { Session } from "@/types/sessions";
interface SessionDocument {
    id?: unknown;
    title?: unknown;
    poster?: unknown;
    youtubeUrl?: unknown;
    created_at?: unknown;
    updated_at?: unknown;
}

interface SessionsDocument {
    sessions?: unknown;
}

function normalizeLocalizedText(
    value: unknown
): { ar: string; en: string } {
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

function normalizeSession(
    id: string,
    data: SessionDocument
): Session | null {
    const poster =
        data.poster &&
        typeof data.poster === "object"
            ? (data.poster as Record<string, unknown>)
            : null;

    const youtubeUrl =
        typeof data.youtubeUrl === "string"
            ? data.youtubeUrl.trim()
            : "";

    const posterUrl =
        poster &&
        typeof poster.url === "string"
            ? poster.url.trim()
            : "";

    if (!youtubeUrl || !posterUrl) {
        return null;
    }

    return {
        id,
        title: normalizeLocalizedText(data.title),
        poster: {
            public_id:
                poster &&
                typeof poster.public_id === "string"
                    ? poster.public_id
                    : "",
            url: posterUrl,
        },
        youtubeUrl,
        created_at:
            typeof data.created_at === "string"
                ? data.created_at
                : null,
        updated_at:
            typeof data.updated_at === "string"
                ? data.updated_at
                : null,
    };
}

export async function getSessions(): Promise<Session[]> {
    "use cache"
    const snapshot = await adminDb
        .collection("site_content")
        .doc("sessions")
        .get();

    if (!snapshot.exists) {
        return [];
    }

    const data = snapshot.data() as SessionsDocument;

    if (!Array.isArray(data.sessions)) {
        return [];
    }

    return data.sessions
        .map((item) => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const session = item as SessionDocument;

            const id =
                typeof session.id === "string"
                    ? session.id
                    : "";

            if (!id) {
                return null;
            }

            return normalizeSession(id, session);
        })
        .filter(
            (session): session is Session =>
                session !== null
        )
        .sort((a, b) => {
            const dateA = a.created_at
                ? new Date(a.created_at).getTime()
                : 0;

            const dateB = b.created_at
                ? new Date(b.created_at).getTime()
                : 0;

            return dateB - dateA;
        });
}