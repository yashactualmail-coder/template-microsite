import { readFile } from 'node:fs/promises';
import handlebars from 'vite-plugin-handlebars';
import tailwindcss from '@tailwindcss/vite'
import {default as context} from './src/data.js'

export default {
  root: 'src',
  server: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    handlebars({
      partialDirectory: 'src/partials', 
      context: context,
    }),
    tailwindcss()
  ],
};