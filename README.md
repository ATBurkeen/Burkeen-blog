# Burkeen's Blog

一个使用 Next.js 14 和 Supabase 构建的现代化技术博客系统。

## 技术栈

- **前端框架**: Next.js 14
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **Markdown**: react-markdown + remark-gfm
- **代码高亮**: react-syntax-highlighter

## 主要功能

- 📝 Markdown 文章编写和预览
- 🏷️ 文章标签管理
- 🔍 全文搜索
- 📊 管理员仪表板
- 🖼️ 图片和附件上传
- 🔒 用户认证和授权
- 💅 响应式设计

## 快速开始

1. 克隆仓库
```bash
git clone <repository-url>
cd blog
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的 Supabase 配置
```

4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

## 部署

详细的部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## 项目结构

```
src/
├── app/                 # Next.js 14 App Router
├── components/          # React 组件
├── lib/                 # 工具函数和配置
├── styles/             # 全局样式
└── types/              # TypeScript 类型定义
```

## 数据库结构

### 用户表 (users)
- id: uuid (主键)
- email: string
- role: enum ('admin', 'user')
- created_at: timestamp
- updated_at: timestamp

### 文章表 (posts)
- id: int8 (主键)
- title: string
- slug: string (唯一)
- content: text
- description: text
- cover_image: string
- published: boolean
- author_id: uuid (外键 -> users.id)
- created_at: timestamp
- updated_at: timestamp

### 标签表 (tags)
- id: int8 (主键)
- name: string
- slug: string (唯一)
- created_at: timestamp
- updated_at: timestamp

### 文章标签关联表 (posts_tags)
- post_id: int8 (外键 -> posts.id)
- tag_id: int8 (外键 -> tags.id)
- created_at: timestamp

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件 