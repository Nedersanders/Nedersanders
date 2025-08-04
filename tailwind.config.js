/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
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
