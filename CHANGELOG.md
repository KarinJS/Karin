## 0.0.3 (2024-6-19)

### 新增功能
- feat: vue渲染兼容 ([4470d02](https://github.com/KarinJS/Karin/commit/4470d02b3521e6e91e7abb7c20c02a855728b1d7))
- feat: ReactMessageWithEmojiRequest ([b92770b](https://github.com/KarinJS/Karin/commit/b92770bcaeb0d2b0966d125e7ad984f3dbe90263))
- feat: 优化结构 降低对redis的依赖 目前在未安装redis时时候level进行降级代替 (#13) ([9e1c615](https://github.com/KarinJS/Karin/commit/9e1c61529b7c109bd77e82b5aeb3fe52a69a7e87))
- feat: 新增上线通知 ([b7bee73](https://github.com/KarinJS/Karin/commit/b7bee7399dd3450d53e567f74ef4ad4e44643f03))
- feat: redis 集群 触发fnc加上颜色使其更明确指令 ([d53560f](https://github.com/KarinJS/Karin/commit/d53560f3e4f852338693e2fddcd3f9c8761e3909))
- feat: add updateVersion ([10c6446](https://github.com/KarinJS/Karin/commit/10c6446ee48ee4598b1fae336a9baf0b0a9415ca))

### Bug修复
- fix: 修正正向ws重连错误 修正getBot 失败 ([1cba613](https://github.com/KarinJS/Karin/commit/1cba6136fff9726a3cd2e2189f5c83357fd17de7))
- fix: ob11的uid暂时全部默认为uin ([8fc3ccd](https://github.com/KarinJS/Karin/commit/8fc3ccd894d1bfd806f3882435a5e9cdd2a3f022))
- fix: forward uin ([c7b03af](https://github.com/KarinJS/Karin/commit/c7b03af45c303624bcdf794b1a28d823f2c8eaee))
- fix: 修正好友判断错误 类型描述错误 ([54fca4b](https://github.com/KarinJS/Karin/commit/54fca4b85b8aba8e7e1f0753dfe3cb25f8ee0da4))
- fix: 修正pm2相关问题 ([5b1b913](https://github.com/KarinJS/Karin/commit/5b1b913ed9e1ecdaa0180f24609631799da86962))
- fix: 修正上线通知 ([f39dd21](https://github.com/KarinJS/Karin/commit/f39dd2164558716ec7aa6df6a01215c647ca98b5))
- fix: 修正反向ws渲染错误 ([6206c5c](https://github.com/KarinJS/Karin/commit/6206c5c5d1f6af0788efaa0c91b9a9cfea310261))
- fix: log ([30531d9](https://github.com/KarinJS/Karin/commit/30531d97db8ff61bed01b425cf23926c95208d80))
- fix: APP未热更 保证每一条消息的打印 无论是否拦截 ([796e03c](https://github.com/KarinJS/Karin/commit/796e03c1ba025a278402a1785f1a5e3a7f7ddd88))
- fix: cfg.Config.log_color undefined ([84519d3](https://github.com/KarinJS/Karin/commit/84519d36b509ada43dc54b8cb3d7e0ec2db35d7d))
- fix: updateVersion路径错误 ([330ac99](https://github.com/KarinJS/Karin/commit/330ac99312061ce78d29101d43a690336fe3b6ab))

### 其他提交
- Update Wormhole.js ([46a9797](https://github.com/KarinJS/Karin/commit/46a979734fb0ab98198129155716c983288cbede))

## [0.6.2](https://github.com/KarinJS/Karin/compare/v0.6.1...v0.6.2) (2024-07-02)


### Bug Fixes

* 初始化脚本错误 ([de138a7](https://github.com/KarinJS/Karin/commit/de138a723a04c2431517634f5f11f58527553a6b))

## [0.6.1](https://github.com/KarinJS/Karin/compare/v0.6.0...v0.6.1) (2024-07-02)


### Bug Fixes

* build error ([dbd6db5](https://github.com/KarinJS/Karin/commit/dbd6db5b24b27a5daad39cab44b390df928ae092))

## [0.6.0](https://github.com/KarinJS/Karin/compare/v0.5.1...v0.6.0) (2024-07-02)


### Features

* kritor adapter ([6b1aa4c](https://github.com/KarinJS/Karin/commit/6b1aa4cc269923b887e62eb7ea7b9e0cdc602383))


### Bug Fixes

* apps路径不存在跳过 ([5af527c](https://github.com/KarinJS/Karin/commit/5af527cc539e9075502a77f2b5743d3bce41ac40))
* 可自定义传参apps ([4c57454](https://github.com/KarinJS/Karin/commit/4c57454463ab406ec2ba42ac520dcf8a00953b5a))

## [0.5.1](https://github.com/KarinJS/Karin/compare/v0.5.0...v0.5.1) (2024-06-30)


### Bug Fixes

* self_id  === input 不打印日志 ([f1d5fbd](https://github.com/KarinJS/Karin/commit/f1d5fbddcbcd0fbea579f510ac087b189e0a9540))

## [0.5.0](https://github.com/KarinJS/Karin/compare/v0.4.1...v0.5.0) (2024-06-30)


### Features

* 新增 input 适配器 完善通知、请求事件 ([8ce4ade](https://github.com/KarinJS/Karin/commit/8ce4ade974c06d2d17a7deb83afeb1a62118f45c))

## [0.4.1](https://github.com/KarinJS/Karin/compare/v0.4.0...v0.4.1) (2024-06-30)


### Bug Fixes

* fix ts error ([34afc7d](https://github.com/KarinJS/Karin/commit/34afc7df9e70a12eff349af15be9e3266772103c))

## [0.4.0](https://github.com/KarinJS/Karin/compare/v0.3.9...v0.4.0) (2024-06-30)


### Features

* 新增karin.task karin.handler ([63a0576](https://github.com/KarinJS/Karin/commit/63a0576a8dd69b85fdb35c31f1ad5d682aa31d3e))

## [0.3.9](https://github.com/KarinJS/Karin/compare/v0.3.8...v0.3.9) (2024-06-29)


### Bug Fixes

* 推进`kritor-proto`版本 ([5fbd7ad](https://github.com/KarinJS/Karin/commit/5fbd7ad302af4a3b39a26e19e1eb0aa1387acd3b))

## [0.3.8](https://github.com/KarinJS/Karin/compare/v0.3.7...v0.3.8) (2024-06-29)


### Bug Fixes

* 修正listener编译后无类型 ([e189a9c](https://github.com/KarinJS/Karin/commit/e189a9c37c6e816d70c0a9018353d5f063d4cc10))

## [0.3.7](https://github.com/KarinJS/Karin/compare/v0.3.6...v0.3.7) (2024-06-28)


### Bug Fixes

* build error ([615adba](https://github.com/KarinJS/Karin/commit/615adbaacb47035f95c9ab820d7fb921467d5b76))

## [0.3.6](https://github.com/KarinJS/Karin/compare/v0.3.5...v0.3.6) (2024-06-28)


### Bug Fixes

* types ([3650095](https://github.com/KarinJS/Karin/commit/36500952b58bc9ea0a11ca198d3b6e84926ee185))

## [0.3.5](https://github.com/KarinJS/Karin/compare/v0.3.4...v0.3.5) (2024-06-28)


### Bug Fixes

* 将modules修改到根目录 ([97e1f14](https://github.com/KarinJS/Karin/commit/97e1f146be70071110641a46747525ed4c0f0fe3))

## [0.3.4](https://github.com/KarinJS/Karin/compare/v0.3.3...v0.3.4) (2024-06-28)


### Bug Fixes

* reg string ([24715a1](https://github.com/KarinJS/Karin/commit/24715a1a25671eb94158b91271b06bf3aaa2e103))

## [0.3.3](https://github.com/KarinJS/Karin/compare/v0.3.2...v0.3.3) (2024-06-28)


### Bug Fixes

* 正向适配器加载顺序 ([9db2cfe](https://github.com/KarinJS/Karin/commit/9db2cfe3617846e44a41fc9f31c342cf2d562b36))

## [0.3.2](https://github.com/KarinJS/Karin/compare/v0.3.1...v0.3.2) (2024-06-28)


### Bug Fixes

* 正向ws不触发 ([015c0f9](https://github.com/KarinJS/Karin/commit/015c0f931285a14606ded1380a5ac08576f1a7f3))

## [0.3.1](https://github.com/KarinJS/Karin/compare/v0.3.0...v0.3.1) (2024-06-28)


### Bug Fixes

* YamlEditor 命名导出 ([f3a3f17](https://github.com/KarinJS/Karin/commit/f3a3f17c00f4c157a36c90e405bf2f25ae96a528))

## [0.3.0](https://github.com/KarinJS/Karin/compare/v0.2.2...v0.3.0) (2024-06-28)


### Features

* 完善热更新 支持ts ([98d5eea](https://github.com/KarinJS/Karin/commit/98d5eeaf9165b8d5cddaee99d898593b2c0bb26c))

## [0.2.2](https://github.com/KarinJS/Karin/compare/v0.2.1...v0.2.2) (2024-06-27)


### Bug Fixes

* 修正npx init ([9bd5d09](https://github.com/KarinJS/Karin/commit/9bd5d090ccfb27e1797fdff198f83ab6a0f766a3))

## [0.2.1](https://github.com/KarinJS/Karin/compare/v0.2.0...v0.2.1) (2024-06-27)


### Bug Fixes

* 优化导入 命名 ([8e3868c](https://github.com/KarinJS/Karin/commit/8e3868c9029803d46a534c5a2392efa155cf20ee))

## [0.2.0](https://github.com/KarinJS/Karin/compare/v0.1.2...v0.2.0) (2024-06-26)


### Features

* add karin.command ([b13d0a8](https://github.com/KarinJS/Karin/commit/b13d0a8724cd784e1ddaa14e9919d20785a56ab2))


### Bug Fixes

* ~ ([292aac1](https://github.com/KarinJS/Karin/commit/292aac183edcf007df0f34187ab53dd66993ea17))

## [0.1.2](https://github.com/KarinJS/Karin/compare/v0.1.1...v0.1.2) (2024-06-26)


### Bug Fixes

* init error & path error ([0dbd6a9](https://github.com/KarinJS/Karin/commit/0dbd6a9472acfea12bb01a538baf50118d95d8ed))

## [0.1.1](https://github.com/KarinJS/Karin/compare/v0.1.0...v0.1.1) (2024-06-26)


### Bug Fixes

* add pnpm init ([0afb342](https://github.com/KarinJS/Karin/commit/0afb3421e2237496c497ec5cab7ff5a9adb2d46b))

## [0.1.0](https://github.com/KarinJS/Karin/compare/v0.0.3...v0.1.0) (2024-06-26)


### Features

* add QQGroup Discord ([2ffb6b2](https://github.com/KarinJS/Karin/commit/2ffb6b21838b6821b20efe8cbea15fc7fa8fe7ac))
* EventBase ([5b99630](https://github.com/KarinJS/Karin/commit/5b99630a334d0179fe457c46d10854096f6623e8))
* KarinMessageEvent ([b52899d](https://github.com/KarinJS/Karin/commit/b52899d9f7b36d861798f3cd1bf25a5f847ded4a))
* npm ([e1397a1](https://github.com/KarinJS/Karin/commit/e1397a13fa2dc762f0c7f16849dabf1a363f8972))
* npm run dev ([ffeb0b6](https://github.com/KarinJS/Karin/commit/ffeb0b6f2fda8591acc04e236bbec5f15c90e8bb))
* onebot11 adapter ([ed842f1](https://github.com/KarinJS/Karin/commit/ed842f1f0e7595693ebd47aed93c8fb25ba2cf6c))
* run ([61e0423](https://github.com/KarinJS/Karin/commit/61e0423e8628cbda0f31d26e3d2a099fe3080a87))
* ts ([7fd5951](https://github.com/KarinJS/Karin/commit/7fd5951fd794387ba0b1d0e777249ded5056c26a))
* 完善基本架构 ([3b718ba](https://github.com/KarinJS/Karin/commit/3b718ba639a7a5fa4586c207140e951e43fecade))
* 完成ts环境插件适配 ([5396a6c](https://github.com/KarinJS/Karin/commit/5396a6c37046ec90970664d4357619feeb51410e))
* 完成编译 ([3b9edeb](https://github.com/KarinJS/Karin/commit/3b9edebcc5ce8350832d4eba78f6e59af9554d74))


### Bug Fixes

* node-version ([cb8b9b0](https://github.com/KarinJS/Karin/commit/cb8b9b0e734d25d74d0bd028dac6c3f7757fc39b))
* Plugin.init ([519ca80](https://github.com/KarinJS/Karin/commit/519ca803cca7d63acce4e8e32adeb3f96da6b131))
* 修复已知问题 详情查看描述 ([17a1b4f](https://github.com/KarinJS/Karin/commit/17a1b4f1e5e13c93c999e803e2232b925d908d0a))
* 啊啊啊啊啊 ([a7ad104](https://github.com/KarinJS/Karin/commit/a7ad1044f5d479d3443267704dcfc08a25703333))
* 更正token ([d200974](https://github.com/KarinJS/Karin/commit/d200974d66566b988b5b2381f03cf9d47d6eaf7c))

## 0.0.2 (2024-6-4)

### Releases

- release: 0.0.2 ([5cf693a](https://github.com/KarinJS/Karin/commit/5cf693a6a9a06446654ffc65a6bdb936322401ee))

### 新增功能

- feat: 添加配置文件视图 ([f567b61](https://github.com/KarinJS/Karin/commit/f567b6104a8970f86771763915aa730779368f2d))
- feat: YamlEditor root ([a46b036](https://github.com/KarinJS/Karin/commit/a46b036b338359c0f921b5f7f97630dee63eacdb))
- feat: renderer debug log ([b3d5abc](https://github.com/KarinJS/Karin/commit/b3d5abcb529c0dd738e70190b95b526e3ce6b261))
- feat: onebot11正向ws 标准化配置文件 标准化渲染传参  新增纯ws渲染 适配yarn 修复已知问题 ([8a6866b](https://github.com/KarinJS/Karin/commit/8a6866b036818a59ed68b876ccde1ee83d4dbc69))
- feat: pm2 ([b4dbf75](https://github.com/KarinJS/Karin/commit/b4dbf75e5c981fde4c7f7a94398957592144ff74))
- feat: update api ([9fa7c30](https://github.com/KarinJS/Karin/commit/9fa7c30796b1f47590adf7dde4500c66cd1b2dea))
- Revert "feat: puppeteer" ([196ec20](https://github.com/KarinJS/Karin/commit/196ec2096bce1903152fa559dbed48a72edca3c9))
- feat: review ([ddc80eb](https://github.com/KarinJS/Karin/commit/ddc80ebfc3d1f4eefefd0c3e0d8d93d384e3c317))
- feat: WormholeClient 详情请查看<https://github.com/HalcyonAlcedo/wormhole> ([3245258](https://github.com/KarinJS/Karin/commit/32452582472015fe55e466ba5002b03f69b9c58c))
- feat: 封装主动消息接口 修复转换绝对路径参数错误 ([168e262](https://github.com/KarinJS/Karin/commit/168e26217ea7f72a2b25f5c1272dc83ae34ce0ab))
- feat: 适配`karin-puppeteer`的http渲染 ([d6d50f5](https://github.com/KarinJS/Karin/commit/d6d50f50e51e13e323fa215b72617d602eb42000))
- feat: 将通知、请求事件的日志构建从适配器分离，由karin完成(初步，未完成...摸鱼了~) ([f93f027](https://github.com/KarinJS/Karin/commit/f93f027c839f846da8e4229afde2b71f777aac19))
- :art: feat: 新增ffmpeg、exec 修复已知问题，渲染器未键入id默认调用第一个 ([22210be](https://github.com/KarinJS/Karin/commit/22210bea464c084ab09666d8f1aab324baabed10))
- :art: feat: karin-adapter ([e9c281c](https://github.com/KarinJS/Karin/commit/e9c281c8b41ad706175b69b95d32ea25ae58e331))
- :art: feat: 凭感觉试试看？ ([316b715](https://github.com/KarinJS/Karin/commit/316b7153a1a0e30a2182afb51168ed8b72fcee6a))
- :fire: feat: `YamlEditor`新增`has`、`hasVal` ([fcf45e4](https://github.com/KarinJS/Karin/commit/fcf45e44659d22dcc8161e54d5138860f84dda88))
- :fire: feat：新增YamlEditor工具 ([31d0030](https://github.com/KarinJS/Karin/commit/31d0030436c551777d1ecd56b499184fdde9b489))
- :fire:  feat：热更新支持重启http、grpc服务器 ([7041145](https://github.com/KarinJS/Karin/commit/70411454f339567aa14133d7811831618087688f))
- :fire: feat：onebot11更多消息结构 ([d39a78d](https://github.com/KarinJS/Karin/commit/d39a78d4dd5103a9d5e186f1b68cce8d9f7df1d2))
- feat：启动时检测`Submodule`，不存在则自动拉取 ([c70456a](https://github.com/KarinJS/Karin/commit/c70456a06669cb417add0a37f147d82ab4b9ea74))
- :zap: feat：添加App功能管理 ([7db7176](https://github.com/KarinJS/Karin/commit/7db7176f4d07d38bf68f4baa7e7c1158318f42e6))
- :zap:  feat：插件，定时任务热更新、button、handler、上下文 ([8b3efd5](https://github.com/KarinJS/Karin/commit/8b3efd5dba8e5e54f4ea32ce9c6a3ea7ff4a25c0))
- :zap: feat：完善大部分基本Api ([ba6e91a](https://github.com/KarinJS/Karin/commit/ba6e91a788fcf3b2cae7c9aafa0e2843ef1e76ee))
- :zap: feat：分离puppeteer ([0dd3b02](https://github.com/KarinJS/Karin/commit/0dd3b0218ded4218968c64182ea05243d815c24d))
- :zap:  feat：初步支持onebot11 ([372ba19](https://github.com/KarinJS/Karin/commit/372ba19f1749acae80fe9805da3ffdbaa726b83f))
- :zap: feat：请求事件完善 ([36915e1](https://github.com/KarinJS/Karin/commit/36915e1e77067e69bba13951481ac1f6d6a0b584))
- :sparkles:  feat：补充所有基础Api ([904d63e](https://github.com/KarinJS/Karin/commit/904d63e0bf87f5a7d9601470acd9ea103b23c0f7))
- :zap: feat：Complete all notification events ([0c7e206](https://github.com/KarinJS/Karin/commit/0c7e206573b78c3c0bcb350a35c4f0874fd48a7f))
- feat：好友头像戳一戳、好友消息撤回 ([3fe6676](https://github.com/KarinJS/Karin/commit/3fe6676454c412c854482e05541c44f635e4a83a))
- :zap: feat：`node . --dev` ([f2099fa](https://github.com/KarinJS/Karin/commit/f2099fa1336ca90336c3c8a11d544c9ab76f67cb))
- :sparkles: feat：子事件标准化，通知事件格式标准化 ([6b1339b](https://github.com/KarinJS/Karin/commit/6b1339bcb0851f2464fe039624abca703f55a2e4))
- feat：`#Karin`加入`kritor` ([8474ef6](https://github.com/KarinJS/Karin/commit/8474ef6d482b04c1f7a2a23892fd2c603f88bbc4))
- :sparkles: feat：Complete basic type messages ([4a80e67](https://github.com/KarinJS/Karin/commit/4a80e67a3230c851499ce632a3a0f47e94e465dd))
- feat: refactor kritor adapter ([2955050](https://github.com/KarinJS/Karin/commit/2955050e92c5d07d859fb2e7f8e6622af22625e0))
- :sparkles: feat：kritor添加部分api ([05772f5](https://github.com/KarinJS/Karin/commit/05772f53c7ea01fc449ef52b6531ed664e55b1b8))
- :sparkles: feat：kritor实现SendApi ([ea1c818](https://github.com/KarinJS/Karin/commit/ea1c81861ac5863f775020911470fb5137010355))
- :sparkles: feat：实现kritor文本消息回复 ([81fac8c](https://github.com/KarinJS/Karin/commit/81fac8c0b3876ff4d4c251ff991ff29a7f2009bb))
- feat：kritor支持被动RPC消息接收 ([37335e9](https://github.com/KarinJS/Karin/commit/37335e99e7e643d4166db6e0a256cbffcc781e45))
- feat：kritor ([458168a](https://github.com/KarinJS/Karin/commit/458168a04284610f1e128046e2654732e8cbc3b6))
- feat：注册适配器 ([93c586f](https://github.com/KarinJS/Karin/commit/93c586f76267e55bf7851ef0348ac668f3915792))
- feat：完善请求事件 ([7c0753a](https://github.com/KarinJS/Karin/commit/7c0753a6d49a29fc32287d88034de019cb1488bc))
- feat：发送消息日志、优化部分日志显示 ([acc3c45](https://github.com/KarinJS/Karin/commit/acc3c454ca8bbd60c66d63d70350b0687ad68252))
- feat：增加别名导入解析 ([7f1bc88](https://github.com/KarinJS/Karin/commit/7f1bc883852d5027eb14cd5ac79ec9a5c3090e8f))
- feat：完善结构、通知事件 ([933bbb9](https://github.com/KarinJS/Karin/commit/933bbb95a237ad02b26c0a8c6e8d0a23c8a7734b))
- feat：`puppeteer` ([8928729](https://github.com/KarinJS/Karin/commit/8928729ca0d7df5e8af92e7bf6929ce840fc7b4a))

### Bug修复

- fix: 移除子模块 并屏蔽git跟踪 ([b838fd7](https://github.com/KarinJS/Karin/commit/b838fd7f72cc1048d69fc07d681d858149350576))
- fix: 修正描述 继续挖坑 咕咕咕 ([2e18050](https://github.com/KarinJS/Karin/commit/2e1805014e0b5d1d1f9fda3eef46e22816d806cf))
- fix: watch htmlPath error ([7ae39ad](https://github.com/KarinJS/Karin/commit/7ae39add613b428e65c37650953c5cfbac15a12a))
- fix: alias typo ([4fe44da](https://github.com/KarinJS/Karin/commit/4fe44da41215608ca0c90f076c2042053c2d179a))
- fix: 啊哈哈哈 写反了 ([c1f64cb](https://github.com/KarinJS/Karin/commit/c1f64cbde8425e18fc9ae3b68edb0bfebfc29b6d))
- fix: debug ([b0bd32e](https://github.com/KarinJS/Karin/commit/b0bd32e58d63370d1f9b3e9e3535092fe69d5af6))
- fix: 正向WS渲染路径错误 ([cc60107](https://github.com/KarinJS/Karin/commit/cc601075ae0860dfc508737b82b2f21e875618e7))
- fix: WormholeClient ([a92b1b4](https://github.com/KarinJS/Karin/commit/a92b1b44ae4823afbb754e884bd106a078140a03))
- fix: grpc server log error ([5b6cecb](https://github.com/KarinJS/Karin/commit/5b6cecb593dfbf054c86cac0b0e24d6c360a56a6))
- fix: 大小写~ ([723aa12](https://github.com/KarinJS/Karin/commit/723aa120967d7f4467280bad7a589d3cb8d3aded))
- fix: Cannot find module ([0012825](https://github.com/KarinJS/Karin/commit/0012825a44f372936c596970d578e5aa63df45db))
- fix: git 大小写敏感。 ([3518622](https://github.com/KarinJS/Karin/commit/3518622ed0b9daaac4eebe85b03492350ff70951))
- fix: staticPath is missing resources ([b5a09fe](https://github.com/KarinJS/Karin/commit/b5a09fec901afd7e90554ea16c97037bf105051d))
- fix: 修正http渲染 ([15332b7](https://github.com/KarinJS/Karin/commit/15332b789f4ac599dabbf4df2f561dd8f521f112))
- fix: conKey undefined ([b76db88](https://github.com/KarinJS/Karin/commit/b76db880e6a9942ae855b3f3a88491d6ff546b35))
- fix: renderHtml ([f34ab93](https://github.com/KarinJS/Karin/commit/f34ab9369dd3b6a5d596ec9cf189acdbf9fad2b0))
- fix: update logger ([b61b235](https://github.com/KarinJS/Karin/commit/b61b2352ee0b00a3c69debc339f40130290db76d))
- fix: 修复Wormhole重连时未传递参数的问题 ([dec6bc0](https://github.com/KarinJS/Karin/commit/dec6bc05d798c3682314eab91595a7b47c5cdb36))
- fix: proto error ([04b13d0](https://github.com/KarinJS/Karin/commit/04b13d0808185bd513b6c0bdcb0b61124af4831f))
- fix: format JSDoc ([09b3535](https://github.com/KarinJS/Karin/commit/09b3535fb9baab4e33c3854c791897ba16dbd9a2))
- fix: 修正puppeteer传递http错误 ([1b4a1d8](https://github.com/KarinJS/Karin/commit/1b4a1d868f3c06cac7d99b471aaa02c8d458f21e))
- fix: YamlEditor ([b5df6dd](https://github.com/KarinJS/Karin/commit/b5df6dd8bb81af3b44c100e5995f7496f6ea2b37))
- fix: 修正puppeteer传递http错误 ([d03171c](https://github.com/KarinJS/Karin/commit/d03171c2a5d80e0dee1e7c3bb501ba45ed95bbed))
- fix: 定时任务日志无法关闭 ([a9768dd](https://github.com/KarinJS/Karin/commit/a9768dd903aa0308081b2dd5fbb5b7ab823c749f))
- fix: 修正onebot11所有标准事件 ([db3fe15](https://github.com/KarinJS/Karin/commit/db3fe1555c95a28e9527ff18802eef0a12603559))
- fix: common.base64 ([ea5cde2](https://github.com/KarinJS/Karin/commit/ea5cde2710fb01182db24bed0df6ecc0e75c0ec3))
- fix: handler热重载错误 ([90e7fc2](https://github.com/KarinJS/Karin/commit/90e7fc2f4fda78967bbcfc6195c5b8a27c6fecd1))
- fix: 完善handler、button ([acc9416](https://github.com/KarinJS/Karin/commit/acc9416d567a9ce6c972d6aa724bb82064739ec9))
- fix: update jsdocs ([bfa79c3](https://github.com/KarinJS/Karin/commit/bfa79c365729424e1ffb8b13cbdb11759005be81))
- fix: update jsdoc ([2fb81a0](https://github.com/KarinJS/Karin/commit/2fb81a0157532565703458222754490fa48bd53b))
- fix: update jsdoc and convert user_id type ([47d4081](https://github.com/KarinJS/Karin/commit/47d4081e1043f140d2ab357b97a40fcb933be7d3))
- :art: fix: llob自身上报修复 (#5) ([8357eca](https://github.com/KarinJS/Karin/commit/8357eca9850ce32d7f8e7f47870fe1364f819814))
- :art: fix: 类型错误 ([23cb6e0](https://github.com/KarinJS/Karin/commit/23cb6e09468f6dfd0cc004c02c229c7299785706))
- :art: fix: 更正部分注释和接口 ([792aea2](https://github.com/KarinJS/Karin/commit/792aea2d9aeb916abbe749641d8c5777d702a8e2))
- :art: fix: notice_request ([108db30](https://github.com/KarinJS/Karin/commit/108db3078456bb6879a473d1415e09f832818226))
- :art: fix: kritor bot (not tested) ([32553a1](https://github.com/KarinJS/Karin/commit/32553a1d8e29c852c9b7194a15206beb903a9cfa))
- � fix: add some jsdoc ([eaf3031](https://github.com/KarinJS/Karin/commit/eaf303133e23d82b342bdf61ebce23a025ad599e))
- :art: fix: 第一次加载插件不使用随机缓存 ([97e7efc](https://github.com/KarinJS/Karin/commit/97e7efcec0b9f9f26eb7d6072e9cc789da9576c1))
- fix: 封装了简单的ob转发 ([1f8a9ba](https://github.com/KarinJS/Karin/commit/1f8a9ba53e5fc43aa04a6db01473cbe4d5a74e37))
- :art: fix: 修复部分语法错误，增加更新工具，新增一个开发依赖 ([b02f76f](https://github.com/KarinJS/Karin/commit/b02f76fefc946b8940866041f21432801fb9734a))
- :fire: fix: 修复群单独设置 热更新插件包错误 定时任务构建 ([29beb55](https://github.com/KarinJS/Karin/commit/29beb552ee4987f3d434d6a8fb13c9fe4cdc2262))
- :fire: fix: 修正rows构建错误 ([a4112f5](https://github.com/KarinJS/Karin/commit/a4112f516ce5ba9fe32c4e2b710e9bce3ff6a843))
- :fire: fix: this.e.reply_id ([57114f2](https://github.com/KarinJS/Karin/commit/57114f23a2f49147a52648f406b12f2afb54b994))
- :fire: fix: `lastIndex` ([043bca1](https://github.com/KarinJS/Karin/commit/043bca19a54544f19146b1e8337d009f49113b7b))
- :fire: fix：奇怪的日志 ([eee9c36](https://github.com/KarinJS/Karin/commit/eee9c365357016704829af40975cb770367dfd7c))
- :fire:  fix：完善Element ([6e350a2](https://github.com/KarinJS/Karin/commit/6e350a2897f6efbc07588056b4d677ab3340b1a8))
- :fire: fix：删减一些无用的代码 ([21e888c](https://github.com/KarinJS/Karin/commit/21e888c7241adde320ebb835c95eabffbab39f99))
- fix：Submodule ([01b67cb](https://github.com/KarinJS/Karin/commit/01b67cb376d8e20c522c558e6104b9a0eb8f60c7))
- fix：修复elements部分注释和描述错误 ([4550162](https://github.com/KarinJS/Karin/commit/45501623186cf3d7a300e402fd185e03bf17c272))
- fix：转发消息Api ([c8fec1f](https://github.com/KarinJS/Karin/commit/c8fec1f8b580229c7babda963d48bf320726948d))
- fix: 尝试增补部分OneBot11的Api ([016e03c](https://github.com/KarinJS/Karin/commit/016e03c3478c87cd4491e72160889c2a31e14622))
- fix：修复插件包加载非index.js ([f8e33eb](https://github.com/KarinJS/Karin/commit/f8e33ebbda4040d65759880d03d276c9d17b0b0c))
- fix：快速撤回 ([9ed425f](https://github.com/KarinJS/Karin/commit/9ed425f2bd0b17a93cefc4ea296fc1410ab90fdd))
- fix：修正部分日志，类型错误 ([f4a068d](https://github.com/KarinJS/Karin/commit/f4a068d5a49deddc4ebaa7f77e535bad2df45e9d))
- fix：del global.Karin ([1b7626a](https://github.com/KarinJS/Karin/commit/1b7626ab7b10519f66f44b8c8027296d9b40e606))
- fix：Api.js ([3d3e43d](https://github.com/KarinJS/Karin/commit/3d3e43d308279d4b1d640eff3a816d69d1c5734a))
- fix：plugins不强制要求`package.json` ([71a79b6](https://github.com/KarinJS/Karin/commit/71a79b64fc519686c1c2ee95811815520844bb86))
- fix：完善segment ([8d00023](https://github.com/KarinJS/Karin/commit/8d000238aa5405343be5cf73e1d1942057de7bf9))
- fix：onebots11 AT ([32e9478](https://github.com/KarinJS/Karin/commit/32e94789518f9090f78543adf89110a9c58e7f50))
- fix：e.at.push ([3def760](https://github.com/KarinJS/Karin/commit/3def76068d483371e5bdd7803058d774f5498cd6))
- fix：优化消息事件结构 ([59afb57](https://github.com/KarinJS/Karin/commit/59afb57af6010f25a564b801ecf0584177156ccf))
- fix：KarinRequest暂时搁置，shamrock未跟进更新 ([596e3e9](https://github.com/KarinJS/Karin/commit/596e3e9b05dd8a141c46ccc547b41b8e46e5378f))
- fix：合并转发elements转换错误 ([2dcf391](https://github.com/KarinJS/Karin/commit/2dcf391678ea17ed55ffd14c74b743e0b9a7f632))
- fix：event  notice error ([03f2415](https://github.com/KarinJS/Karin/commit/03f2415c759fdde97efc64887253a0136ecd4e0f))
- :zap:  fix：优化构建通知传参 ([5f58783](https://github.com/KarinJS/Karin/commit/5f5878383c24bf8f30fd2e1990cb5701408269ca))
- fix: recall notice log text ([0018564](https://github.com/KarinJS/Karin/commit/0018564fe2bcd6179b6d8e08ff922e52b2e8f0d7))
- :zap: fix：标准化适配器注册流程 ([a650b08](https://github.com/KarinJS/Karin/commit/a650b08af6a95b573a7b781d54c93342d1211e87))
- fix: README格式错误 (#2) ([67d80f2](https://github.com/KarinJS/Karin/commit/67d80f24a0b2d6c8eccad1b7acd0e3c0ebb04e4f))
- fix：`index.js`只在`dev`下进行热更新 ([c6fe535](https://github.com/KarinJS/Karin/commit/c6fe5352d1a12041b9caf3e418e8395cc0ac8626))
- fix：修正热更新，新增api超时 ([c6ec1c9](https://github.com/KarinJS/Karin/commit/c6ec1c92f8934b7d857635a116de934742bfe18d))
- fix: segment.button() ([847cfad](https://github.com/KarinJS/Karin/commit/847cfad3a46f5c8b83c276c737fdd8eb1f43951a))
- fix：可注册非bot适配器 ([56e5ca1](https://github.com/KarinJS/Karin/commit/56e5ca16f5c7c63d016a5959b3987f82a0331673))
- fix：完善segment ([72d1af6](https://github.com/KarinJS/Karin/commit/72d1af60eaef32f4dd95256cb5c0dc7f5a990176))
- fix：子事件监听，`puppeteer`使用内置 ([67745b6](https://github.com/KarinJS/Karin/commit/67745b6eed659daf9d275fb82b46b8b80e03c631))
- fix：构建定时任务 ([22b3d89](https://github.com/KarinJS/Karin/commit/22b3d8999431067dd332d9ee9c79696831f48bca))
- fix：plugins名称标准化 ([0a2d178](https://github.com/KarinJS/Karin/commit/0a2d178bce2348d967b90624700074491e1dfba9))
- fix：给凉菜佬改个名 ([13763a5](https://github.com/KarinJS/Karin/commit/13763a5e7ced84b2288ebfb191ab9299f748071b))
- fix：`redis`可选安装 ([c1b8e86](https://github.com/KarinJS/Karin/commit/c1b8e8665e47ed12bfea5bc2dd3d9c1eb784baed))
- fix：分离消息事件处理 ([2bbd5bd](https://github.com/KarinJS/Karin/commit/2bbd5bd077518e4a2d3892c683cae35ca8629bbd))
- fix：`static` ([c6d4856](https://github.com/KarinJS/Karin/commit/c6d4856b4038036b1cfdec7f61b1a7e55cd5d342))

### 文档更新

- docs: add repobeats ([13a58a8](https://github.com/KarinJS/Karin/commit/13a58a820b4d5c508628c514031c44980240d865))
- docs：更新 README.md ([a88bd8b](https://github.com/KarinJS/Karin/commit/a88bd8b64c9b57e7bf07e2871b6be4929f144f7f))
- docs：Update README.md (#3) ([f1ab4c2](https://github.com/KarinJS/Karin/commit/f1ab4c237396a9b901f2d2858b2f4edd223f2854))
- docs：更新 README.md ([a8a0963](https://github.com/KarinJS/Karin/commit/a8a0963ae549e2ba5120e1cfa36847331d456bc3))

### 代码重构

- refactor: 将proto迁移到npm ([408fedb](https://github.com/KarinJS/Karin/commit/408fedbd95954a46e351614791aea2bd2d38e7c7))
- :art: refactor: adapter and forward ([efb86fd](https://github.com/KarinJS/Karin/commit/efb86fdf8a22dc890be2d6c76dac2de34995f092))
- :fire: refactor: 解耦事件 完善日志 ([f02a3e2](https://github.com/KarinJS/Karin/commit/f02a3e26f6291c32017540d982feb4c046713099))
- refactor: kritor converter and struct definition ([427b524](https://github.com/KarinJS/Karin/commit/427b524aa72768c15069d566c4a1c931b85434fe))

### 其他提交

- rm gitmodules ([c4c0c57](https://github.com/KarinJS/Karin/commit/c4c0c579fedef1c172c2a7fada51c5152f95d816))
- rm eslint-plugin-import ([fae7fa3](https://github.com/KarinJS/Karin/commit/fae7fa3a1a071eefd15451084d84c426ee8c282d))
- rm scripts.build ([45e4dac](https://github.com/KarinJS/Karin/commit/45e4dacbf9b53a09463623d00ad7058f42a9a4da))
- rm .npmrc ([fb6448a](https://github.com/KarinJS/Karin/commit/fb6448a5de365762a2266072e1b76a4844435281))
- Create LICENSE ([2b5b6b0](https://github.com/KarinJS/Karin/commit/2b5b6b089e23afd371ad90107344c237662f4af2))
- :heavy_minus_sign: Update package.json ([d623748](https://github.com/KarinJS/Karin/commit/d623748f14469b7ffe59b40b54b8ceae8bff7fb1))
- use uid (#4) ([2abe1a5](https://github.com/KarinJS/Karin/commit/2abe1a531683bdd4a34b68a9d94a7f2987ae3f61))

## 0.0.1 (2024-3-21)

- :tada: 初次提交 ([9e12137](https://github.com/KarinJS/Karin/commit/9e12137b6cf0e778a28df78daaeea77d5e325f4c))
