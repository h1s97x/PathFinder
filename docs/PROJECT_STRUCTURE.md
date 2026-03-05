# 📁 项目结构说明

## 目录树

```
campus-navigation/
├── docs/                           # 📚 文档目录
│   ├── architecture.md            # 架构设计文档
│   ├── roadmap.md                 # 开发路线图
│   ├── api.md                     # API 文档
│   ├── getting-started.md         # 快速开始指南
│   ├── examples.md                # 示例数据
│   └── deployment.md              # 部署指南
│
├── public/                         # 🌐 静态资源
│   └── vite.svg                   # 网站图标
│
├── src/                            # 💻 源代码
│   ├── components/                # 🧩 React 组件
│   │   ├── Algorithm/            # 算法相关组件
│   │   │   └── AlgorithmPanel.tsx
│   │   ├── Canvas/               # 画布组件
│   │   │   ├── Canvas.tsx
│   │   │   ├── NodeDragger.tsx
│   │   │   └── EdgeCreator.tsx
│   │   ├── FileManager/          # 文件管理
│   │   │   └── FileManager.tsx
│   │   ├── Modal/                # 弹窗组件
│   │   │   ├── NodeEditModal.tsx
│   │   │   └── EdgeEditModal.tsx
│   │   ├── SearchBar/            # 搜索栏
│   │   │   └── SearchBar.tsx
│   │   ├── Sidebar/              # 侧边栏
│   │   │   └── Sidebar.tsx
│   │   ├── StatusBar/            # 状态栏
│   │   │   └── StatusBar.tsx
│   │   ├── Toolbar/              # 工具栏
│   │   │   └── Toolbar.tsx
│   │   └── WelcomeDialog/        # 欢迎对话框
│   │       └── WelcomeDialog.tsx
│   │
│   ├── core/                      # 🎯 核心逻辑
│   │   ├── algorithms/           # 算法实现
│   │   │   ├── index.ts
│   │   │   ├── Dijkstra.ts      # Dijkstra 算法
│   │   │   ├── BFS.ts           # 广度优先搜索
│   │   │   ├── DFS.ts           # 深度优先搜索
│   │   │   └── HeldKarp.ts      # TSP 算法
│   │   └── graph/                # 图数据结构
│   │       └── Graph.ts
│   │
│   ├── data/                      # 📊 数据文件
│   │   └── sampleData.ts         # 示例数据
│   │
│   ├── hooks/                     # 🪝 自定义 Hooks
│   │   ├── useKeyboard.ts        # 键盘快捷键
│   │   └── useHistory.ts         # 历史记录
│   │
│   ├── store/                     # 🗄️ 状态管理
│   │   ├── graphStore.ts         # 图状态
│   │   └── algorithmStore.ts     # 算法状态
│   │
│   ├── types/                     # 📝 类型定义
│   │   ├── graph.ts              # 图相关类型
│   │   └── algorithm.ts          # 算法相关类型
│   │
│   ├── utils/                     # 🛠️ 工具函数
│   │   ├── graphUtils.ts         # 图工具函数
│   │   ├── storage.ts            # 存储工具
│   │   └── dataConverter.ts      # 数据转换
│   │
│   ├── styles/                    # 🎨 样式文件
│   │   └── index.css             # 全局样式
│   │
│   ├── App.tsx                    # 主应用组件
│   ├── main.tsx                   # 入口文件
│   └── vite-env.d.ts             # Vite 类型声明
│
├── .eslintrc.cjs                  # ESLint 配置
├── .gitignore                     # Git 忽略文件
├── .prettierrc                    # Prettier 配置
├── CHECKLIST.md                   # 启动检查清单
├── CONTRIBUTING.md                # 贡献指南
├── FINAL_SUMMARY.md               # 项目总结
├── index.html                     # HTML 模板
├── package.json                   # 项目配置
├── postcss.config.js              # PostCSS 配置
├── PROJECT_STRUCTURE.md           # 本文件
├── PROJECT_SUMMARY.md             # 项目概述
├── QUICKSTART.md                  # 快速开始
├── README.md                      # 项目说明
├── tailwind.config.js             # Tailwind 配置
├── tsconfig.json                  # TypeScript 配置
├── tsconfig.node.json             # Node TypeScript 配置
└── vite.config.ts                 # Vite 配置
```

## 核心模块说明

### 1. Components (组件层)

**职责**: UI 展示和用户交互

- **Algorithm**: 算法控制面板,选择和运行算法
- **Canvas**: 画布,显示图的可视化
- **FileManager**: 文件导入导出管理
- **Modal**: 各种弹窗组件
- **SearchBar**: 节点搜索功能
- **Sidebar**: 侧边栏,显示节点列表和设置
- **StatusBar**: 状态栏,显示实时信息
- **Toolbar**: 工具栏,模式切换和操作
- **WelcomeDialog**: 欢迎对话框

