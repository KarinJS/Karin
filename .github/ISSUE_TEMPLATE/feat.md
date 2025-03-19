name: 功能请求 / Feature Request
description: 向我们提交一个新功能的请求
title: "Feat: "
labels: ["enhancement"]
body:

- type: markdown
  attributes:
  value: |
  **警告**: 在进一步操作之前，请检查下列选项。如果您忽视此模板或者没有提供关键信息，您的 Issue 将直接被关闭

      - 确保您使用的是最新版本的`Karin`
      - 确保您的功能请求尚未在 Issues 列表中提出
      - 确保您的功能请求是与 `Karin` 相关的，且可以实现

- type: textarea
  id: feature-description
  attributes:
  label: 描述功能
  description: 请清晰地描述您想要的功能，并提供相关的信息。
  validations:
  required: true

- type: textarea
  id: motivation
  attributes:
  label: 动机
  description: 为什么需要这个功能？它将如何改进项目？
  validations:
  required: true

- type: textarea
  id: implementation
  attributes:
  label: 实现方法
  description: 请提供您认为可以实现此功能的方法，如果您不知道如何实现，可以留空。当然，如果您有兴趣，也可以自己实现并向我们提交 Pull Request。
  validations:
  required: false

- type: textarea
  id: alternatives
  attributes:
  label: 替代方案
  description: 是否有其他可行的替代方案？
  validations:
  required: false

- type: textarea
  id: additional-info
  attributes:
  label: 附加信息
  description: 任何额外的上下文或截图。
  validations:
  required: false
