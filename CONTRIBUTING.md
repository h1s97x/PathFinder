# 贡献指南

感谢你对校园导航系统的关注!

## 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 代码规范

### 提交信息格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型(type):
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

示例:
```
feat(algorithm): 添加 A* 搜索算法

实现了 A* 启发式搜索算法,支持自定义启发函数。

Closes #123
```

### 代码风格

项目使用 ESLint 和 Prettier 进行代码格式化:

```bash
# 检查代码风格
npm run lint

# 自动格式化
npm run format
```

### TypeScript 规范

- 使用明确的类型注解
- 避免使用 `any`,优先使用 `unknown`
- 导出的函数和类必须有 JSDoc 注释
- 使用接口(interface)定义对象类型

### React 规范

- 使用函数组件和 Hooks
- 组件文件名使用 PascalCase
- Props 接口命名: `ComponentNameProps`
- 使用 `React.FC` 类型(可选)

## 项目结构

```
src/
├── components/     # React 组件
├── core/          # 核心逻辑(图、算法)
├── hooks/         # 自定义 Hooks
├── store/         # 状态管理
├── types/         # TypeScript 类型
├── utils/         # 工具函数
└── styles/        # 全局样式
```

## 添加新算法

1. 在 `src/core/algorithms/` 创建新文件
2. 实现 `Algorithm` 接口
3. 导出算法类
4. 在 `src/core/algorithms/index.ts` 中导出
5. 添加单元测试
6. 更新文档

示例:

```typescript
import type { Algorithm, AlgorithmInput, AlgorithmOutput } from '@/types/algorithm'

export class MyAlgorithm implements Algorithm<MyInput, MyOutput> {
  name = 'My Algorithm'
  description = '算法描述'

  execute(graph: Graph, input: MyInput): MyOutput {
    // 实现算法逻辑
  }

  *executeSteps(graph: Graph, input: MyInput): Generator<AlgorithmStep, MyOutput> {
    // 实现步进执行
  }
}
```

## 测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- algorithm

# 生成覆盖率报告
npm test -- --coverage
```

## 文档

- API 文档: `docs/api.md`
- 架构文档: `docs/architecture.md`
- 用户指南: `docs/getting-started.md`

更新文档时请确保:
- 示例代码可运行
- 截图是最新的
- 链接有效

## 问题反馈

提交 Issue 时请包含:
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息(浏览器、Node 版本等)
- 截图(如适用)

## 许可证

贡献的代码将采用 MIT 许可证。
