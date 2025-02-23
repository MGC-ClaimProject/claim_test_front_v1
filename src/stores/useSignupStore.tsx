import { create } from "zustand";

interface SignupData {
  relation: string;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  adConsents: { id: number; title: string; agreed: boolean }[];
  memberId?: number;
}

interface SignupStore {
  formData: SignupData;
  setFormData: (data: Partial<SignupData>) => void;
  resetForm: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  formData: {
    relation: "",
    name: "",
    phone: "",
    birth: "",
    gender: "",
    adConsents: [],
  },

  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  resetForm: () =>
    set({
      formData: {
        relation: "",
        name: "",
        phone: "",
        birth: "",
        gender: "",
        adConsents: [],
      },
    }),
}));
