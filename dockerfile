# ========== 第一階段 (Builder) ==========
FROM node:22-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，並安裝所有相依套件（包含開發環境）
COPY package*.json ./
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && npm install

# 複製應用程式程式碼，並進行編譯
COPY . .
RUN npm run build

# ========== 第二階段 (Runtime) ==========
FROM node:22-alpine AS runtime

# 設定工作目錄
WORKDIR /app

# 設定 Puppeteer 和 Chromium 相關環境變數，避免執行錯誤
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ 

# 只安裝 Chromium 及其他執行時所需的工具（不包含開發工具）
RUN apk add --no-cache \
    bash \
    curl \
    wget \
    unzip \
    chromium \
    chromium-chromedriver \
    libstdc++

# 設定 ChromeDriver 的權限
RUN chmod +x /usr/bin/chromedriver

# **從第一階段 (builder) 複製檔案
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

# 開啟 3000 端口
EXPOSE 3000

# 設定容器啟動時執行的指令
CMD ["node", "dist/main.js"]
