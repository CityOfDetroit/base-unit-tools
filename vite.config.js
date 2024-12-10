import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Determine if we're building the embedded version
const isEmbedded = process.env.BUILD_TARGET === 'embedded';

// Configuration for the standalone app
const standaloneConfig = {
  plugins: [react()],
  build: {
    outDir: 'build/standalone',
    emptyOutDir: true
  }
};

// Configuration for the embedded version
const embeddedConfig = {
  plugins: [react()],
  build: {
    outDir: 'build/embedded',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/embedded-index.js'),
      output: {
        format: 'es',
        entryFileNames: 'base-unit-tools.js',
      }
    },
    cssCodeSplit: false
  }
};

export default defineConfig(isEmbedded ? embeddedConfig : standaloneConfig);