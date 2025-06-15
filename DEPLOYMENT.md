# 博客网站部署指南

## 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

## 部署步骤

1. 安装依赖
```bash
npm install
```

2. 构建项目
```bash
npm run build
```

3. 启动生产服务器
```bash
npm run start
```

## 部署检查清单

### 基础配置
- [ ] 确保 Node.js 和 npm 版本符合要求
- [ ] 环境变量配置正确
- [ ] package.json 中的依赖版本正确

### Supabase 配置
- [ ] Supabase 项目已创建
- [ ] 数据库表结构已配置
- [ ] 存储桶权限已配置
- [ ] 认证设置已完成

### 图片和静态资源
- [ ] next.config.js 中的图片域名配置正确
- [ ] public 目录下的静态资源已添加
- [ ] 图片存储桶权限设置正确

### 性能优化
- [ ] 图片使用了 Next.js Image 组件
- [ ] 字体使用了 next/font 优化
- [ ] 组件适当使用了 'use client' 指令

### 安全性
- [ ] 环境变量未泄露
- [ ] API 路由添加了适当的权限验证
- [ ] Supabase RLS 策略配置正确

## 常见问题

### 图片无法显示
- 检查 next.config.js 中的 images.remotePatterns 配置
- 确认 Supabase 存储桶的权限设置
- 验证图片 URL 是否正确

### 认证问题
- 确认环境变量配置正确
- 检查 Supabase 项目设置
- 验证认证回调 URL 配置

### 构建错误
- 清除 .next 目录后重新构建
- 检查依赖版本兼容性
- 确认 TypeScript 类型定义正确

## 生产环境注意事项

1. 性能监控
   - 使用 Next.js Analytics 监控性能
   - 定期检查 Supabase 数据库性能
   - 监控 API 调用频率和响应时间

2. 安全更新
   - 定期更新依赖包
   - 检查 Supabase 安全更新
   - 更新 Next.js 版本

3. 备份策略
   - 配置 Supabase 数据库自动备份
   - 保存环境配置文件
   - 记录自定义设置和修改 