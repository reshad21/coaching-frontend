export interface ISiteSetting {
    id: string;
    brandName: string;
    logo: string;
    favicon: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISiteSettingFormData {
    brandName: string;
    logo: File | null;
    favicon: File | null;
}

export interface ISiteSettingPayload {
    brandName: string;
    logo: string;
    favicon: string;
}
