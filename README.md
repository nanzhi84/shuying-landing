# 树影 Shuying · 官网与技术博客

> Case-first 数字人短视频内容生产系统 **Cutagent** 的官方静态站点。
> 简洁、自然、面向 B 端与投资人；内置兼容图片 / 视频（带图注 caption）的 Markdown 技术博客。

基于 **Astro 5 + MDX + Tailwind CSS v4**，输出纯静态 HTML，近零 JavaScript，可一键部署到 GitHub Pages、Vercel 或任意静态托管。

---

## 快速开始

```bash
npm install
npm run dev        # 本地开发： http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 本地预览构建产物
```

> 需要 Node ≥ 18.20（推荐 20+）。

---

## 设计语言

视觉概念源自品牌名「树影」—— **光与影**：深林墨色暗场（影）+ 斑驳日光琥珀光迹（光），落到产品上恰好是「把内容生产锻造成工业流水线」。

| Token | 值 | 含义 |
| --- | --- | --- |
| `--color-ink` | `#14241c` | 林墨黑（暗场 / 正文） |
| `--color-paper` | `#f6f7f4` | 沙纸白（亮场画布） |
| `--color-pine` | `#2f6b4f` | 松绿（主色） |
| `--color-sun` | `#d9a441` | 斑驳日光琥珀（点睛色） |

- 字体：**Space Grotesk**（标题 / 字标）· **IBM Plex Sans** + 系统 CJK 字栈（正文）· **IBM Plex Mono**（数据 / 节点名 / caption / 代码）。
- 签名元素：首页暗场中**发光的 16 节点流水线**，载入时一束光迹沿左脊逐节点扫过。

改色板 / 字体 → `src/styles/global.css` 的 `@theme`。

---

## 内容怎么改

**所有首页 / 产品 / 关于 / 联系页的文案与产品数据，集中在一个文件：**

```
src/lib/site.ts      # 公司信息、导航、能力矩阵、16 节点、统计、demo、联系方式
```

改文案只动这里，组件只负责呈现。

---

## 写博客

在 `src/content/blog/` 下新建 `.mdx`（或 `.md`）文件即可，按 `pubDate` 倒序自动出现在 `/blog`。

````mdx
---
title: "文章标题"
description: "一句话摘要，用于列表与 SEO。"
pubDate: 2026-06-20
author: "树影团队"
tags: ["工程", "渲染"]
cover: "/covers/your-cover.svg"   # 可选，放在 public/ 下
readingTime: "6 分钟"             # 可选
draft: false                      # true 则不发布
---

import Figure from "../../components/mdx/Figure.astro";
import Video from "../../components/mdx/Video.astro";
import Callout from "../../components/mdx/Callout.astro";

正文用标准 Markdown。下面是三个内置组件：

<Figure src="/blog/shot.png" alt="..." caption="图 1 · 说明文字" credit="来源" />

<Video src="https://cdn/clip.mp4" poster="/covers/x.svg" caption="视频 1 · 成片演示" ratio="16 / 9" />

<Callout type="tip" title="提示">支持 note / tip / warn 三种。</Callout>
````

### 媒体 + 图注（caption）

- **`<Figure>`** —— 图片 + 图注。支持本地（`public/`）与远程图片、`wide` 宽幅出血、`credit` 署名。
- **`<Video>`** —— 视频 + 图注。兼容流媒体：`src` 可为远程 `.mp4` / `.webm`，或 `.m3u8`（HLS，自动渐进加载 hls.js 播放）。
- **`<Callout>`** —— 提示框。

> 这三个组件已通过 `src/pages/blog/[...slug].astro` 注入 MDX，文章里直接写即可（顶部 import 让 IDE 类型提示更准）。

---

## 项目结构

```
src/
  components/        # Logo · Nav · Footer · Pipeline(签名) · 卡片 …
    mdx/             # Figure · Video · Callout —— 博客媒体组件（带 caption）
  layouts/           # BaseLayout · BlogPost
  pages/             # index · product · about · contact · 404 · blog/ · rss.xml.js
  content/blog/      # 博客文章（.mdx）
  lib/               # site.ts(内容源) · url.ts(base 处理) · date.ts
  styles/            # global.css(设计系统) · prose.css(正文排版)
public/              # favicon · brand/og · covers/ · posters/
```

---

## 部署

### GitHub Pages（已内置 CI）

`.github/workflows/deploy.yml` 在推到 `main` 时自动构建并发布。仓库 **Settings → Pages → Source 选 GitHub Actions** 即可。

子路径由环境变量控制（项目站点默认 `/<repo>/`）：

```yaml
env:
  PUBLIC_BASE_PATH: /shuying-landing/
  PUBLIC_SITE_URL: https://<user>.github.io
```

### Vercel / Netlify / 自定义域名

根路径部署，无需子路径：构建命令 `npm run build`，产物目录 `dist/`，并把 `PUBLIC_BASE_PATH` 设为 `/`（或不设，默认即 `/`）、`PUBLIC_SITE_URL` 设为你的域名。

---

## 待替换的占位内容

上线前请替换：

- `src/lib/site.ts` 里的邮箱、域名、社交链接。
- 首页 demo 视频占位（`src/components/DemoCard.astro` 传入真实 `src` / `poster`）。
- 博客 `frame-exact-render.mdx` 中的示例视频，替换为真实成片。

---

© 2026 树影 Shuying · MIT License
