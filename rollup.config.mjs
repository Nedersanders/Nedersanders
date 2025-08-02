import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';

const isProduction = true;

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

// JavaScript configuration
const jsConfigs = Object.keys(jsEntries).length > 0 ? 
  Object.entries(jsEntries).map(([name, input]) => ({
    input,
    output: {
      file: `public/dist/js/${name}.min.js`,
      format: 'iife',
      sourcemap: !isProduction
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
  })) : [];

// Manual CSS copying (since we just need to copy the compiled CSS)
function copyCSS() {
  const sourceCSS = 'public/stylesheets/output.css';
  const targetDir = 'public/dist/css';
  const targetCSS = path.join(targetDir, 'style.css');
  
  if (fs.existsSync(sourceCSS)) {
    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy the CSS file
    fs.copyFileSync(sourceCSS, targetCSS);
    console.log('✓ CSS copied to dist/css/style.css');
  } else {
    console.warn('⚠ No CSS file found at public/stylesheets/output.css');
  }
}

// Run CSS copy immediately
copyCSS();

// Export configurations
export default jsConfigs;
