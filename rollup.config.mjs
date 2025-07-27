import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'fs';
import path from 'path';

//Set to true for now

const isProduction = true // process.env.NODE_ENV === 'production';

// Function to get all JS files in public/javascripts
function getJSEntries() {
  const jsDir = 'public/javascripts';
  const entries = {};
  
  if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const name = path.basename(file, '.js');
        entries[name] = path.join(jsDir, file);
      }
    });
  }
  
  return entries;
}

// Function to get all CSS files in public/stylesheets (including Tailwind CSS)
function getCSSEntries() {
  const cssDir = 'public/stylesheets';
  const entries = {};
  
  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    files.forEach(file => {
      if (file.endsWith('.css') && !file.includes('output') && !file.includes('dist')) {
        const name = path.basename(file, '.css');
        entries[name] = path.join(cssDir, file);
      }
    });
  }
  
  return entries;
}

const jsEntries = getJSEntries();
const cssEntries = getCSSEntries();

// JavaScript configuration
const jsConfig = Object.keys(jsEntries).length > 0 ? {
  input: jsEntries,
  output: {
    dir: 'public/dist/js',
    format: 'iife',
    sourcemap: !isProduction,
    entryFileNames: '[name].min.js'
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    ...(isProduction ? [terser()] : [])
  ]
} : null;

// CSS configuration (with Tailwind CSS support)
const cssConfig = Object.keys(cssEntries).length > 0 ? {
  input: cssEntries,
  output: {
    dir: 'public/dist/css'
  },
  plugins: [
    postcss({
      extract: true,
      minimize: isProduction,
      sourceMap: !isProduction,
      config: {
        path: './postcss.config.mjs'
      },
      plugins: [
        autoprefixer(),
        ...(isProduction ? [cssnano()] : [])
      ]
    })
  ]
} : null;

// Export configurations (filter out null values)
export default [jsConfig, cssConfig].filter(Boolean);
