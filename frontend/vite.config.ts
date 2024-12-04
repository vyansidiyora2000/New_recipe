import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// vite.config.ts or vite.config.js
export default {
  server: {
    host: '0.0.0.0', // Expose the server to all network interfaces
    port: 5173,       // Optional: Use the desired port
  },
  define: {
    global: 'globalThis', // This will ensure 'global' is replaced with 'globalThis'
  },
};
