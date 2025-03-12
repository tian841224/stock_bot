# ========== 第一階段 (Builder) ==========
FROM node:22-alpine AS builder
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 然後建立 prisma 目錄並複製 schema 文件
COPY prisma/ ./prisma/

# 安裝依賴
RUN npm ci --include=dev

# 複製整個專案
COPY . .

# 建構應用
RUN npx prisma generate \
    && npm run build \
    && rm -rf node_modules \
    && npm ci --omit=dev

# ========== 第二階段 (Runtime) ==========
FROM alpine:3.19 AS runtime

RUN apk add --no-cache \
    npm \  
    nodejs \
    chromium \
    chromium-chromedriver \
    libstdc++ \
   # sqlite \
    && chmod +x /usr/bin/chromedriver

WORKDIR /app

# 設定環境變數
ENV DOCKER_ENV=true \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ 

# 只複製必要檔案
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# 設定對外Port
EXPOSE 3000

# CMD ["node", "dist/main.js"]
CMD npx prisma db push && node dist/main.js