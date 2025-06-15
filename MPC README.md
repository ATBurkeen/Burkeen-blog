## 🧠 项目名称：Burkeen's Blog

基于 Next.js + Supabase 构建的个人博客平台，展示个人技术能力，支持 Markdown 文章发布、图片嵌入、代码高亮、PDF/DOCX 附件上传、全文搜索、标签导航和用户登录控制，仅限本人后台管理，界面风格现代化卡片式。

### 🎯 目标
构建一个部署在云端的技术博客网站，展示个人技术能力，支持 Markdown 文章发布、图片嵌入、代码高亮、PDF/DOCX 附件上传、全文搜索、标签导航和用户登录控制，仅限本人后台管理，界面风格现代化卡片式。

---

### 📌 技术栈
- **前端框架**：Next.js 14 + TypeScript + Tailwind CSS
- **后端服务**：Next.js API Routes + Supabase
- **数据库**：Supabase PostgreSQL（文章、标签、用户）
- **身份验证**：Supabase Auth（仅注册一个管理员账号）
- **文件存储**：Supabase Storage（仅允许上传 `.pdf`、`.docx`）
- **全文搜索**：Supabase pg_search
- **部署平台**：Vercel（域名自定义）

---

### 🔄 项目迭代过程

#### 第一阶段：项目初始化与基础设置
1. 使用 `create-next-app` 创建项目，配置 TypeScript 和 Tailwind CSS
2. 设置 Supabase 项目，创建数据库表结构
3. 实现基础的用户认证系统
4. 创建核心数据模型：文章、标签、用户表

#### 第二阶段：核心组件开发
1. 实现导航栏（Navbar）组件
   - 响应式设计
   - 用户登录状态显示
   - 导航菜单
2. 搜索栏（SearchBar）组件
   - 实时搜索功能
   - 搜索结果展示
3. 文章卡片（ArticleCard）组件
   - 现代化卡片布局
   - 图片预览
   - 标签显示

#### 第三阶段：功能完善
1. Markdown 编辑器实现
   - 支持实时预览
   - 代码高亮
   - 图片上传
2. 标签系统
   - 标签 CRUD
   - 文章-标签关联
3. 搜索功能优化
   - 全文搜索实现
   - 搜索结果排序

#### 第四阶段：性能优化与问题修复
1. 客户端组件优化
   - 将 SearchBar 和 Navbar 标记为客户端组件
   - 创建 SearchBarWrapper 解决服务端渲染问题
2. 性能优化
   - 图片懒加载
   - 组件代码分割
   - API 响应缓存

#### 第五阶段：中文本地化
- 将界面文本转换为中文
- 优化中文搜索体验
- 适配中文字体显示

---

### 🧩 模块功能设计

#### ✅ 文章管理
- Markdown 支持
  - 实时预览
  - 语法高亮
  - 图片上传（base64 或外链）
- 附件上传（仅 pdf/docx）
  - 文件大小限制
  - 类型验证
- 代码高亮（Prism.js）
  - 支持多种编程语言
  - 自定义主题
- 标签添加（多对多关联）
  - 动态标签创建
  - 标签筛选
- 文章预览 & 编辑
  - 草稿保存
  - 版本历史

#### ✅ 用户登录（仅博主）
- 使用邮箱 + 密码登录
- 只允许管理员账号存在
- 登录状态持久化
- 安全退出功能

#### ✅ 搜索系统
- 全文搜索：标题、内容、标签关键字
  - 实时搜索提示
  - 结果高亮显示
- 标签导航：点击跳转过滤文章列表
  - 多标签组合筛选
  - 标签云展示

#### ✅ UI 风格
- Modern Card Layout
  - 阴影效果
  - 交互动画
- 支持图片封面 + 简要内容预览
- 响应式布局保留，但仅针对电脑端设计
- 主题色：白底灰框卡片，鼠标悬停高亮

#### ✅ 可拓展接口（预留）
- 评论系统（预留评论表结构）
- 浏览量统计（预留字段）
- RSS 订阅（可由脚本定期生成）
- 阅读时长估算
- 分页 & 标签分类筛选

---

### 📁 项目结构（简化）
```
/ (项目根目录)
├── pages/
│   ├── index.tsx         # 首页文章列表
│   ├── login.tsx         # 登录页
│   ├── post/[slug].tsx   # 文章详情页
│   ├── admin/
│   │   ├── dashboard.tsx
│   │   └── editor.tsx
├── components/
│   ├── Card.tsx
│   ├── Navbar.tsx
│   └── TagList.tsx
├── lib/
│   ├── supabase.ts       # Supabase 客户端配置
│   └── markdown.ts       # Markdown 解析
├── public/
│   └── uploads/          # 静态上传文件
├── styles/
│   └── global.css
└── utils/
    └── auth.ts
```

