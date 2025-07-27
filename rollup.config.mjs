import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

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

// Function to get all CSS files in public/stylesheets (skip style.css, use output.css instead)
function getCSSEntries() {
  const cssDir = 'public/stylesheets';
  const entries = {};
  
  if (fs.existsSync(cssDir)) {
    // Look for output.css (the compiled Tailwind CSS) instead of the source files
    const outputFile = path.join(cssDir, 'output.css');
    if (fs.existsSync(outputFile)) {
      entries['style'] = outputFile; // Name it style so it becomes style.css in dist
    }
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
    ...(isProduction ? [terser({
      compress: {
        drop_console: false, // Keep console.log for debugging
        drop_debugger: true
      },
      mangle: true,
      format: {
        comments: false
      }
    })] : [])
  ]
} : null;

// CSS configuration (copy the compiled Tailwind CSS)
const cssConfig = Object.keys(cssEntries).length > 0 ? {
  input: cssEntries,
  output: {
    dir: 'public/dist/css',
    assetFileNames: '[name][extname]'
  },
  plugins: [
    postcss({
      extract: true,
      minimize: isProduction,
      sourceMap: !isProduction
      // No need for config since we're processing the already-compiled CSS
    })
  ]
} : null;

// Export configurations (filter out null values)
export default [jsConfig, cssConfig].filter(Boolean);
