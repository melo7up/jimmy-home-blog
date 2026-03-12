import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GET - 获取所有文章
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true, email: true } },
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

// POST - 创建新文章
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, content, excerpt, coverImage, categoryId, tagIds, published } = body;

  // 获取作者（第一个用户作为默认作者）
  const author = await prisma.user.findFirst();
  if (!author) {
    return NextResponse.json({ error: "未找到作者" }, { status: 404 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published: published || false,
      publishedAt: published ? new Date() : null,
      authorId: author.id,
      categoryId: categoryId || null,
      tags: tagIds
        ? {
            create: tagIds.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");

  return NextResponse.json(post);
}
