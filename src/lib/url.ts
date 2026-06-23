/**
 * 统一处理 base path（GitHub Pages 项目站点子路径 / Vercel 根路径都能跑）。
 * import.meta.env.BASE_URL 由 astro.config 的 `base` 决定，始终以 '/' 结尾。
 */
const RAW_BASE = import.meta.env.BASE_URL;

/** 站内链接 / 资源前缀。url('/blog') -> '/<base>/blog'，url('/') -> '/<base>/' */
export function url(path = "/"): string {
  const base = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}` || "/";
}

/** public/ 下的静态资源（图片、海报、SVG 等） */
export function asset(path: string): string {
  return url(path);
}

/** 媒体智能前缀：本地绝对路径过 base，远程(http/data)原样返回 */
export function mediaSrc(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return asset(path);
}
