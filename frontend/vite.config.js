// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis' // 👈 Add this to fix the `global` reference error
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis' // 👈 Important for development build
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill() // 👈 Required for production build
      ]
    }
  }
})
