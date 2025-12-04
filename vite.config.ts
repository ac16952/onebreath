import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // 載入環境變數 (例如 .env 檔案中的 VITE_API_KEY)
  // If you need to access raw env values here, uncomment the following:
  // const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Use import.meta.env.VITE_API_KEY in client code; no need to define process.env here.
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});