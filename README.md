# GalHub - 游戏展示平台

GalHub 是一个基于 Node.js 和 SQLite 的游戏展示平台，用于展示和管理游戏信息。

## 功能特性

- 游戏展示：以卡片形式展示游戏封面和基本信息
- 游戏管理：通过 RESTful API 管理游戏数据
- 响应式设计：适配不同屏幕尺寸的设备
- SQLite 数据库：轻量级数据存储方案
- 管理员系统：支持管理员账户验证和游戏管理
- JWT认证：使用JSON Web Token进行安全认证

## 技术栈

- 后端：Node.js + Express
- 数据库：SQLite
- 前端：HTML + CSS + JavaScript
- 密码加密：bcryptjs
- JWT认证：jsonwebtoken
- 包管理：npm

## 项目结构

```
galhub/
├── database/           # 数据库相关文件
│   ├── db.js           # 数据库操作模块
│   └── init.js         # 数据库初始化脚本
├── public/             # 静态资源文件
│   ├── css/            # 样式文件
│   ├── img/            # 图片资源
│   └── js/             # JavaScript 文件
├── server.js           # 服务端入口文件
├── package.json        # 项目配置文件
└── README.md           # 项目说明文件
```

## 安装与运行

### 环境要求

- Node.js (推荐 v14.x 或更高版本)
- npm (通常随 Node.js 一起安装)

### 安装步骤

1. 克隆或下载项目代码到本地

2. 安装项目依赖：
   ```bash
   npm install
   ```

3. 初始化数据库：
   ```bash
   npm run init-db
   ```

4. 创建管理员账户：
   ```bash
   npm run create-admin
   ```
   
   或创建自定义管理员账户：
   ```bash
   npm run create-admin your_username your_password
   ```

### 运行项目

- 开发模式运行：
  ```bash
  npm run dev
  ```

- 生产模式运行：
  ```bash
  npm start
  ```

运行后，访问 `http://localhost:3000` 查看应用。

## 管理员功能

### 登录系统
- 访问 `http://localhost:3000/admin/login` 进入管理员登录页面
- 默认管理员账户：
  - 用户名：admin
  - 密码：admin123

### 管理功能
- 查看游戏列表（不显示封面图片）
- 添加新游戏
- 编辑游戏信息
- 删除游戏（软删除）

### JWT认证机制
- 登录成功后，系统会生成一个有效期为24小时的JWT令牌
- 令牌存储在浏览器的localStorage中
- 所有管理API请求都会携带该令牌进行身份验证
- 令牌过期或无效时，系统会自动跳转到登录页面

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/games` | 获取所有游戏列表 |
| GET | `/api/games/:id` | 获取指定ID的游戏信息 |
| POST | `/api/games` | 添加新游戏（需要认证） |
| PUT | `/api/games/:id` | 更新指定ID的游戏信息（需要认证） |
| DELETE | `/api/games/:id` | 删除指定ID的游戏（软删除，需要认证） |
| POST | `/api/admin/login` | 管理员登录验证 |
| POST | `/api/admin/create` | 创建管理员账户 |

### 认证API

需要认证的API应在请求头中包含Authorization字段：

```
Authorization: Bearer <token>
```

### 游戏数据结构

```json
{
  "id": 1,
  "name": "游戏名称",
  "alias": "游戏别名",
  "cover_link": "封面图片链接",
  "game_address": "游戏地址",
  "add_time": "添加时间",
  "author": "游戏作者",
  "is_commercial": true,     // 是否为商业游戏
  "is_repost": false,        // 是否为转载游戏
  "is_maintained": true      // 是否处于维护状态
}
```

### 管理员数据结构

```json
{
  "id": 1,
  "username": "管理员用户名",
  "password_hash": "加密后的密码",
  "created_at": "创建时间"
}
```

## 数据库设计

游戏信息存储在 SQLite 数据库中，表结构如下：

### 游戏表 (games)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 游戏名称（必填） |
| alias | TEXT | 游戏别名 |
| cover_link | TEXT | 封面图片链接 |
| game_address | TEXT | 游戏地址 |
| add_time | DATETIME | 添加时间，默认为当前时间 |
| author | TEXT | 游戏作者 |
| is_commercial | BOOLEAN | 是否为商业游戏 |
| is_repost | BOOLEAN | 是否为转载游戏 |
| is_maintained | BOOLEAN | 是否处于维护状态 |

### 管理员表 (admins)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 管理员用户名（唯一，必填） |
| password_hash | TEXT | 加密后的密码（必填） |
| created_at | DATETIME | 创建时间，默认为当前时间 |

## 前端功能

- 响应式游戏卡片展示
- 游戏封面图片展示（800*600）
- 启动游戏按钮
- 页面底部信息
- 管理员登录页面
- 管理员控制面板（列表形式展示游戏信息，支持编辑功能）

## 开发规范

- 静态文件统一存放在 `public` 目录中
- 数据库字段区分标识字段和展示字段的语义
- 前端交互元素具有统一的样式风格和悬停效果
- API 接口遵循 RESTful 设计规范
- 密码使用 bcryptjs 进行加密存储
- 使用JWT进行安全认证

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。