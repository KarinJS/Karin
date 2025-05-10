FROM node:lts-slim

# 安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 初始化项目
RUN apt update && \
  apt install ffmpeg -y && \
  apt clean && \
  npm install -g @karinjs/cli && \
  karin init && \
  pnpm add @karinjs/plugin-puppeteer -w && \
  pnpm install

COPY packages/docker/start.sh /app/start.sh

# 数据卷
VOLUME ["/app/@karinjs", "/app/plugins"]

# 启动命令
CMD ["/bin/bash", "/app/start.sh"]

