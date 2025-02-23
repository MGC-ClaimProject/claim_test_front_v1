interface SignupData {
    relation: string;
    name: string;
    phone: string;
    birth: string;
    gender: string;
    adConsents: {
        id: number;
        title: string;
        agreed: boolean;
    }[];
    memberId?: number;
}
interface SignupStore {
    formData: SignupData;
    setFormData: (data: Partial<SignupData>) => void;
    resetForm: () => void;
}
export declare const useSignupStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SignupStore>>;
export {};
