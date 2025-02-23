import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: {
            overlay: false, // ✅ HMR 오류로 인해 페이지 이동이 막히는 문제 해결
        },
    },
});
