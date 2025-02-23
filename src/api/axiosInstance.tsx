import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore.tsx";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

// ✅ 로그인 전 요청용 (액세스 토큰 없음)
export const client = axios.create({
  baseURL: backendBaseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ 로그인 후 요청용 (액세스 토큰 자동 추가)
export const auth = axios.create({
  baseURL: backendBaseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ 액세스 토큰 가져오기 함수
const getAccessToken = (): string | null => {
  return useAuthStore.getState().accessToken;
};

// ✅ `auth` 요청 인터셉터: 액세스 토큰 자동 추가
auth.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ 액세스 토큰 자동 갱신 함수
const refreshAccessToken = async () => {
  try {
    const response = await client.post("/users/token/refresh/", {}, { withCredentials: true });
    const newAccessToken = response.data.access_token;
    useAuthStore.getState().setAuth(newAccessToken, useAuthStore.getState().user!);
    return newAccessToken;
  } catch (error) {
    console.error("❌ 액세스 토큰 갱신 실패:", error);
    redirectToLoginPage();
  }
};


// ✅ 401 발생 시 자동으로 액세스 토큰 갱신 또는 로그인 페이지 이동
auth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshedAccessToken = await refreshAccessToken();

      if (refreshedAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
        return auth(originalRequest);
      } else {
        redirectToLoginPage();
      }
    }

    return Promise.reject(error);
  }
);

// ✅ 로그인 만료 시 `/login`으로 이동
let redirectToLogin: () => void;

export const setRedirectFunction = (redirectFunction: () => void) => {
  redirectToLogin = redirectFunction;
};

export const redirectToLoginPage = () => {
  if (redirectToLogin) {
    redirectToLogin();
  }
};
