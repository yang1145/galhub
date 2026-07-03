# GalHub

GalHub 是一个纯静态游戏列表网站。项目通过构建时读取本地 JSON 游戏数据生成前端页面，不依赖后端服务，适合部署到 GitHub Pages、Cloudflare Pages、Vercel、Netlify 等静态托管平台。

## 功能

- 首页概览与最新收录展示
- 独立游戏列表页
- 游戏搜索与标签筛选
- 游戏详情页
- 16:9 游戏封面展示
- 封面外链跳转
- 三类操作按钮：跳转下载、前往官网、开始游戏
- 截图预览灯箱
- 免责声明页
- 友情链接页，支持 favicon 展示

## 技术栈

- React 18
- TypeScript
- Vite
- @phosphor-icons/react
- CSS Modules-free 全局样式

## 项目结构

```text
src/
├── App.tsx
├── components/
│   ├── ActionButton.tsx
│   ├── GameCard.tsx
│   ├── Lightbox.tsx
│   └── Topbar.tsx
├── data/
│   ├── friendLinks.ts
│   └── games.json
├── pages/
│   ├── DisclaimerPage.tsx
│   ├── GameDetailPage.tsx
│   ├── GameListPage.tsx
│   ├── HomePage.tsx
│   └── LinksPage.tsx
├── types/
│   └── game.ts
├── utils/
│   ├── games.ts
│   └── routes.ts
├── main.tsx
└── styles.css
```

## 数据配置

游戏数据位于 `src/data/games.json`。

核心字段示例：

```json
{
  "id": "summer-pocket",
  "title": "Summer Pockets",
  "titleZh": "夏日口袋",
  "developer": "Key",
  "publisher": "Visual Arts",
  "releaseDate": "2018-06-29",
  "platform": ["PC", "Switch"],
  "rating": 8.7,
  "coverImage": "https://example.com/cover.jpg",
  "coverLink": "https://example.com",
  "screenshots": ["https://example.com/screenshot.jpg"],
  "tags": ["视觉小说", "恋爱"],
  "description": "游戏简介",
  "buttons": [
    { "type": "download", "label": "跳转下载", "url": "https://example.com/download" },
    { "type": "website", "label": "前往官网", "url": "https://example.com" },
    { "type": "play", "label": "开始游戏", "url": "https://example.com/play" }
  ]
}
```

`buttons.type` 支持：

- `download`：跳转下载
- `website`：前往官网
- `play`：开始游戏

友情链接位于 `src/data/friendLinks.ts`，支持 `name`、`description`、`url`、`favicon` 字段。

## 开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 路由

项目使用 hash 路由，方便静态托管部署：

- `#/games`：游戏列表页
- `#/game/:id`：游戏详情页
- `#/disclaimer`：免责声明页
- `#/links`：友情链接页

## 部署

执行构建后，静态产物输出到 `dist/`：

```bash
npm run build
```

将 `dist/` 部署到任意静态托管平台即可。
