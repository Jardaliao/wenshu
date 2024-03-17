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
                target: 'https://wenshu.liaoxiaojie.cn:9020',
                changeOrigin: true
            },
            '^/api/login': {
                target: 'https://account.wenshu.liaoxiaojie.cn:9021',
                changeOrigin: true
            },
            '^/oauth/authorize': {
                target: 'https://account.wenshu.liaoxiaojie.cn:9021',
                changeOrigin: true
            },
            '^/CallBackController/authorizeCallBack': {
                target: 'https://wenshu.liaoxiaojie.cn:9020',
                changeOrigin: true
            },
            '^/app': {
                target: 'https://account.wenshu.liaoxiaojie.cn:9021',
                changeOrigin: true
            },
            '^/website/parse/rest.q4w': {
                target: 'https://wenshu.liaoxiaojie.cn:9020',
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
