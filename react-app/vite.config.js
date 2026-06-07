import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        // Customer reservation app
        app: resolve(__dirname, 'index.html'),
        // Admin dashboard
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
