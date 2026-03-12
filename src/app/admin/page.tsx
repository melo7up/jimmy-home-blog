import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true, email: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">管理后台</h1>
          <p className="text-muted-foreground mt-1">
            欢迎，{session.user?.name || session.user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/editor">新建文章</Link>
          </Button>
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" variant="outline">退出登录</Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文章管理</CardTitle>
          <CardDescription>
            管理您的所有博客文章
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-3 px-4 font-medium">标题</th>
                  <th className="py-3 px-4 font-medium">状态</th>
                  <th className="py-3 px-4 font-medium">分类</th>
                  <th className="py-3 px-4 font-medium">作者</th>
                  <th className="py-3 px-4 font-medium">发布时间</th>
                  <th className="py-3 px-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/editor/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {post.category?.name || "-"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {post.author.name || post.author.email}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {post.publishedAt
                        ? format(post.publishedAt, "yyyy-MM-dd", {
                            locale: zhCN,
                          })
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/editor/${post.id}`}>编辑</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            查看
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                暂无文章，点击上方按钮创建第一篇
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
