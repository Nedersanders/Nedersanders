const { DEFAULTS } = require('@rollup/plugin-node-resolve');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        "text-primary": {
          DEFAULT: 'var(--text-primary)'
        }
      },
      height: {
        '8.5': '34px',
        '9.5': '38px',
        '13': '52px',
      },
      width: {
        '8.5': '34px',
        '9.5': '38px',
        '13': '52px',
      },
    },
  },
  plugins: [],
};
