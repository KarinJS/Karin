# 插件开发规范

[[toc]]

## 命名规范

### karin-plugin-example

> `karin-plugin-example`为存放非插件包的目录，即单个js文件插件的存放目录。

- 使用英文进行命名，无固定前缀要求
- 名称尽量简短，避免过长
- 名称避免使用特殊符号，使用`-`连接单词

例如：`hello-world.js`、`my-plugin.js`、`my-awesome-plugin.js`

### 插件包

- 插件包名称必须以`karin-plugin-`开头，后面跟插件名称
- 必须使用英文命名，尽量简短，避免使用特殊符号
- 统一为小写，使用`-`连接单词

例如：`kritor-plugin-hello`、`karin-plugin-my-plugin`、`karin-plugin-my-awesome-plugin`

## 结构规范

> 插件包的目录结构，请参照以下规范进行组织，如果特殊需求，可由开发者自行在基础结构上进行调整

### 文件结构

:::tip
以下是一个基础的结构规范，具体项目可根据实际情况进行调整
:::

```md
kritor-plugin-hello
├── apps
│   ├── app1.js
│   └── app2.js
├── config
│   ├── config
│   │   ├── config.yaml
│   │   └── user.yaml
│   └── defSet
│       ├── config.yaml
│       └── user.yaml
├── resources
│   ├── template
│   ├── font
│   ├── icon
│   ├── image
│   └── css
├── lib 
├── model
├── index.js
├── .gitignore
├── README.md
├── CHANGELOG.md
├── LICENSE
└──package.json
```

### 数据文件

- 对于`数据文件`，karin要求开发者将数据文件`统一`存放到`karin/data/`下  
- 请每个插件在`karin/data/`下创建以插件包名命名的文件夹，并将数据文件存放在该文件夹下
- 如无特殊需求，请不要在`data`文件夹下创建其他文件夹

### 配置文件

- ~~karin要求插件包的配置文件均存在热更新机制~~ 可不提供 由开发者自行处理
- 统一使用`yaml`、`json`等格式，并将`用户可编辑的配置`文件存放在插件根目录的`config/config`下  
- 对于默认配置文件，统一存放在`config/defSet/`下，由开发者进行维护修改，此处禁止用户编辑修改
- 如无特殊需求，请不要在`config`文件夹下创建其他文件夹
- 如对此处有疑问，请查看[插件包模板仓库](https://github.com/KarinJS/karin-plugin-template)进行参考

### resources

:::tip
任选其一即可，以下是两种常见的规范
:::

规范1:

- 插件包的资源文件
- 字体文件存放在`resources/font/`下
- 图片文件存放在`resources/image/`下
- 图标文件存放在`resources/icon/`下
- 通用样式文件存放在`resources/css/`下
- 渲染模板存放在`resources/template/`下，每一种模板新建一个文件夹

规范2:

- 每一种渲染模板都在`resources`下新建一个文件夹，文件夹名称为模板名称，将模板的资源文件存放在该文件夹下

### 临时文件

- karin会在启动的时候，在`karin/temp`下为每一个插件包创建对应名称的文件夹
- 开发者可在该文件夹下存放临时文件，如缓存文件、日志文件等
- 请勿对他人的文件夹进行删除、修改
- 如无特殊需求，请不要在该文件夹下创建其他文件夹。

## 仓库规范

- 要求插件仓库名称必须以`karin-plugin-`开头，必须与插件包名称一致
- 插件仓库必须提供开源协议
- 在仓库标签页，添加`karin`、`karin-plugin`
- 对于未开源的插件仓库，请遵守[插件收录规范][插件收录]
- 对于商业性质的插件仓库，也请遵守[插件收录规范][插件收录]
- 对于二改的`karin`仓库，必须进行开源，并使用`GPLv3+`协议，并使用`karin`标签进行标记

## 插件收录

请查看[插件收录规范][插件收录]

[插件收录]: ../plugins/index.md#🎉插件收录规范
