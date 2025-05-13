#!/bin/bash

export HTTP_PORT=${PORT:-7777}

# 启动应用
cd /app
exec pnpm app
