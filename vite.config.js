import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ['**/.vs/**'],
    },
    proxy: {
      //只要前端發送 /api 開頭的請求，Vite 就會自動轉發到 C# 後端
      '/api': {
        target: 'https:commissionwebapi.onrender.com',
        changeOrigin: true,
        secure: true, //允許 Localhost 開發用的自簽 SSL 憑證
      },
      // '/api': {
      //   target: 'https:localhost:7015', 改成你的本機後端網址
      //   changeOrigin: true,
      //   secure: false, 本機開發若遇到憑證問題設為 false 較不容易被擋
      // },
    },
  },
})
