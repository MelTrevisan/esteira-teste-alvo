import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Em desenvolvimento, repassa /api ao back local (porta 3000).
export default defineConfig({
  plugins: [vue()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
  build: { outDir: 'dist', emptyOutDir: true },
});
