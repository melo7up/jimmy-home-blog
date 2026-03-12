import { prisma } from "@/lib/prisma";
import { markdownToExcerpt } from "@/lib/markdown";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
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
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">博客文章</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          记录生活和分享心得体会
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            暂无文章，敬请期待
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col space-y-2 rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              {post.coverImage && (
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover transition-transform group-hover:scale-105"
                    width={800}
                    height={400}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <time
                    dateTime={post.publishedAt?.toISOString()}
                    className="flex items-center gap-1"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "yyyy 年 MM 月 dd 日", {
                          locale: zhCN,
                        })
                      : "未发布"}
                  </time>
                  {post.category && (
                    <>
                      <span>·</span>
                      <span className="text-[var(--color-mavericks-royal)]">
                        {post.category.name}
                      </span>
                    </>
                  )}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight group-hover:text-[var(--color-mavericks-royal)]">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 flex-1 text-muted-foreground">
                  {post.excerpt ||
                    markdownToExcerpt(post.content, 150)}
                </p>
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
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
