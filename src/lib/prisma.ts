import { PrismaClient } from "@prisma/client";
import LibSQL from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建数据库适配器
function createAdapter() {
  if (process.env.DATABASE_URL?.startsWith("postgres://")) {
    // 生产环境使用 PostgreSQL
    const client = LibSQL.createClient({
      url: process.env.DATABASE_URL,
    });
    return new PrismaLibSQL(client);
  } else {
    // 开发环境使用 SQLite
    const client = LibSQL.createClient({
      url: "file:dev.db",
    });
    return new PrismaLibSQL(client);
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
