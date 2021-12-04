module.exports = {
  mode: "jit",
  purge: {
    content: ["src/**/*.njk"],
    options: {
      safelist: [],
    },
  },

  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
