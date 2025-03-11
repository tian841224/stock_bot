# ========== 第一階段 (Builder) ==========
FROM node:22-alpine AS builder
WORKDIR /app

# 只複製依賴相關檔案
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --include=dev

# 複製源碼並構建
COPY . .
RUN npx prisma genlerate \
    && npm run build \
    && rm -rf node_modules \
    && npm ci --omit=dev

# ========== 第二階段 (Runtime) ==========
FROM alpine:3.19 AS runtime

RUN apk add --no-cache \
    nodejs \
    chromium \
    chromium-chromedriver \
    libstdc++ \
    sqlite \
    && chmod +x /usr/bin/chromedriver

WORKDIR /app
# 設定環境變數
ENV DOCKER_ENV=true \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ 

# 只複製必要檔案
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]