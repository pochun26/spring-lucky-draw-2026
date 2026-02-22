import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 部署路径配置
// 如果仓库名称是 spring-lucky-draw-2026，则 base 应该是 '/spring-lucky-draw-2026/'
// 如果部署到用户/组织的根目录，则 base 应该是 '/'
// 默认使用环境变量 VITE_BASE_PATH，如果没有设置则使用 '/'
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  // ✅ 必需：配置 React 插件，让 Vite 能够处理 JSX/TSX
  plugins: [react()],
  
  // ✅ 重要：GitHub Pages 需要正确的 base 路径
  // 这样所有资源（CSS、JS、图片）的路径才会正确
  base,
  
  // 开发服务器配置（可选）
  server: {
    port: 3000,
    host: '0.0.0.0', // 允许外部访问
  },
  
  // 构建配置（可选，使用默认值也可以）
  build: {
    outDir: 'dist',        // 输出目录
    assetsDir: 'assets',   // 静态资源目录
  }
});
