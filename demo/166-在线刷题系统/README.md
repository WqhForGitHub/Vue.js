# 在线刷题系统

> 序号：166

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架（Composition API）
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue.js 轻量级状态管理库

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
├── index.html              # HTML 入口文件
├── package.json            # 项目依赖与脚本
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # Node 环境 TS 配置
└── src/
    ├── main.ts             # 应用入口
    ├── App.vue             # 根组件
    ├── style.css           # 全局样式
    ├── env.d.ts            # 类型声明
    ├── router/
    │   └── index.ts        # 路由配置（懒加载）
    ├── stores/
    │   └── counter.ts      # Pinia 状态管理
    ├── views/
    │   ├── HomeView.vue    # 首页
    │   └── AboutView.vue   # 关于页
    └── components/
        └── HelloWorld.vue   # 通用组件
```

## 功能特性

- [x] Vue 3 Composition API (script setup)
- [x] TypeScript 全类型支持
- [x] Vite 极速热更新 (HMR)
- [x] Vue Router 路由懒加载
- [x] Pinia 组合式 Store
- [x] @ 路径别名配置
