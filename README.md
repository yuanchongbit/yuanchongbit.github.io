# yuanchongbit.github.io

个人博客，参考 [Lil'Log](https://lilianweng.github.io/)（PaperMod 风格）的设计，使用 [Jekyll](https://jekyllrb.com/) 搭建，托管在 GitHub Pages。

线上地址：https://yuanchongbit.github.io

## 本地开发

```bash
bundle install
bundle exec jekyll serve    # 启动开发服务器，默认 http://localhost:4000
```

## 写文章

在 `_posts/` 下新建 Markdown 文件，文件名必须是 `YYYY-MM-DD-标题.md` 格式（日期决定文章 URL 和排序）：

```markdown
---
title: "文章标题"
description: "首页列表展示的摘要"
tags: [标签一, 标签二]
---

正文，支持 Markdown。数学公式用 $...$（行内）和 $$...$$（块级），
页面会自动启用 MathJax（由 _config.yml 的 defaults 配置）。
```

新增标签后，在 `tag/` 下建一个与标签同名的 `.md` 文件（如 `tag/随笔.md`），标签页才会生效。

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `_config.yml` | 站点标题、作者、URL、固定链接格式、defaults（改这里换名字/链接） |
| `_layouts/` | 布局：`default`（外壳）、`post`（文章页）、`page`、`tag`（标签列表页） |
| `_includes/` | 页头、页脚、图标等片段 |
| `_posts/` | 文章（Markdown） |
| `tag/` | 各标签的落地页 |
| `assets/` | 样式、脚本、favicon；明暗主题配色在 `css/style.css` 顶部变量区 |

## 部署

零配置：不需要任何 workflow。push 到 `main` 后 GitHub Pages 自动用 Jekyll 构建。

仓库 **Settings → Pages → Build and deployment → Source** 保持 **Deploy from a branch**（main /root）即可。
