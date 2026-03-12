export { auth as middleware } from "@/lib/auth";

// 保护管理后台路由
export const config = {
  matcher: ["/admin/:path*"],
};
