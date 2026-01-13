let tailwindcss;
let autoprefixer;
try {
  tailwindcss = require('tailwindcss');
} catch (e) {
  tailwindcss = null;
}
try {
  autoprefixer = require('autoprefixer');
} catch (e) {
  autoprefixer = null;
}

module.exports = {
  plugins: [
    ...(tailwindcss ? [tailwindcss()] : []),
    ...(autoprefixer ? [autoprefixer()] : []),
  ],
};
