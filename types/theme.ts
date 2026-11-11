// types\theme.ts
export interface ThemeSettings {
    arabicFont: string;
    englishFont: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
}

export interface ThemeDocument {
    company: ThemeSettings;
    exhibitions: Record<string, Partial<ThemeSettings>>;
    updated_at?: FirebaseFirestore.Timestamp;
}