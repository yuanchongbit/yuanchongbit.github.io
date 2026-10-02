import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAnchor from "markdown-it-anchor";

const CJK = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g;

const slugify = (s) =>
  String(s).trim().toLowerCase().replace(/\s+/g, "-");

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.amendLibrary("md", (md) =>
    md.use(markdownItAnchor, { permalink: false, slugify })
  );

  eleventyConfig.addPassthroughCopy({
    "node_modules/fuse.js/dist/fuse.min.mjs": "assets/js/fuse.min.mjs",
  });
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  const dateFmt = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  eleventyConfig.addFilter("readableDate", (date) => dateFmt.format(date));

  eleventyConfig.addFilter("readTime", (content) => {
    const text = String(content)
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ");
    const cjkChars = (text.match(CJK) || []).length;
    const latinWords = (
      text.replace(CJK, " ").match(/[a-zA-Z0-9_''-]+/g) || []
    ).length;
    return Math.max(1, Math.ceil(cjkChars / 300 + latinWords / 220));
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    const m = String(content).match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const text = m
      ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : String(content).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return text.length > 180 ? text.slice(0, 180) : text;
  });

  eleventyConfig.addFilter("truncate", (s, n) => {
    s = String(s);
    return s.length > n ? s.slice(0, n) : s;
  });

  eleventyConfig.addFilter("plainText", (html) =>
    String(html)
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
  );

  eleventyConfig.addFilter("slugify", slugify);

  eleventyConfig.addGlobalData("year", () => new Date().getUTCFullYear());

  eleventyConfig.addFilter("containsUrl", (patterns, url) => {
    if (!url || !Array.isArray(patterns)) return false;
    return patterns.some((p) => (p === "/" ? url === "/" : url.startsWith(p)));
  });

  eleventyConfig.addFilter("groupByYear", (posts) => {
    const map = new Map();
    for (const post of posts) {
      const year = post.date.getUTCFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year).push(post);
    }
    return [...map.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({ year, posts: items }));
  });

  eleventyConfig.addFilter("toc", (content) => {
    const headings = [
      ...String(content).matchAll(/<h([23]) id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g),
    ];
    if (headings.length < 2) return "";
    let html = "<ul>";
    let inSub = false;
    for (const [, level, id, raw] of headings) {
      const text = raw.replace(/<[^>]+>/g, "").trim();
      if (level === "2") {
        if (inSub) {
          html += "</ul></li>";
          inSub = false;
        }
        html += `<li><a href="#${id}">${text}</a>`;
      } else {
        if (!inSub) {
          html += "<ul>";
          inSub = true;
        }
        html += `<li><a href="#${id}">${text}</a></li>`;
      }
    }
    if (inSub) html += "</ul></li>";
    html += "</ul>";
    return html;
  });

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("tagList", (api) => {
    const map = new Map();
    for (const post of api.getFilteredByTag("posts")) {
      for (const tag of post.data.tags || []) {
        if (tag === "posts") continue;
        map.set(tag, (map.get(tag) || 0) + 1);
      }
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh"));
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
