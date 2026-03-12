import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {
      title: "文章未找到",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        {post.coverImage && (
          <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {post.category && (
            <span className="text-[var(--color-mavericks-royal)] font-medium">
              {post.category.name}
            </span>
          )}
          {post.category && post.publishedAt && <span>·</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>
              {format(post.publishedAt, "yyyy 年 MM 月 dd 日", { locale: zhCN })}
            </time>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--color-mavericks-navy)] flex items-center justify-center text-white text-sm font-medium">
              {post.author.name?.[0]?.toUpperCase() ||
                post.author.email[0].toUpperCase()}
            </div>
            <span className="text-sm text-muted-foreground">
              {post.author.name || post.author.email}
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-[var(--color-mavericks-silver)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--color-mavericks-navy)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      <div
        className="prose prose-zinc dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-[var(--color-mavericks-navy)]
          dark:prose-headings:text-[var(--color-mavericks-silver)]
          prose-a:text-[var(--color-mavericks-royal)] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-[var(--color-mavericks-royal)]
          prose-code:text-[var(--color-mavericks-navy)]
          dark:prose-code:text-[var(--color-mavericks-silver)]
          prose-pre:bg-[var(--color-mavericks-navy)] prose-pre:text-white
          prose-hr:border-[var(--color-mavericks-silver)]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
