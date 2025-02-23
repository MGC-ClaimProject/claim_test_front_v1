# ✅ React 빌드 (Node.js 18 사용)
FROM node:18 AS builder

WORKDIR /app

# ✅ package.json & package-lock.json 먼저 복사 후 `npm install`
COPY package.json package-lock.json ./
RUN npm install

# ✅ 프로젝트 코드 복사 후 `npm run build`
COPY . .
RUN npm run build

# ✅ 2단계: Nginx를 사용하여 정적 파일 서빙
FROM nginx:alpine

# ✅ 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
