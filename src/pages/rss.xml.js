import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../lib/site";
import { url } from "../lib/url";

export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  return rss({
    title: `${site.nameCN} ${site.nameEN} · 技术博客`,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: new URL(url(`/blog/${post.id}`), context.site).href,
      categories: post.data.tags,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
