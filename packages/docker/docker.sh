#!/bin/bash
DOCKER_IMAGE="karinjs/karin:latest"
PORT=7777
while getopts "p:" opt; do
  case $opt in
    p)
      PORT=$OPTARG
      ;;
    *)
      echo "Usage: $0 [-p port]"
      exit 1
      ;;
  esac
done

# 检查curl是否安装
check_curl() {
    if command -v curl >/dev/null 2>&1; then
        echo "curl 已安装"
        return 0
    else
        echo "正在安装 curl..."
        if command -v apt-get >/dev/null 2>&1; then
            apt-get update && apt-get install -y curl
        elif command -v yum >/dev/null 2>&1; then
            yum install -y curl
        else
            echo "无法安装 curl：未找到包管理器"
            exit 1
        fi
        echo "curl 安装完成"
    fi
}

# 检查docker是否安装
check_docker() {
    if command -v docker >/dev/null 2>&1; then
        echo "Docker 已安装"
        return 0
    else
        echo "正在安装 Docker..."
        curl -fsSL https://get.docker.com | bash
        echo "Docker 安装完成"
    fi
}

# 安装Karin
install_karin(){
    echo "正在安装 Karin..."
    docker pull $DOCKER_IMAGE
    docker run -d --name karin --restart=always \
    -e TZ=Asia/Shanghai \
    -e PORT="$PORT" \
    -p $PORT:$PORT \
    -v /opt/karin/@karinjs:/app/@karinjs \
    -v /opt/karin/plugins:/app/@karinjs/plugins \
    $DOCKER_IMAGE
    if ! grep -q "alias karin=" ~/.bashrc; then
        echo "alias karin='docker exec -it karin karin'" >> ~/.bashrc
    fi
    if ! grep -q "alias kr=" ~/.bashrc; then
        echo "alias kr='docker exec -it karin karin'" >> ~/.bashrc
    fi
    source ~/.bashrc
    echo "Karin 安装完成"
}

# 主程序
echo '欢迎使用 Karin 安装脚本'
check_curl
check_docker
install_karin
echo '安装完成, 可使用karin命令'
