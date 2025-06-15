# Burkeen's Blog

一个使用 Next.js 14 和 Supabase 构建的现代化博客系统。

## 特性

- 🚀 使用 Next.js 14 构建，支持服务器组件和路由
- 💾 Supabase 提供数据库和认证服务
- 📝 Markdown 文章编辑器
- 🏷️ 标签管理系统
- 🖼️ 图片和附件上传
- 🎨 响应式设计
- 🔒 管理员权限控制
- ✨ 自定义鼠标指针

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- React Markdown

## 环境变量

项目需要以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm run start
```

## 部署

本项目推荐使用 Vercel 进行部署：

1. 在 GitHub 上创建仓库并推送代码
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 许可

MIT License 