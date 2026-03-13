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

### Vercel 部署（详细步骤）

#### 步骤 1：登录 Vercel

访问 https://vercel.com 并使用 GitHub 账号登录

#### 步骤 2：导入项目

1. 访问 https://vercel.com/new
2. 点击 **"Import Git Repository"**
3. 在 "Git Repository" 标签下找到并选择 `melo7up/jimmy-home-blog`
4. 点击 **"Import"**

#### 步骤 3：配置项目

1. **Project Name**: `jimmy-home-blog`
2. **Framework Preset**: Next.js（自动检测）
3. **Root Directory**: `./`（默认）
4. **Build Command**: `prisma generate && prisma migrate deploy && npm run build`
5. **Output Directory**: `.next`（默认）

#### 步骤 4：添加 PostgreSQL 数据库

1. 在部署页面点击 **"Add Database"**
2. 选择 **"PostgreSQL"**
3. 选择 **"Vercel Postgres"** 或 **"Neon Postgres"**（推荐 Neon，免费）
   - 如果使用 Neon: 访问 https://neon.tech 创建免费数据库
   - 复制连接字符串（Connection String）

#### 步骤 5：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL 连接字符串 |
| `NEXTAUTH_SECRET` | `随机生成的 32 位密钥` | NextAuth 密钥 |
| `NEXTAUTH_URL` | `https://your-site.vercel.app` | 部署后的域名 |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_...` | Vercel Blob 令牌（可选，用于图片上传） |

**生成 NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### 步骤 6：部署

1. 点击 **"Deploy"**
2. 等待部署完成（约 2-3 分钟）
3. 访问分配的域名查看网站

#### 步骤 7：创建管理员

部署完成后，在 Vercel 项目页面：
1. 点击 **"Storage"** 标签
2. 点击数据库的 **"Browse"**
3. 或者使用 Vercel CLI 运行：
```bash
vercel run db:seed
```

### 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

## 数据库模型

- **User** - 管理员用户
- **Post** - 博客文章
- **Category** - 文章分类
- **Tag** - 标签
- **PostTag** - 文章 - 标签关联

## 许可证

MIT
