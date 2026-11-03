import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_BASE_URL || 'http://api.favorit-parts.ru';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/hsprice': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hsprice/, '/hs/hsprice'),
        },
      },
    },
  };
});
