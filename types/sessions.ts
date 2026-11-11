export interface LocalizedText {
    ar: string;
    en: string;
}

export interface SessionPoster {
    public_id: string;
    url: string;
}

export interface Session {
    id: string;
    title: LocalizedText;
    poster: SessionPoster;
    youtubeUrl: string;
    created_at: string | null;
    updated_at: string | null;
}