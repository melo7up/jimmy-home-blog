import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 调试接口：查看所有文章
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        published: post.published,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("调试接口错误:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
