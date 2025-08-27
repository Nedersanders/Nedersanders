import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.NODE_ENV === 'production';

const config = [
  // JavaScript bundle
  {
    input: 'public/javascripts/app.js',
    output: {
      file: 'public/dist/js/app.min.js',
      format: 'iife',
      name: 'App',
      sourcemap: !isProduction
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      ...(isProduction ? [terser()] : [])
    ]
  },
  // CSS bundle
  {
    input: 'public/stylesheets/output.css',
    output: {
      file: 'public/dist/css/style.min.css'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: isProduction,
        sourceMap: !isProduction,
        extensions: ['.css']
      })
    ]
  }
];

export default config;
