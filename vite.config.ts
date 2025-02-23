import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ 빌드 시 정적 파일 경로를 `/src/static/frontend/`로 설정
export default defineConfig({
  plugins: [react()],
  base: "/src/static/frontend/", // ✅ index.html 내 정적 파일 경로 지정
  build: {
    outDir: "dist", // ✅ 빌드 디렉토리 유지
    manifest: true, // ✅ 정적 파일 매핑을 위한 manifest.json 생성
    rollupOptions: {
      input: "/index.html", // ✅ index.html을 빌드 대상으로 설정
    },
  },
});
