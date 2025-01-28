# Use the official Node.js 16 image as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    unzip \
    build-essential  # 加入這行，確保有基本建構工具

# 直接下載並安裝 ChromeDriver 和 Chromium
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE) \
    && wget -N https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VERSION}/chromedriver_linux64.zip -P ~/tmp \
    && unzip ~/tmp/chromedriver_linux64.zip -d ~/tmp \
    && mv ~/tmp/chromedriver /usr/local/bin/chromedriver \
    && chmod +x /usr/local/bin/chromedriver

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with specific flags
RUN npm install --legacy-peer-deps

# Explicitly install form-data
# RUN npm install form-data

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Clean up to reduce image size
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]