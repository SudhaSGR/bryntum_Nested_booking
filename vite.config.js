import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget =
    env.VITE_RMS_PROXY_TARGET || 'https://developer-ids-780.pronto.com.au'
  const apiResource = env.VITE_RMS_API_RESOURCE || 'i780m_m.rmssched'
  const apiRoot = `/pronto/rest/${apiResource}/secureapi`
  const apiTarget = `${proxyTarget}/pronto/rest/${apiResource}/secureapi/`
  const rmsToken = env.RMS_TOKEN || ''

  const withProntoAuth = (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.setHeader('origin', proxyTarget)
      if (rmsToken) {
        proxyReq.setHeader('X-Pronto-Token', rmsToken)
      }
    })
  }

  return {
    plugins: [react(), basicSsl()],
    server: {
      // Pronto local auth expects HTTPS (CSRF); same as RMS webpack.dev
      https: true,
      proxy: {
        [apiRoot]: {
          target: apiTarget,
          changeOrigin: false,
          secure: false,
          rewrite: (path) => path.replace(apiRoot, ''),
          configure: withProntoAuth,
        },
        '/pronto/rest/locallogin': {
          target: proxyTarget,
          changeOrigin: false,
          secure: false,
          configure: withProntoAuth,
        },
        '/pronto/rest/localauth': {
          target: proxyTarget,
          changeOrigin: false,
          secure: false,
          configure: withProntoAuth,
        },
      },
    },
  }
})
