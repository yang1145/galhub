# 项目模块化细分方案

## 当前结构分析
当前项目已经有基本的模块化结构，但可以进一步细分以提高可维护性和可扩展性：

```
src/
├── App.vue
├── assets/           # 静态资源
├── components/       # 所有组件混合存放
├── data/             # 数据文件
├── main.js
├── router/           # 路由配置
├── services/         # API服务
├── style.css
└── views/            # 页面组件
```

## 模块化细分方案

### 1. 组件分类
- **ui/**: 通用UI组件
- **business/**: 业务逻辑组件

### 2. 工具和辅助模块
- **utils/**: 通用工具函数
- **composables/**: Vue组合式函数

### 3. 配置和类型
- **config/**: 项目配置文件
- **types/**: TypeScript类型定义（可选）

### 4. 数据层
- **stores/**: 状态管理（使用Pinia）
- **api/**: API接口定义和请求函数（从services移动）

## 最终目录结构
```
src/
├── App.vue
├── assets/           # 静态资源
├── components/       # 组件根目录
│   ├── ui/           # UI组件
│   └── business/     # 业务组件
├── composables/      # Vue组合式函数
├── config/           # 项目配置
├── data/             # 静态数据文件
├── main.js
├── router/           # 路由配置
├── stores/           # 状态管理
├── style.css
├── types/            # 类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
```