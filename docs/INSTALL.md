# 📦 安装和运行指南

## 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (或 yarn >= 1.22.0)
- **浏览器**: Chrome, Firefox, Safari, Edge (最新版本)
- **操作系统**: Windows, macOS, Linux

## 快速安装

### 方式一: 使用 npm

```bash
# 1. 进入项目目录
cd campus-navigation

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 方式二: 使用 yarn

```bash
# 1. 进入项目目录
cd campus-navigation

# 2. 安装依赖
yarn install

# 3. 启动开发服务器
yarn dev
```

### 方式三: 使用 pnpm

```bash
# 1. 进入项目目录
cd campus-navigation

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

## 验证安装

安装完成后,浏览器会自动打开 http://localhost:3000

你应该看到:
- ✅ 欢迎对话框
- ✅ 工具栏和侧边栏
- ✅ 空白画布

## 可用命令

```bash
# 开发模式
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览生产版本

# 代码质量
npm run lint         # 检查代码规范
npm run format       # 格式化代码
```

## 常见问题

### 1. 端口被占用

**错误信息**:
```
Port 3000 is already in use
```

**解决方案**:
```bash
# 方式 1: 修改端口
# 编辑 vite.config.ts
server: {
  port: 3001
}

# 方式 2: 杀死占用端口的进程
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### 2. 依赖安装失败

**错误信息**:
```
npm ERR! code ERESOLVE
```

**解决方案**:
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install

# 或使用 --legacy-peer-deps
npm install --legacy-peer-deps
```

### 3. TypeScript 错误

**错误信息**:
```
Cannot find module '@/...'
```

**解决方案**:
```bash
# 重新生成类型
npm run build

# 或重启 TypeScript 服务器
# VS Code: Ctrl/Cmd + Shift + P
# 输入: TypeScript: Restart TS Server
```

### 4. 样式不生效

**解决方案**:
```bash
# 清除 Vite 缓存
rm -rf .vite
npm run dev
```

### 5. 内存不足

**错误信息**:
```
JavaScript heap out of memory
```

**解决方案**:
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## 开发环境配置

### VS Code 推荐扩展

创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code 设置

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 环境变量

创建 `.env.local` 文件(可选):

```env
# 开发环境
VITE_APP_TITLE=校园导航系统
VITE_API_URL=http://localhost:3000
```

## Docker 部署(可选)

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

运行:

```bash
# 构建镜像
docker build -t campus-navigation .

# 运行容器
docker run -p 8080:80 campus-navigation
```

## 性能优化

### 开发模式

```bash
# 使用 SWC 替代 Babel (更快)
npm install -D @vitejs/plugin-react-swc
```

修改 `vite.config.ts`:

```typescript
import react from '@vitejs/plugin-react-swc'
```

### 生产构建

```bash
# 分析包大小
npm run build -- --mode analyze

# 压缩优化
npm run build -- --minify terser
```

## 更新依赖

```bash
# 检查过时的包
npm outdated

# 更新所有包
npm update

# 更新到最新版本
npx npm-check-updates -u
npm install
```

## 卸载

```bash
# 删除依赖
rm -rf node_modules

# 删除锁文件
rm package-lock.json

# 删除构建产物
rm -rf dist
```

## 获取帮助

### 文档

- [快速开始](./QUICKSTART.md)
- [项目结构](./PROJECT_STRUCTURE.md)
- [API 文档](./docs/api.md)

### 社区

- GitHub Issues
- Stack Overflow
- Discord/Slack

### 日志

查看开发服务器日志:

```bash
npm run dev -- --debug
```

## 下一步

安装完成后,查看:

1. [QUICKSTART.md](./QUICKSTART.md) - 5分钟快速上手
2. [CHECKLIST.md](./CHECKLIST.md) - 功能测试清单
3. [docs/getting-started.md](./docs/getting-started.md) - 详细使用指南

---

祝你使用愉快! 🎉

如有问题,请查看 [常见问题](#常见问题) 或提交 Issue。
