// Сборка библиотеки в пакет: dist/index.js (ES), dist/index.cjs (CommonJS), dist/style.css, шрифты в dist/assets.
// Сторибук собирается отдельно своим конфигом и этот файл не использует.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      // React и three ставит приложение; в пакет они не попадают
      external: ['react', 'react-dom', 'react/jsx-runtime', 'three'],
    },
  },
});
