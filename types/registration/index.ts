// types\registration\index.ts
import type { LocalizedText } from "@/types/landingPage/exhibition";

/* Exhibition Snapshot */
export interface RegistrationExhibition {
    id: string;
    slug: string;
    title: LocalizedText;
    series_id: string;
    version: string;
    start_date: string;
    end_date: string;
}

/* Registration Types */
export type RegistrationType = "visitor" | "exhibitor";
export interface RegistrationBase {
    name: string;
    email: string;
    phone: string;
    inquiries: string;
}
export interface VisitorRegistrationFormValues extends RegistrationBase {
    opportunity_type: string;
}

export interface ExhibitorRegistrationFormValues extends RegistrationBase {
    company_name: string;
    job_title: string;
    business_type: string;
    required_space: string;
}

export interface RegistrationPayload<T extends RegistrationBase> {
    registrationType: RegistrationType;
    exhibition: RegistrationExhibition;
    locale: "ar" | "en";
    data: T;
}