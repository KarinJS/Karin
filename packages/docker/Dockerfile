FROM node:lts-slim

# 安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 创建基本目录结构
RUN mkdir -p \
  @karinjs/logs \
  @karinjs/config \
  @karinjs/data \
  @karinjs/resource \
  @karinjs/temp/console \
  @karinjs/temp/html \
  plugins/karin-plugin-example

# 初始化项目
RUN pnpm install node-karin@latest && \
  npx karin init && \
  pnpm install

RUN npm install -g @karinjs/cli
COPY packages/docker/start.sh /app/start.sh

# 数据卷
VOLUME ["/app/@karinjs", "/app/plugins"]

# 启动命令
CMD ["/bin/bash", "/app/start.sh"]

