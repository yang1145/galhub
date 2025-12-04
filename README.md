# GalHub 游戏展示平台

一个现代化的游戏展示平台，使用Vue 3和Vite构建。

## 功能特性

- 首页展示所有游戏
- 分类页面按类型浏览游戏
- 关于页面介绍平台信息
- 响应式设计，适配各种设备
- 美观的UI界面和流畅的用户体验

## 技术栈

- Vue 3 (Composition API)
- Vite
- Font Awesome 图标库
- CSS Grid 和 Flexbox 布局

## 页面介绍

### 首页
展示所有游戏的网格布局，每个游戏卡片包含标题、评分、描述和图片。

### 分类页面
按游戏类型组织的分类浏览页面：
- 冒险
- 动作
- 策略
- 角色扮演
- 竞速
- 模拟

每个分类都有专门的图标和游戏计数，用户可以点击分类查看该类型的所有游戏。

### 关于页面
平台介绍、团队信息和联系方式。

## 开发指南

### 环境要求
项目需要 Node.js 版本 20.19.0 或更高版本。

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 管理 Node.js 版本：

```bash
# 使用 nvm 安装并切换到指定版本
nvm install 20.19.0
nvm use 20.19.0
```

或者使用 `.nvmrc` 文件：
```bash
# 自动使用项目推荐的版本
nvm use
```

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 部署指南

项目支持多种部署平台：

### Vercel 部署
1. 访问 [Vercel官网](https://vercel.com/) 并使用你的 GitHub 账户登录
2. 点击 "Import Project" 导入你的项目仓库
3. Vercel 会自动检测这是一个 Vite 项目并设置正确的构建命令 (`npm run build`)
4. 设置输出目录为 `dist`
5. 点击部署即可

### Cloudflare Pages 部署
1. 访问 [Cloudflare控制台](https://dash.cloudflare.com/) 并登录
2. 进入 "Workers & Pages" 服务
3. 点击 "Create application" > "Pages" > "Connect to Git"
4. 选择你的 Git 仓库
5. 设置构建配置：
   - 构建命令: `npm run build`
   - 输出目录: `dist`
6. 点击 "Save and Deploy"

### Netlify 部署
1. 访问 [Netlify官网](https://app.netlify.com/) 并使用你的 GitHub 账户登录
2. 点击 "New site from Git" 并选择你的项目仓库
3. Netlify 会自动检测到 `netlify.toml` 配置文件并应用相应的设置
4. 点击 "Deploy site" 即可完成部署

### GitHub Pages 部署
1. 确保你的项目已经在 GitHub 上
2. 进入仓库的 Settings > Pages
3. 在 "Build and deployment" 部分，选择 "GitHub Actions" 作为源
4. 推送代码到 main 分支，GitHub Actions 会自动触发构建和部署流程

## 组件结构

- `App.vue` - 主应用组件
- `Layout.vue` - 页面布局组件（包含导航和页脚）
- `GameCard.vue` - 游戏卡片组件
- `Category.vue` - 分类页面组件
- `About.vue` - 关于页面组件

## 数据结构

游戏数据存储在 `src/data/games.js` 中，每个游戏对象包含以下属性：
- id: 唯一标识符
- title: 游戏标题
- genre: 游戏类型
- rating: 评分
- image: 图片URL
- description: 描述

## 自定义和扩展

1. 添加新游戏：编辑 `src/data/games.js` 文件
2. 添加新分类：更新 `Category.vue` 组件中的分类数据
3. 修改样式：编辑各组件的 `<style scoped>` 部分
4. 添加页面：创建新组件并在 `App.vue` 中注册和引用

## 许可证

MIT