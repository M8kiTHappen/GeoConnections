import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

function anthropicProxyPlugin(apiKey) {
  return {
    name: 'anthropic-proxy',
    configureServer(server) {
      server.middlewares.use('/api/anthropic', (req, res) => {
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          const options = {
            hostname: 'api.anthropic.com',
            path: '/v1/messages',
            method: req.method,
            headers: {
              'content-type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-client-side-api-key': 'true',
            },
          }

          const proxyReq = https.request(options, proxyRes => {
            res.writeHead(proxyRes.statusCode, {
              'content-type': proxyRes.headers['content-type'] || 'application/json',
              'access-control-allow-origin': '*',
            })
            proxyRes.pipe(res)
          })

          proxyReq.on('error', err => {
            console.error('[anthropic-proxy] request error:', err)
            res.writeHead(502).end()
          })

          if (body) proxyReq.write(body)
          proxyReq.end()
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      anthropicProxyPlugin(env.VITE_ANTHROPIC_API_KEY),
    ],
  }
})
