export const SITE_CONFIG = {
  name: "Jimmy Home",
  description: "NBA 独行侠主题个人博客 - 记录生活和分享心得体会",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  author: {
    name: "Jimmy",
    email: "jimmy@example.com",
  },
  theme: {
    // 独行侠主题色
    navy: "#002B5E", // 海军蓝 - 主色
    royal: "#0053BC", // 皇家蓝 - 辅色
    silver: "#B8C4CA", // 银灰色 - 强调色
  },
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
};

export type SiteConfig = typeof SITE_CONFIG;
