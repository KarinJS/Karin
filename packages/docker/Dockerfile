FROM node:lts-slim

# 安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 初始化项目
RUN apt update && \
  apt install ffmpeg ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils libxkbcommon0 -y && \
  apt clean && \
  npm install -g @karinjs/cli && \
  karin init && \
  pnpm add @karinjs/plugin-puppeteer -w && \
  pnpm install

COPY packages/docker/start.sh /app/start.sh

# 数据卷
VOLUME ["/app"]

# 启动命令
CMD ["/bin/bash", "/app/start.sh"]

