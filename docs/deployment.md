# 部署文档

## GitHub Pages 部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署流程

1. **触发条件**
   - 推送到 `main` 分支
   - 手动触发 (workflow_dispatch)

2. **构建步骤**
   - 检出代码
   - 安装 Node.js 20
   - 安装依赖 (`npm ci`)
   - 构建项目 (`npm run build`)
   - 上传构建产物

3. **部署步骤**
   - 部署到 GitHub Pages
   - 自动更新网站

### 访问地址

部署完成后，可以通过以下地址访问：

```
https://h1s97x.github.io/PathFinder/
```

### 配置 GitHub Pages

1. 进入仓库设置 (Settings)
2. 导航到 Pages 部分
3. Source 选择 "GitHub Actions"
4. 保存设置

### 本地预览生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## CI/CD 工作流

### CI 工作流 (.github/workflows/ci.yml)

**触发条件:**
- 推送到 `main` 或 `develop` 分支
- 针对 `main` 或 `develop` 的 Pull Request

**测试矩阵:**
- Node.js 18.x
- Node.js 20.x

**检查项目:**
1. 代码检查 (ESLint)
2. 类型检查 (TypeScript)
3. 构建测试
4. 构建产物验证

### 部署工作流 (.github/workflows/deploy.yml)

**触发条件:**
- 推送到 `main` 分支
- 手动触发

**权限要求:**
- contents: read
- pages: write
- id-token: write

**部署流程:**
1. Build Job: 构建项目并上传产物
2. Deploy Job: 部署到 GitHub Pages

## 环境变量

### 生产环境

```typescript
// vite.config.ts
base: process.env.NODE_ENV === 'production' ? '/PathFinder/' : '/'
```

### 开发环境

```bash
# 本地开发
npm run dev

# 访问地址
http://localhost:3000
```

## 构建配置

### Vite 配置

```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/PathFinder/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### 构建优化

- 代码分割
- Tree shaking
- 资源压缩
- Gzip 压缩

## 部署检查清单

- [ ] 代码已推送到 `main` 分支
- [ ] GitHub Actions 工作流已启用
- [ ] GitHub Pages 已配置为 "GitHub Actions"
- [ ] 构建成功（检查 Actions 标签页）
- [ ] 网站可访问
- [ ] 所有功能正常工作

## 故障排查

### 构建失败

1. 检查 Actions 日志
2. 本地运行 `npm run build` 测试
3. 检查依赖版本
4. 验证 TypeScript 类型

### 部署失败

1. 检查 GitHub Pages 设置
2. 验证工作流权限
3. 检查分支保护规则
4. 查看部署日志

### 页面无法访问

1. 等待 DNS 传播（最多 10 分钟）
2. 检查 base path 配置
3. 清除浏览器缓存
4. 验证资源路径

## 手动部署

如果需要手动部署：

```bash
# 1. 构建项目
npm run build

# 2. 进入构建目录
cd dist

# 3. 初始化 git（如果需要）
git init
git add -A
git commit -m 'deploy'

# 4. 推送到 gh-pages 分支
git push -f git@github.com:h1s97x/PathFinder.git main:gh-pages

# 5. 返回项目根目录
cd ..
```

## 性能优化

### 构建优化

- 使用 `npm ci` 而非 `npm install`
- 启用依赖缓存
- 并行构建任务

### 部署优化

- 使用 CDN 加速
- 启用 Gzip/Brotli 压缩
- 配置缓存策略

## 监控和日志

### GitHub Actions

- 查看工作流运行历史
- 下载构建日志
- 监控构建时间

### 部署状态

- 检查 Pages 部署状态
- 查看部署历史
- 监控访问统计

## 回滚策略

如果部署出现问题：

1. **快速回滚**
   - 重新运行上一次成功的工作流
   - 或推送上一个稳定版本

2. **版本控制**
   - 使用 Git 标签标记稳定版本
   - 保留部署历史记录

3. **紧急修复**
   - 创建 hotfix 分支
   - 快速修复并部署
   - 合并回主分支

## 最佳实践

1. **分支策略**
   - `main`: 生产环境
   - `develop`: 开发环境
   - `feature/*`: 功能分支

2. **提交规范**
   - 使用 Conventional Commits
   - 清晰的提交信息
   - 原子性提交

3. **测试策略**
   - 本地测试通过后再推送
   - CI 通过后再合并
   - 部署前验证构建

4. **文档维护**
   - 更新 CHANGELOG
   - 记录重大变更
   - 维护部署文档

## 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [项目仓库](https://github.com/h1s97x/PathFinder)
- [在线演示](https://h1s97x.github.io/PathFinder/)
