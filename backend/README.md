# GalHub 后端 API

这是 GalHub 游戏平台的后端 API，使用 Node.js、Express 和 MySQL 构建。

## 功能特性

- 用户认证（注册、登录）
- 管理员认证
- 游戏管理（增删改查操作）
- 用户最近游戏跟踪（每个用户最多 32 个游戏）
- RESTful API 设计

## 先决条件

- Node.js (v14 或更高版本)
- MySQL 数据库
- npm 或 yarn 包管理器

## 安装

1. 克隆代码仓库
2. 进入后端目录：
   ```
   cd backend
   ```
3. 安装依赖：
   ```
   npm install
   ```
4. 根据 `.env.example` 创建 `.env` 文件：
   ```
   cp .env.example .env
   ```
5. 更新 `.env` 文件中的数据库凭证和其他配置

## 数据库设置

1. 在 MySQL 中创建数据库：
   ```sql
   CREATE DATABASE galhub;
   ```
2. 运行初始化脚本：
   ```
   mysql -u your_username -p galhub < init.sql
   ```

## 运行应用

### 开发模式
```
npm run dev
```

### 生产模式
```
npm start
```

默认情况下，服务器将在 3000 端口启动（或 .env 文件中指定的端口）。

## API 文档

### 认证相关接口

#### 用户注册
- **URL**: `POST /api/auth/register`
- **描述**: 用户注册新账户
- **请求参数**:
  ```json
  {
    "username": "string",  // 用户名（必填）
    "password": "string"   // 密码（必填，至少6位）
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token",
    "user": {
      "uid": 1,
      "username": "example_user"
    }
  }
  ```

#### 用户登录
- **URL**: `POST /api/auth/login`
- **描述**: 用户登录获取访问令牌
- **请求参数**:
  ```json
  {
    "username": "string",  // 用户名（必填）
    "password": "string"   // 密码（必填）
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
      "uid": 1,
      "username": "example_user"
    }
  }
  ```

#### 管理员登录
- **URL**: `POST /api/auth/admin/login`
- **描述**: 管理员登录获取访问令牌
- **请求参数**:
  ```json
  {
    "username": "string",  // 管理员用户名（必填）
    "password": "string"   // 密码（必填）
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Admin login successful",
    "token": "jwt_token",
    "admin": {
      "id": 1,
      "username": "admin"
    }
  }
  ```

### 游戏相关接口

#### 获取游戏列表
- **URL**: `GET /api/games`
- **描述**: 获取所有游戏（支持搜索和分页）
- **查询参数**:
  - `page`: 页码（可选，默认为 1）
  - `limit`: 每页数量（可选，默认为 10，最大 100）
  - `search`: 搜索关键词（可选）
- **响应示例**:
  ```json
  {
    "games": [
      {
        "id": 1,
        "name": "示例游戏",
        "brief_description": "游戏简介",
        "cover_image_link": "https://example.com/cover.jpg",
        "tag1": "动作",
        "tag2": "冒险",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
  ```

