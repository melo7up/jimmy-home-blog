#!/usr/bin/env node
/**
 * 创建初始管理员用户脚本
 * 使用方法：node scripts/create-admin.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log("\n🔧 创建管理员用户\n");

  // 检查是否已有用户
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    console.log(`⚠️  已存在用户：${existingUser.email}`);
    console.log("是否继续创建新用户？(y/n)");
    const answer = await question("> ");
    if (answer.toLowerCase() !== "y") {
      rl.close();
      return;
    }
  }

  console.log("请输入管理员信息：\n");

  const email = await question("邮箱：");
  if (!email || !email.includes("@")) {
    console.log("❌ 无效的邮箱地址");
    rl.close();
    return;
  }

  const name = await question("姓名（可选）：");

  const password = await question("密码：");
  if (password.length < 6) {
    console.log("❌ 密码长度至少为 6 位");
    rl.close();
    return;
  }

  const passwordConfirm = await question("确认密码：");
  if (password !== passwordConfirm) {
    console.log("❌ 两次输入的密码不一致");
    rl.close();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
      },
    });

    console.log("\n✅ 管理员用户创建成功！\n");
    console.log(`邮箱：${user.email}`);
    console.log(`ID: ${user.id}`);
    console.log("\n现在可以使用此账号登录管理后台了。\n");
  } catch (error) {
    console.error("\n❌ 创建失败:", error.message);
    if (error.code === "P2002") {
      console.log("该邮箱已被注册，请使用其他邮箱。");
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin().catch(console.error);
