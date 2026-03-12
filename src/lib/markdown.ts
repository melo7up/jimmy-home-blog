import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

/**
 * 将 Markdown 转换为 HTML
 */
export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}

/**
 * 将 Markdown 转换为纯文本（用于摘要）
 */
export function markdownToExcerpt(markdown: string, maxLength = 200) {
  // 简单移除 markdown 语法
  const text = markdown
    .replace(/#+\s/g, "") // 移除标题
    .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗体
    .replace(/\*(.*?)\*/g, "$1") // 移除斜体
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 移除链接
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`.*?`/g, "") // 移除行内代码
    .replace(/\n/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
