---
title: "用 Eleventy 搭建 GitHub Pages 博客"
date: 2026-07-10
description: "从零开始用 Eleventy 搭建个人博客的完整记录：项目结构、模板系统、明暗主题、客户端搜索和 CI 自动部署。"
tags: [工具, 教程]
---

记录一下用 Eleventy 从零到部署搭建博客的过程，也作为静态站点生成器的入门笔记。

## 为什么选 Eleventy

在 Jekyll、Hugo 和 Eleventy 之间纠结过一阵，最后选 Eleventy 的理由：

1. **纯 Node 生态**，不需要额外装 Ruby 或 Hugo 二进制；
2. **不绑定前端框架**，模板就是普通 HTML，想怎么写就怎么写；
3. 构建速度对个人博客规模绰绰有余。

## 项目结构

```
blog/
├── eleventy.config.js      # 构建配置：集合、过滤器、插件
├── src/
│   ├── _data/site.json     # 站点元数据（标题、作者、社交链接）
│   ├── _includes/          # 布局和可复用片段
│   ├── assets/             # CSS / JS / favicon
│   ├── posts/              # Markdown 文章，文件名即 URL slug
│   ├── index.njk           # 首页：欢迎区 + 文章列表
│   ├── archives.njk        # 按年归档
│   ├── tag.njk             # 标签文章页（分页生成）
│   └── search.njk          # 客户端搜索
└── .github/workflows/      # GitHub Actions 部署
```

## 几个关键实现

### 集合与排序

文章是 `src/posts/` 下的 Markdown，通过目录级数据文件统一打上 `posts` 标签，再用集合排序：

```js
eleventyConfig.addCollection("posts", (api) =>
  api.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
);
```

### 明暗主题

和 PaperMod 一样的策略：在 `body` 开头放一段内联脚本，页面渲染前就根据 `localStorage` 或系统偏好挂上 `.dark` 类，避免闪烁。配色全部走 CSS 变量，切换主题只是换一组变量值。

### 客户端搜索

构建时生成一个 `search-index.json`（标题 + 标签 + 正文纯文本），浏览器里用 [Fuse.js](https://fusejs.io/) 做模糊搜索。文章量在几百篇以内时体验完全够用，不需要后端。

### 阅读时长

简单的字数统计：中文按每分钟 300 字、英文按每分钟 220 词估算，向上取整。

## 部署

仓库里放了 GitHub Actions 工作流，`npm run build` 之后把 `_site` 目录交给官方的 Pages Action 部署。仓库设置里把 **Pages 来源改成 GitHub Actions** 即可。

## 踩过的坑

- 中文标题的锚点链接：默认 slugify 会把中文全部丢掉，需要自定义 slugify 保留 Unicode 字符；
- 日期时区：frontmatter 里的日期按 UTC 解析，格式化时也要显式指定 UTC，否则东八区早上的文章会显示成前一天。

整体下来，一个带归档、标签、搜索、RSS 的博客，核心代码不到一千行，维护成本很低。如果你更看重零配置，Jekyll 配合 GitHub Pages 的 branch 部署也完全够用，见另一篇对比。