---

### 📦 详细部署指南

#### 1️⃣ 准备 Git 仓库

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 网站上：
   1. 访问 https://github.com/new
   2. 仓库名设置为：burkeen-blog
   3. 选择 Public 或 Private
   4. 不要初始化 README（因为我们已经有了）
   ```

2. **初始化本地仓库**
   ```bash
   # 在项目根目录下执行：
   git init
   git add .
   git commit -m "Initial commit: Project setup"
   ```

3. **连接并推送到远程仓库**
   ```bash
   git remote add origin https://github.com/你的用户名/burkeen-blog.git
   git branch -M main
   git push -u origin main
   ```

#### 2️⃣ Vercel 部署流程

1. **准备工作**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录
   - 如果是首次使用，需要授权 Vercel 访问你的 GitHub 仓库

2. **创建新项目**
   - 点击 "New Project" 按钮
   - 在 "Import Git Repository" 部分找到并选择 `burkeen-blog` 仓库
   - 如果没有看到仓库，点击 "Configure GitHub App" 添加权限

3. **项目配置**
   - **项目名称**：保持默认的 `burkeen-blog` 或自定义
   - **框架预设**：确保选择 `Next.js`
   - **根目录**：保持默认 `./`
   
4. **环境变量设置**
   ```
   # 必需的环境变量：
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
   
   # 在 Vercel 界面中：
   1. 展开 "Environment Variables" 部分
   2. 从 Supabase 项目设置复制相应的值
   3. 确保变量名称完全匹配
   ```

5. **部署设置**
   - Build Command: `next build` (默认)
   - Output Directory: `.next` (默认)
   - Install Command: `npm install` (默认)

6. **点击 "Deploy" 开始部署**
   - 等待构建和部署完成
   - 查看部署日志确保没有错误

#### 3️⃣ 域名配置

1. **使用 Vercel 子域名**
   - 默认域名格式：`burkeen-blog.vercel.app`
   - 可在项目设置中自定义子域名前缀

2. **配置自定义域名**（可选）
   ```
   1. 在 Vercel 项目仪表板中：
      - 进入 "Settings" → "Domains"
      - 点击 "Add Domain"
      - 输入你的域名（如：blog.example.com）
   
   2. DNS 配置（根据提示选择一种）：
      A 记录：
      - 名称：@ 或子域名
      - 值：76.76.21.21
      
      CNAME 记录：
      - 名称：www 或子域名
      - 值：cname.vercel-dns.com
   ```

#### 4️⃣ Supabase 生产环境配置

1. **更新 URL 配置**
   ```
   1. 访问 Supabase 项目仪表板
   2. 进入 "Settings" → "API"
   3. 在 "Project URL" 部分：
      - 添加你的生产域名（如：https://blog.example.com）
      - 添加 Vercel 预览域名（如：https://burkeen-blog.vercel.app）
   ```

2. **配置 Auth 设置**
   ```
   1. 进入 "Authentication" → "URL Configuration"
   2. 设置 Site URL：你的生产域名
   3. 添加重定向 URL：
      - https://你的域名/*
      - https://burkeen-blog.vercel.app/*
   ```

3. **安全设置**
   ```
   1. 检查 RLS（Row Level Security）策略
   2. 确认生产环境的 API 密钥限制
   3. 设置适当的 CORS 策略
   ```

#### 5️⃣ 部署后检查清单

- [ ] 访问网站确认部署成功
- [ ] 测试用户认证功能
- [ ] 验证文章创建和编辑
- [ ] 检查图片和文件上传
- [ ] 确认搜索功能正常
- [ ] 测试标签系统
- [ ] 验证响应式布局

#### ⚠️ 注意事项

1. **环境变量**
   - 确保所有环境变量都已正确设置
   - 不要在代码中暴露敏感信息

2. **数据库安全**
   - 检查 RLS 策略是否正确配置
   - 确保只有授权用户可以修改数据

3. **性能优化**
   - 启用 Vercel 的自动优化功能
   - 配置适当的缓存策略

4. **监控**
   - 设置 Vercel Analytics（可选）
   - 配置错误监控（如 Sentry）

5. **备份**
   - 定期备份 Supabase 数据
   - 保存环境变量的安全副本

---

### 🧪 开发与测试建议
- 使用 `Jest` + `React Testing Library` 编写单元测试
- 使用 `ESLint` + `Prettier` 保持代码风格一致
- 使用 Supabase Row Level Security 限制非登录用户写入权限
- 日志系统可加入 LogRocket / Sentry（非必须）

---

### 📘 README 包含内容
- 项目概览 & 功能介绍
- 技术栈说明
- 本地开发启动方法
- Supabase 初始化 SQL 脚本
- 管理员登录说明
- 附录：如何部署 + 常见问题
