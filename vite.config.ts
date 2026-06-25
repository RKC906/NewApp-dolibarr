import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement selon le mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api-dolibarr': {
          // Utilise l'URL du fichier .env pour le proxy
          target: env.VITE_DOLIBARR_API_URL, 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-dolibarr/, '')
        }
      }
    }
  }
})