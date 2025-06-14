# Changelog

## [1.9.3](https://github.com/KarinJS/Karin/compare/web-v1.9.2...web-v1.9.3) (2025-06-14)


### 🐛 Bug Fixes

* **ControlButtons:** 重构控制按钮组件并增强重启和关机功能 ([e26016b](https://github.com/KarinJS/Karin/commit/e26016b8690cf1c1979277f1434ee2cd06d782ba))
* **仪表盘:** 当版本号过长时自动进行滚动以显示完整的版本号 ([d03a931](https://github.com/KarinJS/Karin/commit/d03a931f16b94d54a85b852a5dd4776140df829a))
* 回滚部分重启逻辑，更新重启交互引导 ([b5363eb](https://github.com/KarinJS/Karin/commit/b5363ebcd66a7e7812073125ac09b227fa437f71))


### 💄 Styles

* **dashboard:** 更新版本提示样式为更醒目的动画徽章 ([1894cbf](https://github.com/KarinJS/Karin/commit/1894cbfce2395975109f2a8373c23f8983414712))

## [1.9.2](https://github.com/KarinJS/Karin/compare/web-v1.9.1...web-v1.9.2) (2025-06-13)


### 🐛 Bug Fixes

* 优化重启功能逻辑和UI引导 ([7746c21](https://github.com/KarinJS/Karin/commit/7746c21834ea8f010dbb713e66a3ee0d87d1e206))
* 修复并重构更新日志展示功能，提取为独立组件 UpdateLogModal ([#479](https://github.com/KarinJS/Karin/issues/479)) ([180ef2d](https://github.com/KarinJS/Karin/commit/180ef2dffd2ba487f00b70a1a462609f31bbe082))

## [1.9.1](https://github.com/KarinJS/Karin/compare/web-v1.9.0...web-v1.9.1) (2025-06-13)


### 🐛 Bug Fixes

* 修正系统日志滚动时将不再自动跳转 修正多行日志间隙 ([90ca9eb](https://github.com/KarinJS/Karin/commit/90ca9eb18ebd3c254d310df978274e51ffe0d42b))
* 重启选项 close [#475](https://github.com/KarinJS/Karin/issues/475) [#476](https://github.com/KarinJS/Karin/issues/476) ([4549e65](https://github.com/KarinJS/Karin/commit/4549e654becb902a1bf93a51928bd23b32001ff0))

## [1.9.0](https://github.com/KarinJS/Karin/compare/web-v1.8.11...web-v1.9.0) (2025-06-12)


### ✨ Features

* **dashboard:** 添加GSAP动画效果到标题组件 ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))


### 🐛 Bug Fixes

* **sidebar:** 将插件相关功能整合到统一的"插件管理"菜单下 ([cd3885e](https://github.com/KarinJS/Karin/commit/cd3885e837d72568fbf4b7caf252fd7c3044077c))
* 更新主题切换逻辑并优化页面标题显示 ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))
* 选项卡高亮 ([e19c50e](https://github.com/KarinJS/Karin/commit/e19c50e7e7f339a1012db5fa3b53e2d253ffc6a6))


### 📝 Documentation

* 添加依赖管理页面标题映射 ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))


### 💄 Styles

* 优化令人抓狂的样式 ([#473](https://github.com/KarinJS/Karin/issues/473)) ([618f064](https://github.com/KarinJS/Karin/commit/618f06474cf3fe05826b691cb9ff1e893cebd935))
* 侧边栏logo样式 ([a1f6091](https://github.com/KarinJS/Karin/commit/a1f6091774e73955de8dc0b09b411ee25b00cf04))
* 更真实的玻璃质感、重构插件配置页布局 ([#472](https://github.com/KarinJS/Karin/issues/472)) ([1058319](https://github.com/KarinJS/Karin/commit/10583197143ac96ec45d4228ad107804b507888a))
* 统一将"KarinJS"更名为"Karin" ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))


### 🎫 Chores

* 添加GSAP依赖并更新package.json ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))


### ♻️ Code Refactoring

* **theme-switch:** 重构主题切换组件并移除冗余代码 ([4734e8e](https://github.com/KarinJS/Karin/commit/4734e8e15a6a00a476d1c79ba14a4e5de48b82af))
* **theme:** 重构主题切换为系统/反色模式 ([aa73c3c](https://github.com/KarinJS/Karin/commit/aa73c3c61a9fcf9a9ec2caa196cc3ec986db18ec))

## [1.8.11](https://github.com/KarinJS/Karin/compare/web-v1.8.10...web-v1.8.11) (2025-06-06)


### ⚡️ Performance

* 优化前端文件体积 ([174aa91](https://github.com/KarinJS/Karin/commit/174aa914a3923e09c799c2517c8183fde1c230cb))


### ♻️ Code Refactoring

* 重构无感刷新 ([7555928](https://github.com/KarinJS/Karin/commit/7555928fadf412b7c6b8541cc8d2228104d45c13))

## [1.8.10](https://github.com/KarinJS/Karin/compare/web-v1.8.9...web-v1.8.10) (2025-06-06)


### ♻️ Code Refactoring

* 重构插件管理 引入npm ([#461](https://github.com/KarinJS/Karin/issues/461)) ([2b3de7e](https://github.com/KarinJS/Karin/commit/2b3de7ee4ff7c18b4cd082dbe72f504200048c2b))

## [1.8.9](https://github.com/KarinJS/Karin/compare/web-v1.8.8...web-v1.8.9) (2025-06-06)


### 🐛 Bug Fixes

* close [#460](https://github.com/KarinJS/Karin/issues/460) ([dd2bd1a](https://github.com/KarinJS/Karin/commit/dd2bd1aee7edd91dadf98617055426539b0881b8))

## [1.8.8](https://github.com/KarinJS/Karin/compare/web-v1.8.7...web-v1.8.8) (2025-05-21)


### 🐛 Bug Fixes

* 提升兼容性 ([506453e](https://github.com/KarinJS/Karin/commit/506453e1f4a7809ac4010581555ad6f4d3e9f205))

## [1.8.7](https://github.com/KarinJS/Karin/compare/web-v1.8.6...web-v1.8.7) (2025-05-21)


### ⚡️ Performance

* 优化全局配置 添加对应配置项 ([f6c81d3](https://github.com/KarinJS/Karin/commit/f6c81d38d20397f9391ec44703126bafc3c52197))

## [1.8.6](https://github.com/KarinJS/Karin/compare/web-v1.8.5...web-v1.8.6) (2025-05-10)


### 🐛 Bug Fixes

* 手风琴Pro删除按钮误触 ([#422](https://github.com/KarinJS/Karin/issues/422)) ([7f91a57](https://github.com/KarinJS/Karin/commit/7f91a57e85f0a450946449a316072d19ed2b39af))


### 💄 Styles

* **switchs:** 使用动态类名替换硬编码的文本颜色 ([87a6fe4](https://github.com/KarinJS/Karin/commit/87a6fe4a4cdea7ecd49f3596e1d52f6491c9874a))
* 优化混乱的颜色。 ([d4383b1](https://github.com/KarinJS/Karin/commit/d4383b1893d434f1592a5a460f27f8d49e62bd61))
* 优化颜色不统一 ([9cb793f](https://github.com/KarinJS/Karin/commit/9cb793f5b29d17f93f3068df8543145f80670efd))

## [1.8.5](https://github.com/KarinJS/Karin/compare/web-v1.8.4...web-v1.8.5) (2025-05-08)


### 🐛 Bug Fixes

* close [#408](https://github.com/KarinJS/Karin/issues/408) ([#409](https://github.com/KarinJS/Karin/issues/409)) ([8c78b4a](https://github.com/KarinJS/Karin/commit/8c78b4a753a791248ab752e2a8426ff82eb467d5))

## [1.8.4](https://github.com/KarinJS/Karin/compare/web-v1.8.3...web-v1.8.4) (2025-05-07)


### 🐛 Bug Fixes

* 修复`web-config`读取的是缓存 ([#405](https://github.com/KarinJS/Karin/issues/405)) ([3335cef](https://github.com/KarinJS/Karin/commit/3335cefc70b811e11084f4cee1a87c8602ae6838))

## [1.8.3](https://github.com/KarinJS/Karin/compare/web-v1.8.2...web-v1.8.3) (2025-05-07)


### 🐛 Bug Fixes

* `.npmrc` ([#404](https://github.com/KarinJS/Karin/issues/404)) ([7769c31](https://github.com/KarinJS/Karin/commit/7769c31b63f7d458d4f4ca21ba4c2cd523c83b5e))

## [1.8.2](https://github.com/KarinJS/Karin/compare/web-v1.8.1...web-v1.8.2) (2025-05-07)


### 📝 Documentation

* 更新README文件并添加缺失的文档 ([#399](https://github.com/KarinJS/Karin/issues/399)) ([21a3010](https://github.com/KarinJS/Karin/commit/21a30101f1e41dfa35db1a70d18ac2f60df35611))

## [1.8.1](https://github.com/KarinJS/Karin/compare/web-v1.8.0...web-v1.8.1) (2025-05-05)


### 🐛 Bug Fixes

* close [#372](https://github.com/KarinJS/Karin/issues/372) ([#388](https://github.com/KarinJS/Karin/issues/388)) ([f1d1556](https://github.com/KarinJS/Karin/commit/f1d1556019099a5da8a3f3801640e76c17a65ded))


### 💄 Styles

* 移除不必要的背景色和调整暗模式边框颜色 ([8797072](https://github.com/KarinJS/Karin/commit/8797072ca9a5483f3cd0a524b9dbc22ae6434fe3))

## [1.8.0](https://github.com/KarinJS/Karin/compare/web-v1.7.12...web-v1.8.0) (2025-05-03)


### ✨ Features

* 1.8.0 ([#344](https://github.com/KarinJS/Karin/issues/344)) ([be97fae](https://github.com/KarinJS/Karin/commit/be97fae5815b808b3453853c9ed6929540f2b340))
* 优化组件和接口，增强功能和可用性 ([8fcc2f9](https://github.com/KarinJS/Karin/commit/8fcc2f9d20eed76121271b1c9f8cb281132716f7))
* 在依赖管理中添加加载状态指示器 ([dceb90b](https://github.com/KarinJS/Karin/commit/dceb90b561b259694595590d76ba1c7d2769a8e2))
* 增强插件安装功能 ([1013ed9](https://github.com/KarinJS/Karin/commit/1013ed92c680db13fcd09fe2076b4c1ef4454155))
* 更新插件选择器和命令插件缓存逻辑 ([9c60dfd](https://github.com/KarinJS/Karin/commit/9c60dfd67f2d6f4bd4bba3196a40185af078ff43))
* 添加已加载命令插件缓存信息列表接口 ([d1219ec](https://github.com/KarinJS/Karin/commit/d1219ec28282bb391e97391fed8047bb86fb1606))
* 添加文件存在性检查和优化配置路径获取逻辑 ([21122a2](https://github.com/KarinJS/Karin/commit/21122a271a7a42cdeb2618abce91fbe9eaab37b4))


### 🐛 Bug Fixes

* 修复web静态资源路径错误 ([b1fc1e1](https://github.com/KarinJS/Karin/commit/b1fc1e1ca7d241617e64edacb7656c0b5f27e222))
* 修复插件行组件中下拉菜单的条件渲染逻辑，注释掉不必要的代码 ([e12567d](https://github.com/KarinJS/Karin/commit/e12567d78eeeb133b68e9fbf7e4867fa20eedb16))
* 移除不必要的 React 导入 ([1c33d5a](https://github.com/KarinJS/Karin/commit/1c33d5a2eb931a867270ccb138b6563305872249))


### ⚡️ Performance

* 优化网络状态获取和监控可见性管理 ([9ff1ad5](https://github.com/KarinJS/Karin/commit/9ff1ad5b84e7db81069c1441123bc70aabc7c00c))


### 💄 Styles

* close [#357](https://github.com/KarinJS/Karin/issues/357)  更新输入组和插件选择器组件，优化用户体验 ([c915ae4](https://github.com/KarinJS/Karin/commit/c915ae4799d1224e02137bd0592b8488989bacb3))
* 优化插件市场二次确认弹窗的样式 ([8d7d42b](https://github.com/KarinJS/Karin/commit/8d7d42b673118639e0c9618ac7a9242c2c355990))


### ♻️ Code Refactoring

* 重构插件市场 ([fb19543](https://github.com/KarinJS/Karin/commit/fb19543b9c2f55bd23bee40c682085fdd2949481))
* 重构插件市场完成 ([24a47b1](https://github.com/KarinJS/Karin/commit/24a47b16915f7338e4b9ec7d7bf050641b6a2365))
* 重构插件配置二级菜单 修正频繁获取。 ([0dd608a](https://github.com/KarinJS/Karin/commit/0dd608aaec61feeb26d0237d0f8f3ac18a613458))


### 📦️ Build System

* **deps-dev:** bump vite from 6.2.3 to 6.2.7 ([#373](https://github.com/KarinJS/Karin/issues/373)) ([93caf1a](https://github.com/KarinJS/Karin/commit/93caf1ab8563d83316d0f1d67350d7da1a44032d))

## [1.7.12](https://github.com/KarinJS/Karin/compare/web-v1.7.11...web-v1.7.12) (2025-03-28)


### 🐛 Bug Fixes

* 清除已存储的登录信息以防止影响自动登录状态 ([d1a0740](https://github.com/KarinJS/Karin/commit/d1a07403118fc080031b54a702bbec1a84e259d6))

## [1.7.11](https://github.com/KarinJS/Karin/compare/web-v1.7.10...web-v1.7.11) (2025-03-27)


### 🐛 Bug Fixes

* close [#327](https://github.com/KarinJS/Karin/issues/327) close  [#319](https://github.com/KarinJS/Karin/issues/319) ([3d5816d](https://github.com/KarinJS/Karin/commit/3d5816d52550d72e8a261a137fc6042d7d27895b))

## [1.7.10](https://github.com/KarinJS/Karin/compare/web-v1.7.9...web-v1.7.10) (2025-03-27)


### 🐛 Bug Fixes

* close [#341](https://github.com/KarinJS/Karin/issues/341) ([6c738ab](https://github.com/KarinJS/Karin/commit/6c738ab5d01487db9dfefed6ec97bdfdde1ba84d))

## [1.7.9](https://github.com/KarinJS/Karin/compare/web-v1.7.8...web-v1.7.9) (2025-03-26)


### 💄 Styles

* 开关深色模式样式 ([809dc08](https://github.com/KarinJS/Karin/commit/809dc0899f52d99342cdeebba6d8dfc5d10eacba))

## [1.7.8](https://github.com/KarinJS/Karin/compare/web-v1.7.7...web-v1.7.8) (2025-03-24)


### 💄 Styles

* `accordion-pro`组件下`input`组件溢出屏幕 ([b75c845](https://github.com/KarinJS/Karin/commit/b75c84573acbbc29660bad55f7c026b58b55c25a))
* fix [#321](https://github.com/KarinJS/Karin/issues/321) 修正移动端在`添加新卡片`后呼出键盘 ([e647c0e](https://github.com/KarinJS/Karin/commit/e647c0ee6cf43f808a856848200238e02baf6c0c))

## [1.7.7](https://github.com/KarinJS/Karin/compare/web-v1.7.6...web-v1.7.7) (2025-03-23)


### 🐛 Bug Fixes

* **网络监控:** 优化网络监控组件的轮询和图表管理 ([73369c7](https://github.com/KarinJS/Karin/commit/73369c791c5c4b7a59e5c31ff6ec464523d490ac))


### 💄 Styles

* 优化开关、输入框样式 ([7f20dae](https://github.com/KarinJS/Karin/commit/7f20daee4676c98a72259c2ae54c6167aa4e8ca4))
* 优化部分样式 ([5eaaeed](https://github.com/KarinJS/Karin/commit/5eaaeed6722efdd9e282e9ab43b5f59c5975ab3f))

## [1.7.6](https://github.com/KarinJS/Karin/compare/web-v1.7.5...web-v1.7.6) (2025-03-19)


### 🐛 Bug Fixes

* **dashboard:** 仅在第一次点击时初始化 proxyFn ([df6064e](https://github.com/KarinJS/Karin/commit/df6064ee037f08c8d7c085dbbc900fd652ec5f85))
* **dashboard:** 代理函数初始化及fetchRelease调用问题 ([c02cdf0](https://github.com/KarinJS/Karin/commit/c02cdf0d8746b07c2aad320facf400f36a88b35c))
* **dashboard:** 改进更新日志错误处理及显示 ([ed9d432](https://github.com/KarinJS/Karin/commit/ed9d432564cf5b9d996a0d7691b6274eae0c00c9))
* **login:** 自动登录 ([6911cd8](https://github.com/KarinJS/Karin/commit/6911cd84ad56ef11c2e69695e8ef090617a57a1f))
* network monitor card ([6021476](https://github.com/KarinJS/Karin/commit/602147692e8a67a8cde34b8b9a35e785d39829f2))
* 修复向后端请求两次插件列表 ([452f8da](https://github.com/KarinJS/Karin/commit/452f8da0c2e688fdcb05cb478c6e1fac021a83ed))


### 💄 Styles

* **switchs:** 将宽度样式调整为全宽并限制最大宽度 ([49f066f](https://github.com/KarinJS/Karin/commit/49f066f1c1db818b28f460a9fd0217a4e0ce8206))

## [1.7.5](https://github.com/KarinJS/Karin/compare/web-v1.7.4...web-v1.7.5) (2025-03-18)


### 🐛 Bug Fixes

* 修改关于页面描述 ([bf42a29](https://github.com/KarinJS/Karin/commit/bf42a2907118a472891b276284cfb56097e7b7e8))
* 哎呀 ([d77e5f8](https://github.com/KarinJS/Karin/commit/d77e5f85f0b56157e895d7945f9bd38662c6d8fa))


### 💄 Styles

* 开关样式、输入框样式 ([050358a](https://github.com/KarinJS/Karin/commit/050358a55e2d6fb38fb5229e2578cbf0d241547d))
* 系统默认主题适配 ([6ccdfb2](https://github.com/KarinJS/Karin/commit/6ccdfb2ac08456f60add3d0051e2fbcebd9df34b))

## [1.7.4](https://github.com/KarinJS/Karin/compare/web-v1.7.3...web-v1.7.4) (2025-03-17)


### 💄 Styles

* 默认使用系统主题 ([a23723c](https://github.com/KarinJS/Karin/commit/a23723cc3b58a578c7bbb808a50232bb8d536dc5))

## [1.7.3](https://github.com/KarinJS/Karin/compare/web-v1.7.2...web-v1.7.3) (2025-03-14)


### 🐛 Bug Fixes

* 只有小屏幕和处于配置页面下才不置顶根导航栏 ([2a584b2](https://github.com/KarinJS/Karin/commit/2a584b28c198fdf6b4e62656f848358309acf058))

## [1.7.2](https://github.com/KarinJS/Karin/compare/web-v1.7.1...web-v1.7.2) (2025-03-12)


### 🐛 Bug Fixes

* 细节优化 ([a2dcdb0](https://github.com/KarinJS/Karin/commit/a2dcdb0eaaed203c77ab8c0f553e7db84000a6e4))

## [1.7.1](https://github.com/KarinJS/Karin/compare/web-v1.7.0...web-v1.7.1) (2025-03-12)


### 🐛 Bug Fixes

* build error ([1ec764e](https://github.com/KarinJS/Karin/commit/1ec764e37c05abec994f4c4a8bd60c38bbb65a01))


### 💄 Styles

* 配置页面导航栏样式优化 ([4c8621a](https://github.com/KarinJS/Karin/commit/4c8621a1b5bf2d8ba982052fe43914fc690b2a39))

## [1.7.0](https://github.com/KarinJS/Karin/compare/web-v1.6.0...web-v1.7.0) (2025-03-12)


### ✨ Features

* 统一版本 ([6049c93](https://github.com/KarinJS/Karin/commit/6049c93dc096c061d3e3cf0fb9777c759697bff7))


### 💄 Styles

* 优化系统配置页面样式 ([c9dc9f7](https://github.com/KarinJS/Karin/commit/c9dc9f72894052e74319de20f80cce830030b111))
* 样式优化 ([#306](https://github.com/KarinJS/Karin/issues/306)) ([3ac7f71](https://github.com/KarinJS/Karin/commit/3ac7f717bf65637b141ae53444631b2116c68f76))

## [1.6.0](https://github.com/KarinJS/Karin/compare/web-v1.5.0...web-v1.6.0) (2025-03-12)


### ✨ Features

* 仿真终端 网络监控 感谢都行师傅~ ([#304](https://github.com/KarinJS/Karin/issues/304)) ([4d16851](https://github.com/KarinJS/Karin/commit/4d16851ec3c66be423ac6a485036a742f69e5ef6))

## [1.5.0](https://github.com/KarinJS/Karin/compare/web-v1.4.8...web-v1.5.0) (2025-03-09)


### ✨ Features

* 新增主页更新提示、快速更新本体入口、首次加载页面动画 ([#301](https://github.com/KarinJS/Karin/issues/301)) ([3f7efc5](https://github.com/KarinJS/Karin/commit/3f7efc52fdcf2f9b5708800e57c88b6658034817))


### 💄 Styles

* 侧边栏滚动上下添加渐隐 ([42285c2](https://github.com/KarinJS/Karin/commit/42285c23b752bce1e1bf043dc3b64b0ac89e3e1b))


### 📦️ Build System

* **deps:** bump axios from 1.7.9 to 1.8.2 ([#303](https://github.com/KarinJS/Karin/issues/303)) ([04d337b](https://github.com/KarinJS/Karin/commit/04d337be3981722807395d1e9e1e1c632c2175b4))

## [1.4.8](https://github.com/KarinJS/Karin/compare/web-v1.4.7...web-v1.4.8) (2025-03-07)


### 🐛 Bug Fixes

* 暂时移除右滑呼出侧边栏 ([b115a44](https://github.com/KarinJS/Karin/commit/b115a441f8d250bfd607853a70fb9e0959461416))

## [1.4.7](https://github.com/KarinJS/Karin/compare/web-v1.4.6...web-v1.4.7) (2025-03-06)


### 🐛 Bug Fixes

* build error ([2197afc](https://github.com/KarinJS/Karin/commit/2197afc1b46da3985a63d29434dbcc62f76901f4))
* hmr ([c09f423](https://github.com/KarinJS/Karin/commit/c09f4231d53d26ac1e3643ba18dd7dab10d032cc))

## [1.4.6](https://github.com/KarinJS/Karin/compare/web-v1.4.5...web-v1.4.6) (2025-03-05)


### 🐛 Bug Fixes

* 修复插件页面跳转 修复web在夜间模式下某些样式问题 ([aa8734e](https://github.com/KarinJS/Karin/commit/aa8734e74d064a86b88256c53768dfaae9bdf70a))
* 实时日志 ([d3512b2](https://github.com/KarinJS/Karin/commit/d3512b20ea08e348390f7fbfde0046e133595a14))
* 边框颜色 ([#297](https://github.com/KarinJS/Karin/issues/297)) ([8639ddc](https://github.com/KarinJS/Karin/commit/8639ddc76e4971d51b4c35c2207506c82220a301))


### 💄 Styles

* tabs ([9369507](https://github.com/KarinJS/Karin/commit/9369507dc16a561fa69eafd95af07c62bfc6dce9))

## [1.4.5](https://github.com/KarinJS/Karin/compare/web-v1.4.4...web-v1.4.5) (2025-03-04)


### 🐛 Bug Fixes

* 组织名称修正 ([45e7ad7](https://github.com/KarinJS/Karin/commit/45e7ad7a9dfc799892480ff6963853231319e952))

## [1.4.4](https://github.com/KarinJS/Karin/compare/web-v1.4.3...web-v1.4.4) (2025-03-04)


### 🐛 Bug Fixes

* 修复在组织下的npm包名称在web下跳转错误的问题 ([4c64c8c](https://github.com/KarinJS/Karin/commit/4c64c8c82a3776e19448dea1973080844b5f2dba))

## [1.4.3](https://github.com/KarinJS/Karin/compare/web-v1.4.2...web-v1.4.3) (2025-03-04)


### 💄 Styles

* 关于我们页面样式 ([#289](https://github.com/KarinJS/Karin/issues/289)) ([f39f9e6](https://github.com/KarinJS/Karin/commit/f39f9e670583734f6db5e160dd67116893cd67bb))


### ♻️ Code Refactoring

* 重构框架配置页面 ([#292](https://github.com/KarinJS/Karin/issues/292)) ([e718144](https://github.com/KarinJS/Karin/commit/e7181441b2b4c86b1f557a8e17c735e2396817f8))

## [1.4.2](https://github.com/KarinJS/Karin/compare/web-v1.4.1...web-v1.4.2) (2025-03-01)


### 🐛 Bug Fixes

* 登录api增加阈值 fix [#288](https://github.com/KarinJS/Karin/issues/288) ([116ed45](https://github.com/KarinJS/Karin/commit/116ed45b0cf9c6e4980d6810c8b4569edee1a0a2))

## [1.4.1](https://github.com/KarinJS/Karin/compare/web-v1.4.0...web-v1.4.1) (2025-02-28)


### 🐛 Bug Fixes

* sha256兼容性提升 ([e5c5c5c](https://github.com/KarinJS/Karin/commit/e5c5c5cb73e45d249a7f8041ce35c48250bfd69e))
* 我恨手风琴 ([229fc24](https://github.com/KarinJS/Karin/commit/229fc247458e29afcddf68cf813e50fa0f2a3544))


### 💄 Styles

* 状态卡片 ([062ceb3](https://github.com/KarinJS/Karin/commit/062ceb3830bec19f3eebd521baa17ba443f2bfa2))

## [1.4.0](https://github.com/KarinJS/Karin/compare/web-v1.3.12...web-v1.4.0) (2025-02-27)


### ✨ Features

* jwt ([#284](https://github.com/KarinJS/Karin/issues/284)) ([9f4c2d8](https://github.com/KarinJS/Karin/commit/9f4c2d831fb57f1d4b2ac2417cec366753f419ab))

## [1.3.12](https://github.com/KarinJS/Karin/compare/web-v1.3.11...web-v1.3.12) (2025-02-27)


### 💄 Styles

* 优化前端样式 ([#283](https://github.com/KarinJS/Karin/issues/283)) ([0c4745d](https://github.com/KarinJS/Karin/commit/0c4745d299d49f3a93f6d5dba8f55b5a3bc71f33))


### ♻️ Code Refactoring

* 使用react-hook-form重构前端配置页面 ([#281](https://github.com/KarinJS/Karin/issues/281)) ([8dc953e](https://github.com/KarinJS/Karin/commit/8dc953e430c9eafe67f25ae95a598921bbc4ce22))

## [1.3.11](https://github.com/KarinJS/Karin/compare/web-v1.3.10...web-v1.3.11) (2025-02-25)


### 🐛 Bug Fixes

* build error ([ba3d270](https://github.com/KarinJS/Karin/commit/ba3d2704c542fb2dafe45f31bd5e076453337deb))
* 路由切换不重载页面 ([f1d0a58](https://github.com/KarinJS/Karin/commit/f1d0a58936ea7940234a665ece877f66b4cff139))
* 跳转到插件配置页面时自动展开侧边栏 `插件配置` 的子菜单 ([b799026](https://github.com/KarinJS/Karin/commit/b799026284c14f982c5c75957d89605cc7fdfdb4))


### ⚡️ Performance

* document.title ([233108a](https://github.com/KarinJS/Karin/commit/233108a97744c89e0c760cc6cca7cc22af40dc2f))
* 点击logo返回主页 ([9118c72](https://github.com/KarinJS/Karin/commit/9118c72b6811ca076f126e793e99b6261ab75c3a))


### 💄 Styles

* 优化侧边栏插件列表样式 ([1339e66](https://github.com/KarinJS/Karin/commit/1339e66e4c0762ae1433581d968a4ff31db1faa1))
* 优化侧边栏样式布局 ([d8c930c](https://github.com/KarinJS/Karin/commit/d8c930c04b4f1a095b3521b6f40744bcf09ed421))
* 开关间距 ([fb2d626](https://github.com/KarinJS/Karin/commit/fb2d62623a7872d185f5b16dc4da3d3eb3e37b19))
* 插件配置页深色模式样式失效 ([3baac79](https://github.com/KarinJS/Karin/commit/3baac798637861033772c86652f6fe8f1bb943ca))

## [1.3.10](https://github.com/KarinJS/Karin/compare/web-v1.3.9...web-v1.3.10) (2025-02-24)


### 🐛 Bug Fixes

* 兼容性提升 ([d22b68a](https://github.com/KarinJS/Karin/commit/d22b68a7600d419c4c2571e21893d2d36011df25))

## [1.3.9](https://github.com/KarinJS/Karin/compare/web-v1.3.8...web-v1.3.9) (2025-02-24)


### 🐛 Bug Fixes

* ... ([804090b](https://github.com/KarinJS/Karin/commit/804090b7191a636237831a9de552c97cc431159f))
* 修正web 插件配置按钮跳转 ([0f49a85](https://github.com/KarinJS/Karin/commit/0f49a85395eae4e1d904e57f7f883036aee7628d))
* 神经 ([9340d2b](https://github.com/KarinJS/Karin/commit/9340d2b6809f5440674a32fd4e89e30d90c8f088))


### 💄 Styles

* 优化插件配置按钮的加载状态 ([52e50b8](https://github.com/KarinJS/Karin/commit/52e50b84ec72e03fde59f0f641015fecdf0c7b76))
* 间距、按钮描述 ([e95329f](https://github.com/KarinJS/Karin/commit/e95329f215af013b997512684409729050995336))

## [1.3.8](https://github.com/KarinJS/Karin/compare/web-v1.3.7...web-v1.3.8) (2025-02-23)


### 🐛 Bug Fixes

* ci ([9be3efb](https://github.com/KarinJS/Karin/commit/9be3efbccc15313935bc8be09f6a8db17e25c7af))

## [1.3.7](https://github.com/KarinJS/Karin/compare/web-v1.3.6...web-v1.3.7) (2025-02-23)


### 🐛 Bug Fixes

* build web error ([783e4a6](https://github.com/KarinJS/Karin/commit/783e4a6d20b3f599ba7a90927023f505436a7f0d))
* 手风琴pro组件下判断错误 ([a0abfe4](https://github.com/KarinJS/Karin/commit/a0abfe48a1da8988b1925e932c5d9823b6f333e7))
* 重构插件配置页面 ([47f423e](https://github.com/KarinJS/Karin/commit/47f423e37e748dee9c83ee6fa38c913e1d126545))


### 💄 Styles

* 优化错误提示 ([7313744](https://github.com/KarinJS/Karin/commit/731374477937d84f9855b25b8f00edc4489e1574))
* 完成DashboardPage ([8bd37e9](https://github.com/KarinJS/Karin/commit/8bd37e9b06eaa26f2b4a6c10308ea22293c2e942))
* 将插件市场和插件配置分离 ([152660c](https://github.com/KarinJS/Karin/commit/152660c5b78351ac60059dde00c218f225272500))
* 微调样式 ([01fd047](https://github.com/KarinJS/Karin/commit/01fd0477035c242e7d4f2a5a0f7c2f08c85879d4))
* 微调样式 防止页面崩溃 ([a8c517f](https://github.com/KarinJS/Karin/commit/a8c517f962be63d9342a7a0b9a99b473566fc69e))
* 手风琴pro ([1cc4085](https://github.com/KarinJS/Karin/commit/1cc40855c88e67be5f9cb5bd993fc9db9ddce24a))
* 暂时隐藏沙盒入口(木有实力写！ ([d9d1f40](https://github.com/KarinJS/Karin/commit/d9d1f4070028a9ec33c222573c5366c032bb31bf))
* 输入框组样式 ([10abd5b](https://github.com/KarinJS/Karin/commit/10abd5bf2365d469278bc2e418aa256ad92f496c))


### ✅ Tests

* 讨厌的手风琴 ([f2e02d2](https://github.com/KarinJS/Karin/commit/f2e02d27510904c5974c616370e959c7a7529a8b))
* 重构插件配置组件 ([e49fde0](https://github.com/KarinJS/Karin/commit/e49fde0dae4c97e7f720e8dfa849362eef38a33e))

## [1.3.6](https://github.com/KarinJS/Karin/compare/web-v1.3.5...web-v1.3.6) (2025-02-18)


### 🐛 Bug Fixes

* ...该死的手风琴 我恨手风琴 ([2349b71](https://github.com/KarinJS/Karin/commit/2349b7146e420e35233192c9e937322b48bdc20a))
* build error ([8f00701](https://github.com/KarinJS/Karin/commit/8f00701ff21eb948ad65884a89f4e44ef871dd39))
* 删除多余的日志 ([0fe8833](https://github.com/KarinJS/Karin/commit/0fe8833eca434ce22059c93d816e2c9f2c00d173))
* 手风琴适配输入框组 ([1e33a72](https://github.com/KarinJS/Karin/commit/1e33a72157fd1c4420f3c97a45bce0412bc31cb0))
* 新增组件输入框组 ([834a2bd](https://github.com/KarinJS/Karin/commit/834a2bd558670ebff54ef948c1f3fd15d026077b))


### 💄 Styles

* 破防了 下播了 ([1105da3](https://github.com/KarinJS/Karin/commit/1105da3fbe78f420b387bfe3f4aa6c53be908b5c))

## [1.3.5](https://github.com/KarinJS/Karin/compare/web-v1.3.4...web-v1.3.5) (2025-02-15)


### 🐛 Bug Fixes

* 卸载按钮添加二次确认 ([87f3a8d](https://github.com/KarinJS/Karin/commit/87f3a8dcd1264dce8e15d62e8fc3c0615670a65e))
* 组件分隔线适配描述文本 ([cedff08](https://github.com/KarinJS/Karin/commit/cedff082a8b1b4a169640f3e812d13f646a2cfbb))

## [1.3.4](https://github.com/KarinJS/Karin/compare/web-v1.3.3...web-v1.3.4) (2025-02-15)


### 🐛 Bug Fixes

* deepseek优化的 有问题别喷我 ([99a06a8](https://github.com/KarinJS/Karin/commit/99a06a8dd0511185018ef8923c2f04f36bb5074f))
* fix [#270](https://github.com/KarinJS/Karin/issues/270) ([78bc77a](https://github.com/KarinJS/Karin/commit/78bc77aa764d24864212c5139247de479a49b196))
* webui build error ([659bf8c](https://github.com/KarinJS/Karin/commit/659bf8ccc525743e166ea63e1d4a0156ec7349f1))
* 组件save函数返回值处理 ([452c725](https://github.com/KarinJS/Karin/commit/452c725c815827d8ceb9189dbb974ce49f89de13))
* 输入框初始化错误 ([1b0a235](https://github.com/KarinJS/Karin/commit/1b0a2355926db76dd6f84540b7da76ebe49c3d06))


### 💄 Styles

* 打印配置按钮样式 ([ba5c088](https://github.com/KarinJS/Karin/commit/ba5c0881651639267582fc4d41c0528a31b14ece))

## [1.3.3](https://github.com/KarinJS/Karin/compare/web-v1.3.2...web-v1.3.3) (2025-02-14)


### 🐛 Bug Fixes

* ... ([3693919](https://github.com/KarinJS/Karin/commit/3693919f5c7c1e55c59cf71a363b613606838fe3))
* components ([edeccdc](https://github.com/KarinJS/Karin/commit/edeccdc2d43797086c890cec0d0a8ef18775aef8))
* 修复手风琴 更改插件卡片最多显示2个头像 ([116d348](https://github.com/KarinJS/Karin/commit/116d3484c481ce442e7baa738a28eb01ea735916))
* 修复组件渲染 ([951e4b8](https://github.com/KarinJS/Karin/commit/951e4b8628eef75ef62141b8fbbab05492dec5ed))
* 删除无效文件 ([52b54c1](https://github.com/KarinJS/Karin/commit/52b54c1061113327c8c52690d938855d866e3525))
* 单选框默认值 ([2bc2935](https://github.com/KarinJS/Karin/commit/2bc29357dfb45b95618e320a12d339bed7b68055))
* 唯一key ([efaadbb](https://github.com/KarinJS/Karin/commit/efaadbbad81b41417a2fa23b84dd229abb41e351))
* 增加单选框、复选框组件，修正组件渲染错误 ([edeccdc](https://github.com/KarinJS/Karin/commit/edeccdc2d43797086c890cec0d0a8ef18775aef8))
* 插件列表缓存 ([009ec94](https://github.com/KarinJS/Karin/commit/009ec947b29578f856b1bc29cd756ba369e92e6c))
* 普通手风琴的样式 ([07aebfe](https://github.com/KarinJS/Karin/commit/07aebfe1b35afd87fd992d51eba676b2c519d13d))
* 给予一个默认值 ([1146c3f](https://github.com/KarinJS/Karin/commit/1146c3fb8e5ee9ade4c794cdec9ebc7f6f6fa4be))
* 重命名插件页面 ([b54f5e2](https://github.com/KarinJS/Karin/commit/b54f5e28dcd3f6f4114c1442cea2b0aea82a5e6b))


### 💄 Styles

* 插件卡片样式微调 ([da3e387](https://github.com/KarinJS/Karin/commit/da3e38754dc98e4382533c29f856c97f999adf50))
* 登录页面样式 ([1081bb2](https://github.com/KarinJS/Karin/commit/1081bb2f1ad0f88f900bb3261d17c8f58fbedf05))

## [1.3.2](https://github.com/KarinJS/Karin/compare/web-v1.3.1...web-v1.3.2) (2025-02-11)


### 🐛 Bug Fixes

* webui login ([#257](https://github.com/KarinJS/Karin/issues/257)) ([31263c8](https://github.com/KarinJS/Karin/commit/31263c850325bf2c6009ffc27b113100dda2f004))

## [1.3.1](https://github.com/KarinJS/Karin/compare/web-v1.3.0...web-v1.3.1) (2025-02-10)


### 🐛 Bug Fixes

* web config ([3ed39a0](https://github.com/KarinJS/Karin/commit/3ed39a095978cca055415c67e1fae21388df3c09))

## [1.3.0](https://github.com/KarinJS/Karin/compare/web-v1.2.1...web-v1.3.0) (2025-02-08)


### ✨ Features

* 插件市场 ([b9b0504](https://github.com/KarinJS/Karin/commit/b9b050426ebef23cda064051f24eafa0c84f277b))
* 新增web沙盒 插件管理 插件市场 插件配置 框架配置 ([#251](https://github.com/KarinJS/Karin/issues/251)) ([26483ae](https://github.com/KarinJS/Karin/commit/26483aedd0cbe1f99bce98d82cc7483ca281c4d2))
* 部分功能 ([5150da5](https://github.com/KarinJS/Karin/commit/5150da5a05ae5fc62952b98d5e222cd889f2b1ff))


### 🐛 Bug Fixes

* del console ([2c5fab7](https://github.com/KarinJS/Karin/commit/2c5fab766ade01f181e54f5291ade6f495224812))
* web plugins ([cf0d0e0](https://github.com/KarinJS/Karin/commit/cf0d0e02d0025cdc7dce124820076bfc0204b01b))
* web适配获取好友列表、群列表 ([68d1632](https://github.com/KarinJS/Karin/commit/68d16322294e3d3bf5fe018b4b38b63edd347f0a))


### 💄 Styles

* 插件列表样式 ([5876832](https://github.com/KarinJS/Karin/commit/587683293315d40704210e2bdfa3565e49ae7d1f))

## [1.2.1](https://github.com/KarinJS/Karin/compare/web-v1.2.0...web-v1.2.1) (2025-01-21)


### 🐛 Bug Fixes

* import ([a7b6004](https://github.com/KarinJS/Karin/commit/a7b6004f3975b44347d15831a651aa7eacbee2ff))

## [1.2.0](https://github.com/KarinJS/Karin/compare/web-v1.1.0...web-v1.2.0) (2025-01-21)


### ✨ Features

* 沙箱调试UI,关于页面,部分页面占位 ([03f3899](https://github.com/KarinJS/Karin/commit/03f389987fe7bfef0d92ddf70bf8a7c10139da9f))


### 🐛 Bug Fixes

* @heroui/popover ([0a9039a](https://github.com/KarinJS/Karin/commit/0a9039acd447d743532f9270ff3d5715314c7e82))
* file api ([1df3ee2](https://github.com/KarinJS/Karin/commit/1df3ee22128bb77ae4ca340cd8316ca0c71601c9))
* set env ([c3b311e](https://github.com/KarinJS/Karin/commit/c3b311e3830f36697f369eb62d6cbaccea0df56b))
* 优化页面间距 ([7d6e47d](https://github.com/KarinJS/Karin/commit/7d6e47d3a5ea9ccc5e51a72115057a0f27c456f1))
* 配置 ([aa6d02d](https://github.com/KarinJS/Karin/commit/aa6d02dfb78baa385acc0405b77da7176fbe662d))
* 重构配置文件格式 ([1abd5be](https://github.com/KarinJS/Karin/commit/1abd5be785074d02453cc0ddfa46022d871c62bd))
* 页面缺失 ([6c8b9c6](https://github.com/KarinJS/Karin/commit/6c8b9c60faddd4734449f2634065f5c038705655))


### 💄 Styles

* 配置页面样式objectArray ([6d091d4](https://github.com/KarinJS/Karin/commit/6d091d43514227cc9a21464cbcda25dc5149b7ce))
* 配置页面样式微调 ([4291a1a](https://github.com/KarinJS/Karin/commit/4291a1a3fa355910d698cb069a320dea0b099621))
* 配置页面样式微调 ([362c9cc](https://github.com/KarinJS/Karin/commit/362c9cc109aa2869052e4fc6b3c57ac434d6c939))

## [1.1.0](https://github.com/KarinJS/Karin/compare/web-v1.0.0...web-v1.1.0) (2025-01-18)


### ✨ Features

* 添加webui功能 ([bb236bd](https://github.com/KarinJS/Karin/commit/bb236bdb03d3b212cc80ab44611412077966ecf4))
* 系统状态 ([23d8664](https://github.com/KarinJS/Karin/commit/23d8664706c8c1814b3c160ff1cf3667be4f8e8e))


### 🐛 Bug Fixes

* 移除macos生成的垃圾文件并添加进ignore ([ad8466c](https://github.com/KarinJS/Karin/commit/ad8466c514c8bb0729333b688c88b6cd42d4b789))
* 请求方式&打包路径 ([2a52898](https://github.com/KarinJS/Karin/commit/2a52898033364185e28ad7b31047571fce2ecf44))
