import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 首次访问时自动创建管理员用户
// 生产环境使用后请删除此文件
export async function GET() {
  try {
    // 检查是否已存在用户
    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "管理员用户已存在",
        email: existingUser.email,
      });
    }

    // 创建管理员用户
    const email = "admin@jimmyhome.com";
    const password = "Admin123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.create({
      data: {
        email,
        name: "Jimmy",
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "管理员用户创建成功",
      email: adminUser.email,
      password: password, // 仅首次显示
      loginUrl: "/admin/login",
    });
  } catch (error) {
    console.error("创建管理员失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "创建管理员失败",
      },
      { status: 500 }
    );
  }
}
