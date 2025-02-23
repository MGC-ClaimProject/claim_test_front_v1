import { AuthState, ClaimData, Member, Insurance } from "../types/authTypes";
export type { ClaimData, Member, Insurance };
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
