---
outline: [2, 4]
---

# 遇到问题了咋办

> 任何事物都不可能尽善尽美，Karin 也是如此。

如果你在使用 Karin 的过程中遇到了任何问题（包括但不限于如何登录、无法连接渲染器等），请认真阅读并充分理解下述内容，这会对你有帮助。

## 遇到问题后的第一反应

<div align="center" style="line-height: 1.5em; font-size: 1.5em; padding: 2em 1em; margin: 2em 0; border: 1px solid var(--vp-c-text-1); border-radius: 8px">不要急，也不要慌，更不要气急败坏。</div>

大部分情况下，Karin 是可以正常运行的。

👉 所以在遇到问题时，你应该**检查一下是不是你自己的问题**，包括但不限于：网络错误、操作错误和用户配置错误。所以，<mark>在提问之前，请先以自己的经验判断一下，这是不是你自己的问题</mark>。

👉 其次，你应该**阅读一遍 [**《常见问题解答 / FAQ》**](./faq.md)**。<mark>很多情况下你遇到的问题也曾经困扰过很多人，并且已经被总结出了解决方案。</mark>这种情况下，直接查阅这份 FAQ 能更快地解决你的问题。

<NCard title="🤔 常见问题解答 / FAQ" link="faq/">
说不定就有你正在努力寻找的答案。
</NCard>

如果你确定不是你自己的问题，并且你遇到的问题并未列举在 FAQ 中，你可以着手准备报告问题了。

## 开发团队，或是帮助你的人，并不是神

看起来你们大多数人好像都不知道的样子？

那就让我们来告诉你们一个真理吧：

<div align="center" style="padding: 2em; margin: 2em 0; border: 1px solid var(--vp-c-text-1); border-radius: 8px">
<p align="left">Troubleshooting any problem without the error log is like driving with your eyes closed.</p>
<p align="right" style="font-size: 1.15em">在没有错误日志的情况下诊断任何问题无异于闭眼开车。</p>
</div>

也就是说，不管是谁，都 **很难通过只言片语快速定位你的问题**！

所以，在每一次报告问题时，<mark>不要只丢下一句「适配器报错了」、「连不上上唧唧人了」就跑了。在没有日志、报错截图等信息的辅助下，我们 **不可能** 知道网线对面的你到底遇到了什么问题。</mark>

为了得到高效且愉悦的帮助，建议你按照以下步骤来报告问题 :point_down:

## 我应该提供哪些信息？

可能需要视情况而定。这里列举几个通用的，重点部分已被我们加粗。

> [!NOTE] 感觉看不懂？
> 如果你难以判断你需要提供哪些内容，请尽可能详细地描述你的问题，我们的支持团队会指导你提供相关信息。

### 1. 报错截图 <Badge type="info" text="控制台" />

如果是 Karin 的问题，发生错误时，Karin 应该会给出相应的提示。一般情况下都是红色的错误警告。
<mark>**请把相关的提示乃至整个屏幕截图**，并在提问时提供。</mark>

### 2. 复现步骤 <Badge type="info">控制台</Badge><Badge type="info">适配器</Badge><Badge type="info" text="聊天记录" />

许多问题 **只会在特定的操作下出现** 。提供复现步骤可以让我们了解你的问题是在何种操作下出现的，并快速定位问题所在和解决问题。

你可以从以下四个问题入手：

1. 你想要进行什么操作？为的是达到什么目的？
2. 在问题发生之前，你分别都进行了哪些操作？
3. <Badge type="info" text="控制台" /> 你正在使用什么版本的 Node.js？你的操作系统是什么？网络环境是什么？
4. <Badge type="info" text="适配器" /> 你使用的是哪个适配器？是否已经更新到最新版本？
5. <Badge type="info" text="聊天记录" /> 你是否可以提供一些关于问题的聊天记录？（次要）

若能在提问时提供上述信息，则将极大提高我们提供精准服务的效率。

### 3. 日志 <Badge type="info" text="控制台" />

日志文件记录了程序在运行过程中的详细信息，包括操作记录、错误提示、警告信息等。

日志之所以被设计出来，就是因为它可以帮助支持人员快速定位问题的根源，从而提供更准确的解决方案。

各种日志是侦错时不可缺少的信息，所以如果有，提问时请带上这些日志：

<mark>提供日志时，**请发送完整的日志截图，最好不要使用手机摄像头拍摄** 。如果没有这些日志，请在提问时说明清楚；如果你提问后被要求提供更多信息，请提供我们要求的信息以帮助我们查找问题。</mark>

## 我该去哪里提问？

<p style="margin-bottom: 2em"></p>

<NCard title="🙋 获取即时支持" link="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=kDN3vwVj8Qozw94TWX69r24vxrWqkgMy&authKey=NxnqHYmo8037jCeDkO9yIFPOdQxkKa4JlxC%2FAV6UNxwGc%2FwKEVoogi44syB3BWuC&noverify=0&group_code=967068507" >
你可以加入我们的官方用户交流群来提问
</NCard>
<NCard title="📬️ 通过 GitHub issue" link="https://github.com/KarinJS/Karin/issues/new/choose" >
也可以给通过创建新的 GitHub issue 工单
</NCard>