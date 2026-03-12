import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - 获取所有分类
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

// POST - 创建分类
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description } = body;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  return NextResponse.json(category);
}
