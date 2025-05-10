FROM node:lts-slim

# 安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 安装karin Cli工具
RUN npm install -g @karinjs/cli
# 初始化项目
RUN karin init && \
  pnpm install

COPY packages/docker/start.sh /app/start.sh

# 数据卷
VOLUME ["/app/@karinjs", "/app/plugins"]

# 启动命令
CMD ["/bin/bash", "/app/start.sh"]

