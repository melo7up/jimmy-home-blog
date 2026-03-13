import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - 获取单篇文章
export async function GET(_: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT - 更新文章
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, excerpt, coverImage, categoryId, tagIds, published } = body;

  const existingPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  // 处理发布状态变化
  const willPublish = published && !existingPost.published;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      publishedAt: willPublish ? new Date() : existingPost.publishedAt,
      categoryId: categoryId || null,
      tags: tagIds
        ? {
            deleteMany: {},
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
  if (slug !== existingPost.slug) {
    revalidatePath(`/blog/${existingPost.slug}`);
  }
  revalidatePath(`/blog/${slug}`);

  return NextResponse.json(post);
}

// DELETE - 删除文章
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/blog");
  revalidatePath("/");

  return NextResponse.json({ success: true });
}
