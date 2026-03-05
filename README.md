# 校园导航系统

[![开发状态](https://img.shields.io/badge/状态-活跃开发-brightgreen)](./CURRENT_STATUS.md)
[![进度](https://img.shields.io/badge/进度-85%25-blue)](./docs/roadmap.md)
[![许可证](https://img.shields.io/badge/许可证-MIT-green)](./LICENSE)

基于 React + TypeScript 的现代化校园导航系统,提供可视化的图操作、路径查询和算法演示功能。

## ✨ 特性

- 🎨 现代化 UI 设计,响应式布局
- 🖱️ 直观的图编辑功能(添加/删除/编辑节点和边)
- 🔍 多种路径查询算法(Dijkstra、A*、DFS/BFS)
- 🎬 算法可视化,支持步进执行
- 💾 数据持久化,支持导入/导出
- ⚡ 高性能渲染,支持大规模图

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **Lucide React** - 图标库

## 📚 文档

- [快速开始](./QUICKSTART.md) - 5分钟上手指南
- [安装指南](./INSTALL.md) - 详细安装说明
- [当前状态](./CURRENT_STATUS.md) - 开发进度和状态
- [下一步计划](./NEXT_STEPS.md) - 开发路线图
- [架构设计](./docs/architecture.md) - 系统架构
- [API 文档](./docs/api.md) - 接口文档
- [使用指南](./docs/getting-started.md) - 详细教程
- [示例数据](./docs/examples.md) - 示例和测试数据
- [部署指南](./docs/deployment.md) - 部署说明
- [贡献指南](./CONTRIBUTING.md) - 如何贡献

## 🎯 项目状态

**当前版本**: Alpha (v0.9.0)  
**开发进度**: 85%  
**核心功能**: ✅ 完成  
**算法可视化**: 🔄 开发中  
**测试覆盖**: ⏳ 待开始

查看 [详细状态](./CURRENT_STATUS.md) 和 [开发计划](./NEXT_STEPS.md)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
campus-navigation/
├── src/
│   ├── components/          # React 组件
│   │   ├── Canvas/         # 画布组件
│   │   ├── Sidebar/        # 侧边栏
│   │   └── Toolbar/        # 工具栏
│   ├── core/               # 核心逻辑
│   │   ├── graph/          # 图数据结构
│   │   └── algorithms/     # 算法实现
│   ├── store/              # 状态管理
│   ├── types/              # TypeScript 类型
│   ├── styles/             # 全局样式
│   └── main.tsx            # 入口文件
├── docs/                   # 文档
│   ├── architecture.md     # 架构设计
│   ├── roadmap.md         # 开发路线图
│   └── api.md             # API 文档
└── public/                 # 静态资源
```

## 使用指南

### 添加节点

1. 点击工具栏的 "+" 按钮
2. 在画布上点击任意位置添加节点

### 添加边

1. 点击工具栏的链接按钮
2. 依次点击两个节点创建连接

### 查询路径

1. 在侧边栏选择算法
2. 选择起点和终点
3. 点击运行查看结果

### 算法可视化

- 播放/暂停: 控制算法执行
- 单步执行: 逐步查看算法过程
- 速度调节: 调整动画速度

## 文档

- [架构设计](./docs/architecture.md)
- [开发路线图](./docs/roadmap.md)
- [API 文档](./docs/api.md)

## 开发规范

- 代码风格: ESLint + Prettier
- 提交规范: Conventional Commits
- 分支策略: Git Flow

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

查看 [贡献指南](./CONTRIBUTING.md) 了解如何参与开发。

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本历史。

## 📄 许可证

MIT License - 查看 [LICENSE](./LICENSE) 文件了解详情

## 🙏 致谢

感谢所有贡献者和开源项目!

## 📞 联系方式

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- Email: [待添加]

---

**⭐ 如果这个项目对你有帮助,请给个 Star!**
