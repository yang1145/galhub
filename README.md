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