### 2. Core (核心层)

**职责**: 业务逻辑和算法实现

- **algorithms**: 各种图算法的实现
  - Dijkstra: 单源最短路径
  - BFS: 广度优先搜索
  - DFS: 深度优先搜索
  - HeldKarp: 旅行商问题

- **graph**: 图数据结构
  - Graph 类: 图的核心实现
  - 节点和边的管理
  - 邻接表数据结构

### 3. Store (状态层)

**职责**: 全局状态管理

- **graphStore**: 图的状态
  - 节点和边的数据
  - 选择状态
  - 编辑模式

- **algorithmStore**: 算法的状态
  - 当前算法
  - 执行状态
  - 步进信息

### 4. Utils (工具层)

**职责**: 通用工具函数

- **graphUtils**: 图相关工具
  - 路径计算
  - 连通性检查
  - 自动布局

- **storage**: 数据持久化
  - 本地存储
  - 文件导入导出

- **dataConverter**: 数据转换
  - 格式转换
  - 兼容旧版本

### 5. Types (类型层)

**职责**: TypeScript 类型定义

- **graph.ts**: 图相关类型
  - Node, Edge, GraphJSON
  - EditMode, ValidationResult

- **algorithm.ts**: 算法相关类型
  - Algorithm 接口
  - 各算法的输入输出类型
  - AlgorithmStep

### 6. Hooks (Hooks 层)

**职责**: 自定义 React Hooks

- **useKeyboard**: 键盘快捷键
- **useHistory**: 历史记录管理

## 数据流

```
User Action
    ↓
Component (UI)
    ↓
Store (State)
    ↓
Core (Logic)
    ↓
Utils (Tools)
    ↓
Update UI
```

## 文件命名规范

- **组件**: PascalCase (e.g., `Canvas.tsx`)
- **工具函数**: camelCase (e.g., `graphUtils.ts`)
- **类型文件**: camelCase (e.g., `graph.ts`)
- **常量**: UPPER_SNAKE_CASE
- **接口**: PascalCase with `I` prefix (optional)

## 导入顺序

```typescript
// 1. React 相关
import { useState, useEffect } from 'react'

// 2. 第三方库
import { create } from 'zustand'

// 3. 类型
import type { Node, Edge } from '@/types/graph'

// 4. 组件
import Canvas from '@/components/Canvas/Canvas'

// 5. Hooks
import { useKeyboard } from '@/hooks/useKeyboard'

// 6. 工具函数
import { graphUtils } from '@/utils/graphUtils'

// 7. 样式
import './styles.css'
```

## 代码组织原则

1. **单一职责**: 每个文件只负责一个功能
2. **高内聚低耦合**: 相关功能放在一起,减少依赖
3. **可测试性**: 核心逻辑独立,易于测试
4. **可扩展性**: 使用接口和抽象,便于扩展
5. **可维护性**: 清晰的命名和注释

## 添加新功能

### 添加新组件

1. 在 `src/components/` 创建文件夹
2. 创建组件文件 `ComponentName.tsx`
3. 导出组件
4. 在需要的地方导入使用

### 添加新算法

1. 在 `src/core/algorithms/` 创建文件
2. 实现 `Algorithm` 接口
3. 在 `index.ts` 中导出
4. 在 `AlgorithmPanel` 中添加选项

### 添加新工具函数

1. 在 `src/utils/` 相应文件中添加
2. 导出函数
3. 在需要的地方导入使用

## 性能优化建议

1. **组件懒加载**: 使用 `React.lazy()`
2. **状态优化**: 避免不必要的重渲染
3. **算法优化**: 使用高效的数据结构
4. **资源优化**: 压缩图片和代码

## 调试技巧

1. **React DevTools**: 查看组件状态
2. **Redux DevTools**: 查看 Zustand 状态
3. **Console**: 使用 `console.log` 调试
4. **Breakpoints**: 在浏览器中设置断点

## 常见问题

### Q: 如何添加新的编辑模式?

A: 在 `types/graph.ts` 中添加新的 `EditMode`,然后在 `Toolbar` 和 `Canvas` 中处理。

### Q: 如何修改图的样式?

A: 在 `Canvas.tsx` 中修改节点和边的 CSS 类名。

### Q: 如何添加新的快捷键?

A: 在 `App.tsx` 的 `useKeyboard` Hook 中添加。

---

希望这个文档能帮助你理解项目结构! 🚀
