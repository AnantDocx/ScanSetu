import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
function httpsConfig() {
  // Prefer env-provided certs
  const keyPath = process.env.VITE_DEV_HTTPS_KEY
  const certPath = process.env.VITE_DEV_HTTPS_CERT
  if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  }

  // Fallback: look in ./certs
  const certsDir = path.resolve(__dirname, 'certs')
  const keyFile = ['key.pem', 'server.key'].map((f) => path.join(certsDir, f)).find(fs.existsSync)
  const certFile = ['cert.pem', 'server.crt'].map((f) => path.join(certsDir, f)).find(fs.existsSync)
  if (keyFile && certFile) {
    return {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile),
    }
  }
  return undefined
}

export default defineConfig(() => {
  const https = httpsConfig()
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: true, // allow LAN access
      port: 5173,
      strictPort: true,
      https, // enables HTTPS if certs are found
    },
    preview: {
      host: true,
      port: 5173,
      https,
    },
  }
})
