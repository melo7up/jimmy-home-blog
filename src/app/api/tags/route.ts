import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - 获取所有标签
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(tags);
}

// POST - 创建标签
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug } = body;

  const tag = await prisma.tag.create({
    data: {
      name,
      slug,
    },
  });

  return NextResponse.json(tag);
}
