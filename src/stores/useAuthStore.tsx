// 📂 src/stores/useAuthStore.ts
import { create } from "zustand";
import { auth } from "../api/axiosInstance";
import { AuthState, ClaimData, Member, Insurance } from "../types/authTypes";

export type { ClaimData, Member, Insurance};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  member: JSON.parse(localStorage.getItem("member") || "null"),
  members: [],
  claimData: JSON.parse(localStorage.getItem("claimData") || "null"),
  selectedMemberId: null,
  isAuthenticated: !!localStorage.getItem("access_token"), // ✅ 로그인 여부 추가

  setAuth: (accessToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true });

  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("member");
    localStorage.removeItem("claimData");
    set({
      accessToken: null,
      user: null,
      member: null,
      claimData: null,
      members: [],
      selectedMemberId: null,
      isAuthenticated: false,
    });

  },

  fetchUser: async () => {
    try {
      const response = await auth.get("/user/me/");
      localStorage.setItem("user", JSON.stringify(response.data));
      set({ user: response.data });
    } catch (error) {
      console.error("❌ 사용자 정보 가져오기 실패:", error);
    }
  },

  fetchMembers: async () => {
    try {
      const response = await auth.get("/members/");
      set({ members: response.data });
    } catch (error) {
      console.error("❌ 가족 멤버 가져오기 실패:", error);
    }
  },

  fetchMember: async (id: number) => {
    try {
      const response = await auth.get(`/members/${id}/`);
      set({ member: response.data });
    } catch (error) {
      console.error(`❌ 멤버 ${id} 정보 가져오기 실패:`, error);
    }
  },

  setSelectedMemberId: (id) => set({ selectedMemberId: id }),

  setClaimData: (data: ClaimData | null) => {
    if (data === null) {
      localStorage.removeItem("claimData");
    } else {
      localStorage.setItem("claimData", JSON.stringify(data));
    }
    set({ claimData: data });
  },

  checkAuth: async () => {

    try {
      const token = localStorage.getItem("access_token");
      const isAuthenticated = !!token;
      set({ isAuthenticated }); // ✅ Zustand 상태 업데이트

      return isAuthenticated;
    } catch (error) {
      console.error("❌ 로그인 상태 확인 실패:", error);
      set({ isAuthenticated: false });
      return false;
    }
  },

  login: (token) => {
    localStorage.setItem("access_token", token);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    try {
      const response = await auth.post("/users/logout/");
      if (response.status === 200) {
        alert("로그아웃 성공! 로그인 페이지로 이동합니다.");
      } else {
        alert("로그아웃 실패. 로그인 페이지로 이동합니다.");
      }
    } catch (error) {
      console.error("❌ 로그아웃 오류:", error);
      alert("로그아웃 중 오류 발생! 로그인 페이지로 이동합니다.");
    } finally {
      set((state) => {
        state.clearAuth();
        return { isAuthenticated: false };
      });
      window.location.href = "/login";
    }
  },
}));
