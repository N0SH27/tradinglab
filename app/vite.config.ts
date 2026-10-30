import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { inspectAttr } from 'kimi-plugin-inspect-react'
import hiddenAccessHandler from './api/hidden-access.js'
import hiddenContentHandler from './api/hidden-content.js'
import hiddenMarketHandler from './api/hidden-market.js'
import hiddenResearchHandler from './api/hidden-research.js'

/* 本地开发复用同一组 Serverless handlers；生产环境由 Vercel /api 直接执行。 */
function localHiddenApi(): Plugin {
  return {
    name: 'local-hidden-api',
    configureServer(server) {
      server.middlewares.use('/api/hidden-access', (req, res, next) => {
        void hiddenAccessHandler(req, res).catch(next)
      })
      server.middlewares.use('/api/hidden-content', (req, res, next) => {
        try {
          hiddenContentHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
      server.middlewares.use('/api/hidden-market', (req, res, next) => {
        void hiddenMarketHandler(req, res).catch(next)
      })
      server.middlewares.use('/api/hidden-research', (req, res, next) => {
        try {
          hiddenResearchHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['HIDDEN_PAGE_PASSWORD', 'HIDDEN_PAGE_SECRET']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key]
  }

  return {
    base: './',
    plugins: [localHiddenApi(), inspectAttr(), react()],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
