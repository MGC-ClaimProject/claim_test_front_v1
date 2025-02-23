import { Insurance } from "../stores/useAuthStore";
declare const useFetchInsurances: (memberId?: string) => {
    insurances: Insurance[];
    loading: boolean;
    totalPremium: number;
    fetchInsurances: () => Promise<void>;
};
export default useFetchInsurances;
