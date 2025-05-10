#!/bin/bash

# 从环境变量中读取设置
export NODE_ENV=${NODE_ENV:-production}
export RUNTIME=${RUNTIME:-node}
export TSX_WATCH=${TSX_WATCH:-false}
export PM2_RESTART=${PM2_RESTART:-true}
export LOG_LEVEL=${LOG_LEVEL:-info}
export LOG_DAYS_TO_KEEP=${LOG_DAYS_TO_KEEP:-7}
export LOG_MAX_LOG_SIZE=${LOG_MAX_LOG_SIZE:-0}
export HTTP_PORT=${PORT:-7777}
export LOG_API_MAX_CONNECTIONS=${LOG_API_MAX_CONNECTIONS:-5}

# 启动应用
exec pnpm app
