export interface AboutStat {
    title: {
        ar: string;
        en: string;
    };
    value: string;
}

export interface AboutStats {
    title: {
        ar: string;
        en: string;
    };
    description: {
        ar: string;
        en: string;
    };
    stats: AboutStat[];
}