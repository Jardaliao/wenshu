import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        proxy: {
            '^/tongyiLogin/authorize': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            },
            '^/api/login': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            },
            '^/oauth/authorize': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            },
            '^/CallBackController/authorizeCallBack': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            },
            '^/app': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            },
            '^/website/parse/rest.q4w': {
                target: 'https://wenshu.liaoxiaojie.cn',
                changeOrigin: true
            }
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
