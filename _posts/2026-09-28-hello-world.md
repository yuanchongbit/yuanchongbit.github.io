---
title: "Hello World：欢迎来到我的博客"
date: 2026-09-28
description: "博客第一篇：介绍这个站点是怎么搭起来的，之后会在这里记录我的学习笔记与技术思考。"
tags: [随笔]
mathjax: true
---

这是博客的第一篇文章。参考 [Lil'Log](https://lilianweng.github.io/) 的设计风格，我用静态站点生成器搭建了这个站点，并托管在 GitHub Pages 上。

## 为什么写博客

写博客最大的好处是**强迫自己把事情想清楚**。很多问题在脑子里感觉已经懂了，一旦要写出来，就会发现还有不少模糊的地方。

后续我计划在这里记录：

- 机器学习与深度学习的阅读笔记
- 日常开发中踩过的坑和解决方案
- 一些有趣的小项目和工具

## 这个站点是怎么搭的

写一篇文章只需要在 `_posts/` 下新建一个 Markdown 文件，文件名带上日期：

```markdown
---
title: "文章标题"
date: 2026-09-28
description: "首页列表里展示的摘要"
tags: [标签]
---

正文内容，支持 Markdown 语法。
```

保存后 `git push`，GitHub Pages 会自动构建发布，不需要任何 CI 配置。

## 图片

文章里插图用标准 Markdown 语法即可，图片文件放在 `assets/img/` 下，用绝对路径引用：

![幂律曲线示意图](/assets/img/demo.svg)

## 接下来

站点还比较简陋，我会陆续完善：文章会慢慢多起来，样式细节也会持续打磨。如果你看到了这篇文章，欢迎通过 [GitHub](https://github.com/yuanchongbit) 联系我。
