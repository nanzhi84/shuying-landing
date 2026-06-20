// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署目标可切换：
//   - 本地 / Vercel：base = '/'（默认）
//   - GitHub Pages 项目站点：CI 注入 PUBLIC_BASE_PATH=/shuying-landing/
const site = process.env.PUBLIC_SITE_URL || 'https://nanzhi84.github.io';
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // 用 css-variables 主题，配色由 global.css 接管以贴合「林墨」调色板
      theme: 'css-variables',
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
