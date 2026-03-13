import { prisma } from "@/lib/prisma";
import { markdownToExcerpt } from "@/lib/markdown";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getRecentPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true },
      },
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[var(--color-mavericks-navy)] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Jimmy Home
          </h1>
          <p className="text-xl text-[var(--color-mavericks-silver)] max-w-2xl mx-auto mb-8">
            NBA 独行侠主题个人博客 - 记录生活和分享心得体会
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/blog">
              <Button size="lg" className="bg-[var(--color-mavericks-royal)] hover:bg-[var(--color-mavericks-royal)]/90">
                浏览文章
              </Button>
            </Link>
            <Link href="/nba">
              <Button size="lg" className="bg-gradient-to-r from-[#002B5E] to-[#0053BC] text-white border-white hover:from-[#0053BC] hover:to-[#002B5E] font-semibold">
                🏀 NBA 专区
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">最新文章</h2>
          <Link href="/blog">
            <Button variant="ghost">查看全部 →</Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              暂无文章，敬请期待
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col space-y-3 rounded-lg border p-5 transition-shadow hover:shadow-md"
              >
                {post.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="object-cover transition-transform group-hover:scale-105"
                      width={400}
                      height={200}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <time
                    dateTime={post.publishedAt?.toISOString()}
                    className="text-sm text-muted-foreground"
                  >
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "yyyy 年 MM 月 dd 日", {
                          locale: zhCN,
                        })
                      : "未发布"}
                  </time>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="mt-1 text-xl font-semibold group-hover:text-[var(--color-mavericks-royal)]">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {post.excerpt || markdownToExcerpt(post.content, 100)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* NBA Section CTA */}
      <section className="bg-gradient-to-r from-[#002B5E] via-[#0053BC] to-[#B8C4CA] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
            🏀 NBA 专区
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            获取达拉斯独行侠队最新赛程、比分和资讯
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/nba">
              <Button size="lg" className="bg-white text-[#002B5E] hover:bg-white/90 font-semibold">
                🏀 进入 NBA 专区
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
