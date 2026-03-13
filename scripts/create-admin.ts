import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log("开始创建管理员用户...");

  // 管理员信息
  const email = "admin@jimmyhome.com";
  const password = "Admin123456"; // 初始密码
  const name = "Jimmy";

  try {
    // 检查是否已存在管理员
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("管理员用户已存在，跳过创建");
      console.log("邮箱:", existingUser.email);
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建管理员用户
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log("✅ 管理员用户创建成功！");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("邮箱:", adminUser.email);
    console.log("密码:", password);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("请登录 /admin/login 访问管理后台");
  } catch (error) {
    console.error("创建管理员用户失败:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
