import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import ElementPlus from 'unplugin-element-plus/vite'
import VitePluginCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  // 构建配置
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        classification: path.resolve(__dirname, 'classification.html'),
        auth: path.resolve(__dirname, 'auth.html')
      }
    }
  },
  // 共享配置
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'c': path.resolve(__dirname, 'src/components'),
      'core': path.resolve(__dirname, 'src/core')
    }
  },
  plugins: [
    vue(),
    ElementPlus(),
    VitePluginCompression()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  },
})
