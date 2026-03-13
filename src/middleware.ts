// 本地开发环境 - 禁用中间件认证
// 生产环境请移除 // @ts-nocheck 并恢复以下内容:
// export { auth as middleware } from "@/lib/auth";
// export const config = { matcher: ["/admin/:path*"] };

// @ts-nocheck
export function middleware() {
  // 本地开发环境不做认证
}

export const config = {
  matcher: [], // 本地开发不拦截任何路由
};
