## 插件包开发指南

本文档将指导您如何开发 karin 插件包。

打开[模板仓库](https://github.com/KarinJS/karin-plugin-template)

## 克隆模板仓库
点击`Use this template`或`使用此模板`按钮，创建自己的仓库。
![](https://cdn.jsdelivr.net/gh/Zyy955/imgs/img/202404121412587.png)

填写仓库名称，描述，选择是否公开。
![](https://cdn.jsdelivr.net/gh/Zyy955/imgs/img/202404121414580.png)

## 克隆仓库到本地

以下命令，在karin根目录执行
```bash
git clone https://github.com/karinjs/karin-plugin-template.git ./plugins/karin-plugin-template.
```

## 安装依赖

```bash
pnpm install --filter=karin-plugin-template
```

## 开发者模式启动

```bash
node . --dev
```

