import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import demoEmbedPlugin from './vite-plugin-demo-embed';

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
  plugins: [react(), demoEmbedPlugin()],
  build: {
    outDir: 'build/embedded',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/embedded-index.js'),
      name: 'BaseUnitTools',
      formats: ['es'],
      fileName: () => 'base-unit-tools.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Ensure CSS files are named predictably
          if (assetInfo.name.endsWith('.css')) {
            return 'base-unit-tools.css';
          }
          // Other assets can use a hash
          return 'assets/[name]-[hash][extname]';
        },
        // Ensure no chunk files are created
        chunkFileNames: 'base-unit-tools.js',
        inlineDynamicImports: true
      },
      // No external dependencies - bundle everything
      external: []
    },
    cssCodeSplit: false
  },
  // Define environment variables for the browser
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
};

export default defineConfig(isEmbedded ? embeddedConfig : standaloneConfig);