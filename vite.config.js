import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // This raises the warning limit to 1000 kBs
    chunkSizeWarningLimit: 1000,
  },
});
