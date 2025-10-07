<div align="center">
  <br>
  <br>

[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE)

  <h1>GalHub 游戏平台</h1>
</div>

**中文** | [English](./README.md)

## 简介

GalHub 是一个现代化的游戏平台，采用前后端分离架构。前端使用 Vue 3、Vite、TypeScript 等主流技术开发，后端使用 Node.js、Express 和 MySQL 构建。

## 项目结构

```
galhub/
├── admin/              # 基于 Vben Admin 的后台管理系统
├── backend/            # Node.js 后端 API 服务
├── frontend/           # React 前端用户界面
└── README.md           # 项目说明文档
```

## 技术栈

### 前端 (admin & frontend)
- **框架**: Vue 3 / React
- **构建工具**: Vite
- **语言**: TypeScript
- **UI库**: Ant Design Vue / 其他组件库
- **状态管理**: Pinia / Redux
- **路由**: Vue Router / React Router

### 后端
- **框架**: Node.js + Express
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT
- **密码加密**: bcryptjs

## 功能特性

- 用户认证（注册、登录）
- 管理员认证与权限控制
- 游戏管理（增删改查）
- 用户最近游戏跟踪
- RESTful API 设计
- 响应式前端界面

## 安装使用

### 后端服务

1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 根据 `.env.example` 创建 `.env` 文件并配置环境变量：
   ```bash
   cp .env.example .env
   ```

4. 创建数据库并运行初始化脚本：
   ```sql
   CREATE DATABASE galhub;
   ```
   ```bash
   mysql -u your_username -p galhub < init.sql
   ```

5. 运行后端服务：
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

### 前端管理后台

1. 进入前端管理后台目录：
   ```bash
   cd admin
   ```

2. 安装依赖（使用pnpm）：
   ```bash
   npm i -g corepack
   pnpm install
   ```

3. 运行开发服务器：
   ```bash
   pnpm dev
   ```

4. 打包构建：
   ```bash
   pnpm build
   ```

### 前端用户界面

1. 进入前端用户界面目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 运行开发服务器：
   ```bash
   npm run dev
   ```

4. 打包构建：
   ```bash
   npm run build
   ```

## API 文档

详细的 API 文档请查看 [backend/README.md](./backend/README.md)

## 浏览器支持

本地开发推荐使用 `Chrome 80+` 浏览器

支持现代浏览器，不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 如何贡献

非常欢迎你的加入！

**Pull Request 流程：**

1. Fork 代码
2. 创建自己的分支：`git checkout -b feature/xxxx`
3. 提交你的修改：`git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支：`git push origin feature/xxxx`
5. 提交 `pull request`

## Git 贡献提交规范

参考 [Angular 规范](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `ci` 持续集成
- `types` 类型定义文件更改

## 许可证

[MIT](./LICENSE)