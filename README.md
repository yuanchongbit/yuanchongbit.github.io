# yuanchongbit.github.io

个人博客，参考 [Lil'Log](https://lilianweng.github.io/)（PaperMod 风格）的设计，使用 [Eleventy](https://www.11ty.dev/) 搭建，托管在 GitHub Pages。

线上地址：https://yuanchongbit.github.io

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器，默认 http://localhost:8080
```

## 写文章

在 `src/posts/` 下新建 Markdown 文件，文件名即 URL（建议 `YYYY-MM-DD-slug.md`）：

```markdown
---
title: "文章标题"
date: 2026-01-01
description: "首页列表展示的摘要"
tags: [posts, 标签一]
---

正文，支持 Markdown。数学公式用 $...$（行内）和 $$...$$（块级）。
```

保存后刷新浏览器即可看到效果。

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `src/_data/site.json` | 站点标题、作者、简介、社交链接（改这里换名字/链接） |
| `src/_includes/` | 布局（`layouts/`）与页头页脚、图标片段 |
| `src/assets/` | 样式、脚本、favicon；明暗主题配色在 `css/style.css` 顶部变量区 |
| `src/posts/` | 文章（Markdown） |
| `src/*.njk` | 各页面：首页、归档、标签、搜索、About、RSS、sitemap |

## 部署

仓库已包含 `.github/workflows/deploy.yml`，push 到 `main` 后自动构建并部署。

首次使用需在 GitHub 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
