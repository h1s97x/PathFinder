# 部署指南

## 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

## 部署到 Vercel

### 方式 1: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方式 2: 通过 Git 集成

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. Vercel 会自动检测 Vite 项目并配置

## 部署到 Netlify

### 方式 1: 拖拽部署

1. 运行 `npm run build`
2. 访问 [netlify.com](https://netlify.com)
3. 将 `dist/` 文件夹拖拽到部署区域

### 方式 2: 通过 Git 集成

1. 将代码推送到 GitHub
2. 在 Netlify 中导入仓库
3. 配置构建设置:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 部署到 GitHub Pages

1. 修改 `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. 添加部署脚本到 `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. 安装 gh-pages:

```bash
npm install -D gh-pages
```

4. 部署:

```bash
npm run deploy
```

## 环境变量

创建 `.env.production` 文件:

```env
VITE_APP_TITLE=校园导航系统
VITE_API_URL=https://api.example.com
```

在代码中使用:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 性能优化

### 1. 代码分割

Vite 自动进行代码分割,但可以手动优化:

```typescript
// 懒加载组件
const AlgorithmPanel = lazy(() => import('./components/Algorithm/AlgorithmPanel'))
```

### 2. 资源压缩

在 `vite.config.ts` 中配置:

```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
```

### 3. CDN 加速

使用 CDN 加载大型库:

```html
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js"></script>
```

## 监控和分析

### Google Analytics

在 `index.html` 中添加:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry 错误追踪

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 自定义域名

### Vercel

1. 在项目设置中添加域名
2. 配置 DNS 记录:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Netlify

1. 在站点设置中添加自定义域名
2. 配置 DNS 记录:
   - Type: CNAME
   - Name: www
   - Value: your-site.netlify.app

## 持续集成/持续部署 (CI/CD)

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 故障排查

### 构建失败

- 检查 Node.js 版本
- 清除缓存: `rm -rf node_modules package-lock.json && npm install`
- 检查依赖版本兼容性

### 部署后白屏

- 检查 `base` 配置是否正确
- 查看浏览器控制台错误
- 检查资源路径是否正确

### 性能问题

- 使用 Lighthouse 分析
- 检查网络请求
- 优化图片和资源大小
