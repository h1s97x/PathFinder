# 校园导航系统 - 架构设计文档

## 项目概述

基于 React + TypeScript 的现代化校园导航系统,提供可视化的图操作、路径查询和算法演示功能。

## 技术栈

### 前端核心
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架

### 可视化
- **Canvas API** - 原生图形绘制
- **SVG** - 矢量图形

### 状态管理
- **Zustand** - 轻量级状态管理

### 工具库
- **clsx** - 类名管理
- **lucide-react** - 图标库

## 项目结构

```
campus-navigation/
├── src/
│   ├── components/          # React 组件
│   │   ├── Canvas/         # 画布组件
│   │   ├── Sidebar/        # 侧边栏
│   │   ├── Toolbar/        # 工具栏
│   │   ├── Modal/          # 弹窗组件
│   │   └── Algorithm/      # 算法可视化组件
│   ├── core/               # 核心逻辑
│   │   ├── graph/          # 图数据结构
│   │   ├── algorithms/     # 算法实现
│   │   └── storage/        # 数据持久化
│   ├── hooks/              # 自定义 Hooks
│   ├── store/              # 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── styles/             # 全局样式
├── public/                 # 静态资源
├── docs/                   # 文档
└── tests/                  # 测试文件
```

## 核心模块设计

### 1. 图数据结构 (Graph)

```typescript
interface Node {
  id: string;
  label: string;
  description: string;
  position: { x: number; y: number };
  metadata?: Record<string, any>;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  metadata?: Record<string, any>;
}

class Graph {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  adjacencyList: Map<string, Set<string>>;
}
```

### 2. 算法模块

- **Dijkstra** - 单源最短路径
- **A*** - 启发式搜索
- **Floyd-Warshall** - 全源最短路径
- **DFS/BFS** - 图遍历
- **Held-Karp** - TSP 问题
- **Kruskal/Prim** - 最小生成树

### 3. 可视化引擎

使用原生 Canvas API 和 SVG 提供:
- 节点拖拽
- 边的绘制
- 自定义样式
- 动画效果
- 交互事件

### 4. 状态管理

```typescript
interface AppState {
  graph: Graph;
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  mode: 'view' | 'add-node' | 'add-edge' | 'edit';
  algorithm: AlgorithmState;
  history: HistoryState;
}
```

## 功能模块

### 1. 图编辑功能
- 添加/删除/编辑节点
- 添加/删除/编辑边
- 拖拽调整位置
- 批量操作
- 撤销/重做

### 2. 路径查询
- 单起点单终点最短路径
- 多起点多终点路径规划
- 路径对比(多种算法)
- 实时路径预览

### 3. 算法可视化
- 步进执行
- 播放/暂停/重置
- 速度调节
- 高亮访问节点
- 显示算法状态

### 4. 数据管理
- JSON 导入/导出
- 本地存储
- 历史记录
- 数据验证

## 用户界面布局

```
┌─────────────────────────────────────────────┐
│  Toolbar (工具栏)                            │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │      Canvas (画布)               │
│ (侧边栏)  │                                  │
│          │                                  │
│  - 节点列表│      [图可视化区域]              │
│  - 操作面板│                                  │
│  - 算法选择│                                  │
│  - 设置   │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Status Bar (状态栏)                         │
└─────────────────────────────────────────────┘
```

## 性能优化

1. **虚拟化渲染** - 大规模图的性能优化
2. **Web Worker** - 算法计算放到后台线程
3. **懒加载** - 按需加载组件和资源
4. **缓存策略** - 计算结果缓存
5. **防抖节流** - 优化交互性能

## 扩展性设计

1. **插件系统** - 支持自定义算法插件
2. **主题系统** - 支持自定义主题
3. **国际化** - 多语言支持
4. **API 接口** - 预留后端集成接口

## 开发规范

- **代码风格**: ESLint + Prettier
- **提交规范**: Conventional Commits
- **分支策略**: Git Flow
- **测试覆盖**: 核心算法 > 80%

## 部署方案

- **开发环境**: Vite Dev Server
- **生产构建**: 静态文件部署
- **托管平台**: Vercel / Netlify / GitHub Pages
