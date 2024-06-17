# 渲染器安装

使用`puppeteer`作为默认渲染器。

问：渲染器的作用是什么？  
答：`karin`大多数插件均使用`html`模板，渲染器的作用是将`html`转换为`图片`格式，以便于展示。

问：为什么使用`puppeteer`？  
答：经过我们将近一周的测试，`puppeteer`无论在性能、渲染速度、兼容性等多方面均以碾压性优势领先于其他渲染器。

问：可否不安装渲染器？  
答：可以，只要不使用需要渲染的插件即可。

## 简介

- 国外源： [Github-karin-puppeteer](https://github.com/KarinJS/karin-puppeteer)
- 国内源： [Gitee-karin-puppeteer](https://gitee.com/KarinJS/karin-puppeteer)

::: warning 注意
karin-puppeteer是一个单独的项目，需要单独安装运行。
:::

- 反向WS:
  - 渲染方式：本地文件
  - 优点：稳定、快速
  - 缺点：此方法仅在`karin-puppeteer`与`karin`在同一台服务器上时有效。
- 正向WS:
  - 渲染方式：远程文件、本地文件
  - 优点：在拥有反向WS的基础上，支持远程文件渲染，支持无公网
  - 缺点：远程渲染速度较慢，使用公有服务可能会有安全风险
- HTTP:
  - 渲染方式：本地文件、远程文件
  - 优点：同样支持远程文件渲染，速度较快
  - 缺点：需要`karin-puppeteer`与`karin`在同一局域网、公网内

总结：

> 如果你只需要偶尔进行测试，可选择使用正向WS。  
> 如果需要长期文档使用，建议自建使用反向WS。  
> HTTP的作用在本地使用环境下，几乎和正向、反向WS无异。  
> 如果你的局域网内有高性能的渲染服务器，推荐使用HTTP。

## 克隆仓库

::: warning 温馨提示
请自行安装`Node.js`和`Git`。
:::

> 中国大陆服务器推荐使用`Gitee`源。

::: code-group

```bash [Github]
git clone https://github.com/KarinJS/karin-puppeteer.git
```

```bash [Gitee]
git clone https://gitee.com/KarinJS/karin-puppeteer.git
```

:::

## 安装依赖

::: tip 温馨提示

这一步对无法访问npm官方源的用户来说非常困难，建议直接使用`cnpm`即可。

:::

```bash
cd karin-puppeteer
```

::: code-group

```bash [cnpm 安装]
# 已安装cnpm请忽略第一行
npm --registry=https://registry.npmmirror.com install cnpm -g
cnpm install -P
```

```bash [pnpm 安装]
# 已安装pnpm请忽略第一行
npm --registry=https://registry.npmmirror.com install pnpm -g
pnpm install -P
```

```bash [npm 安装]
npm install -P
```

:::

## 启动

::: code-group

```bash [前台启动]
node .
```

```bash [后台运行]
# 启动
pnpm start

# 停止
pnpm stop

# 重启
pnpm restart

# 查看日志
pnpm run log
```

:::

## 配置文件

`karin-puppeteer`初次启动之后，会在`config`目录下生成`config`文件夹，里面均为配置文件。

> 若无特殊需求，不建议修改。  
> 请不要修改`config/defSet`目录下的文件，这些文件是默认配置文件。

::: code-group

```yaml [config.yaml]
# 日志等级
log_level: 'info'

# 请求头id，反向ws 用于标识请求头
headerId: 'puppeteer'

# server 启用
server:
  # 是否启用HTTP服务 启用HTTP的同时也会启用WebSocket服务
  http: true
  # 是否启用WebSocket服务
  ws: true

# HTTP 服务配置
http:
  # HTTP 服务端口
  port: 7005
  # 令牌
  token: 'Karin-Puppeteer'

# karin 反向地址 可填写多个
karinUrl:
  - 'ws://localhost:7000/puppeteer'
```

```yaml [mime.yaml]

# html css
'.css': 'text/css'
'.html': 'text/html'
'.htm': 'text/html'
'.js': 'application/javascript'

# 图片
'.jpg': 'image/jpeg'
'.jpeg': 'image/jpeg'
'.png': 'image/png'
'.gif': 'image/gif'
'.bmp': 'image/bmp'
'.tiff': 'image/tiff'
'.tif': 'image/tiff'
'.svg': 'image/svg+xml'
'.ico': 'image/x-icon'
'.webp': 'image/webp'
'.avif': 'image/avif'
'.apng': 'image/apng'

# 音频
'.mp3': 'audio/mpeg'
'.wav': 'audio/wav'
'.ogg': 'audio/ogg'
'.flac': 'audio/flac'
'.aac': 'audio/aac'
'.weba': 'audio/webm'

# 视频
'.mp4': 'video/mp4'
'.webm': 'video/webm'

# 字体
'.ttf': 'font/ttf'
'.otf': 'font/otf'
'.eot': 'application/vnd.ms-fontobject'
'.sfnt': 'font/sfnt'
'.woff': 'font/woff'
'.woff2': 'font/woff2'

# 文本
'.txt': 'text/plain'
'.json': 'application/json'
'.xml': 'application/xml'
'.pdf': 'application/pdf'
'.doc': 'application/msword'
'.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
```

```yaml [pm2.yaml]
apps:
  - name: 'karin-puppeteer'
    # 入口
    script: './index.js'
    # 进程守护
    autorestart: true
    # 每分钟最大重启数量
    max_restarts: 60
    # 内存溢出重启，可以是“10M”、“100K”、“2G”等
    max_memory_restart: '1G'
    # 重启延迟 2s
    restart_delay: 2000
    # 避免使用进程 id 后缀日志文件
    merge_logs: true
    # 错误日志路径
    error_file: './logs/pm2_error.log'
    # 输出日志路径
    out_file: './logs/pm2_out.log'
```

```yaml [puppeteer.yaml]
# 调试模式 打开后不会关闭浏览器、标签页
debug: false

# chromium 地址，填写edge/chromium的绝对路径，不推荐使用，自带的 chromium 更适合作为无头浏览器使用。
chromiumPath:

# puppeteer websocket 地址，连接单独存在的chromium。'ws://browserless:3000'
puppeteerWS:

# headless 模式
headless: true

# puppeteer启动args，注意args的--前缀
args:
  - --disable-gpu #"禁用GPU加速"
  - --disable-setuid-sandbox #"禁用setuid沙盒"
  - --no-sandbox #"禁用Chrome沙盒模式"
  - --no-zygote #"禁用zygote进程分割"
  - --disable-extensions #"禁用所有浏览器扩展"
  - --disable-dev-shm-usage #"避免使用/dev/shm，使用/tmp"

# 页面超时时间 默认90秒
timeout: 90000

# waitUntil参数设置 以下为可选值，对于纯静态页面，可以使用false
# load - 页面的load事件触发时，代表页面所有资源都加载完毕才进行截图
# domcontentloaded - DOM树已经构建完毕，此时页面还在加载，如果纯静态页面，可以使用此参数
# networkidle0 - 网络空闲时触发，即网络连接数为0时触发
# networkidle2 - 网络空闲时触发，即500毫秒内没有网络连接时触发 时间较久(500ms)
waitUntil: networkidle2

# 默认setViewport参数设置
setViewport:
  # 是否启用
  enable: true
  # 使用body的宽高
  useBody: true
  # 宽度 请设置整数
  width: 1920
  # 高度 请设置整数
  height: 1080
  # 像素比 图片质量
  deviceScaleFactor: 2
```

:::
