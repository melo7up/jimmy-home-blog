# Jimmy Home 个人博客

NBA 独行侠主题个人博客网站，用于记录生活和分享心得体会。

## 技术栈

- **前端**: Next.js 16 + React + TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma 7
- **图片存储**: Vercel Blob Storage
- **认证**: NextAuth.js
- **部署**: Vercel

## 独行侠主题色

- 主色：海军蓝 `#002B5E`
- 辅色：皇家蓝 `#0053BC`
- 强调色：银灰色 `#B8C4CA`

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd jimmy-home-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置数据库连接字符串。

### 4. 初始化数据库

```bash
npm run db:migrate
```

### 5. 创建管理员用户

```bash
npm run db:seed
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
jimmy-home-blog/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── admin/        # 管理后台
│   │   ├── api/          # API 路由
│   │   ├── blog/         # 博客文章
│   │   └── nba/          # NBA 专区
│   ├── components/       # React 组件
│   └── lib/              # 工具函数
├── prisma/
│   └── schema.prisma     # 数据库模型
├── scripts/
│   └── create-admin.js   # 创建管理员脚本
└── .env.example          # 环境变量示例
```

## 功能特性

- ✅ 博客文章管理（创建/编辑/删除）
- ✅ Markdown 编辑器
- ✅ 图片上传（Vercel Blob）
- ✅ 分类和标签
- ✅ 深色模式切换
- ✅ 响应式设计
- ✅ NBA 专区
- ✅ 管理员认证

## 部署

### Vercel 部署

1. 安装 Vercel CLI

```bash
npm i -g vercel
```

2. 登录 Vercel

```bash
vercel login
```

3. 部署

```bash
vercel
```

### 环境变量

在 Vercel 项目中设置以下环境变量：

- `DATABASE_URL` - PostgreSQL 连接字符串
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob 令牌
- `NEXTAUTH_SECRET` - NextAuth 密钥（openssl rand -base64 32）
- `NEXTAUTH_URL` - 你的网站 URL

## 数据库模型

- **User** - 管理员用户
- **Post** - 博客文章
- **Category** - 文章分类
- **Tag** - 标签
- **PostTag** - 文章 - 标签关联

## 许可证

MIT
