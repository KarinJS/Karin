FROM node:lts-slim AS builder

# 安装pnpm
RUN npm install -g pnpm@^9

# 设置工作目录
WORKDIR /app

# 初始化项目
RUN mkdir -p /app/karin && \
    cd /app/karin && \
    pnpm init && \
    pnpm install node-karin && \
    npm install -g @karinjs/cli && \
    npx karin init && \
    pnpm add @karinjs/plugin-puppeteer -w && \
    pnpm install

# 第二阶段：运行环境
FROM node:lts-slim

# 设置工作目录
WORKDIR /app

# 安装精简的运行时依赖
RUN apt-get update && apt-get install --no-install-recommends -y \
    ffmpeg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    libxkbcommon0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@^9 @karinjs/cli

# 从构建阶段复制应用程序
COPY --from=builder /app/karin /app/karin

# 复制启动脚本
COPY packages/docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 7777

# 数据卷
VOLUME ["/app"]

# 启动命令
CMD ["/app/start.sh"]