#### 获取特定游戏
- **URL**: `GET /api/games/:id`
- **描述**: 根据 ID 获取特定游戏
- **路径参数**:
  - `id`: 游戏 ID
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "示例游戏",
    "brief_description": "游戏简介",
    "detailed_description": "游戏详细描述",
    "game_link": "https://example.com/game",
    "cover_image_link": "https://example.com/cover.jpg",
    "tag1": "动作",
    "tag2": "冒险",
    "tag3": "RPG",
    "tag4": "单人",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
  ```

#### 创建新游戏
- **URL**: `POST /api/games`
- **描述**: 创建新游戏（仅管理员）
- **请求参数**:
  ```json
  {
    "name": "string",               // 游戏名称（必填）
    "brief_description": "string",  // 简介（可选）
    "detailed_description": "string", // 详细描述（可选）
    "game_link": "string",          // 游戏链接（可选，URL格式）
    "cover_image_link": "string",   // 封面图片链接（可选，URL格式）
    "tag1": "string",               // 标签1（可选）
    "tag2": "string",               // 标签2（可选）
    "tag3": "string",               // 标签3（可选）
    "tag4": "string"                // 标签4（可选）
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Game created successfully",
    "game": {
      "id": 1,
      "name": "新游戏",
      // ... 其他游戏字段
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 更新游戏
- **URL**: `PUT /api/games/:id`
- **描述**: 更新游戏信息（仅管理员）
- **路径参数**:
  - `id`: 游戏 ID
- **请求参数**: 与创建游戏相同，所有字段均为可选
- **响应示例**:
  ```json
  {
    "message": "Game updated successfully",
    "game": {
      "id": 1,
      "name": "更新后的游戏名",
      // ... 其他游戏字段
      "updated_at": "2023-01-02T00:00:00.000Z"
    }
  }
  ```

#### 删除游戏
- **URL**: `DELETE /api/games/:id`
- **描述**: 删除游戏（仅管理员）
- **路径参数**:
  - `id`: 游戏 ID
- **响应示例**:
  ```json
  {
    "message": "Game deleted successfully"
  }
  ```

### 用户最近游戏接口

#### 添加到最近游戏
- **URL**: `POST /api/games/recent/:gameId`
- **描述**: 将游戏添加到当前用户的最近游戏列表
- **路径参数**:
  - `gameId`: 游戏 ID
- **认证**: 需要用户访问令牌
- **响应示例**:
  ```json
  {
    "message": "Game added to recent games"
  }
  ```

#### 获取用户最近游戏
- **URL**: `GET /api/games/recent/user`
- **描述**: 获取当前用户的最近游戏列表
- **认证**: 需要用户访问令牌
- **响应示例**:
  ```json
  {
    "games": [
      {
        "id": 1,
        "name": "示例游戏",
        "brief_description": "游戏简介",
        "cover_image_link": "https://example.com/cover.jpg",
        "tag1": "动作",
        "tag2": "冒险",
        "tag3": "RPG",
        "tag4": "单人"
      }
    ]
  }
  ```

### 用户个人资料接口

#### 获取用户资料
- **URL**: `GET /api/users/profile`
- **描述**: 获取当前用户的个人资料
- **认证**: 需要用户访问令牌
- **响应示例**:
  ```json
  {
    "user": {
      "uid": 1,
      "username": "example_user",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 更新用户资料
- **URL**: `PUT /api/users/profile`
- **描述**: 更新当前用户的个人资料
- **认证**: 需要用户访问令牌
- **请求参数**:
  ```json
  {
    "username": "string"  // 新用户名（可选）
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "uid": 1,
      "username": "new_username"
    }
  }
  ```

#### 删除用户账户
- **URL**: `DELETE /api/users/profile`
- **描述**: 删除当前用户的账户
- **认证**: 需要用户访问令牌
- **响应示例**:
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   ├── controllers/     # 请求处理器
│   ├── middleware/      # 自定义中间件
│   ├── models/          # 数据库模型
│   ├── routes/          # API 路由
├── .env.example         # 环境变量示例
├── init.sql             # 数据库初始化脚本
├── server.js            # 应用入口文件
└── package.json         # 项目依赖和脚本
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| DB_HOST | 数据库主机 | localhost |
| DB_USER | 数据库用户 | - |
| DB_PASSWORD | 数据库密码 | - |
| DB_NAME | 数据库名 | galhub |
| DB_PORT | 数据库端口 | 3306 |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | JWT 过期时间 | 24h |

## 依赖包

- bcryptjs: 密码哈希处理
- cors: 跨域资源共享支持
- dotenv: 环境变量管理
- express: Web 框架
- express-validator: 请求验证
- jsonwebtoken: JWT 令牌管理
- mysql2: MySQL 客户端
- sequelize: ORM 数据库操作库