import { ClaimData } from "../stores/useAuthStore";
declare const useClaimNavigation: () => {
    handleNext: (updatedData: Partial<ClaimData>, nextPath: string) => void;
};
export default useClaimNavigation;
