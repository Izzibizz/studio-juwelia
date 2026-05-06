import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: './',
  base: '',
  publicDir: path.resolve(__dirname, '../assets'),
  build: {
    outDir: path.resolve(__dirname, '../www'),
    assetsInlineLimit: 0,
    emptyOutDir: true,
  },
});
