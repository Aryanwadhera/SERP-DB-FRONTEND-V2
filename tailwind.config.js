/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all your source files
  ],
  theme: {
    extend: {
      // You can add custom colors or extensions here if desired
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"], // Enables light/dark theme switching
    styled: true,
    base: true,
    utils: true,
    logs: true,
  },
};
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "black"], // only two themes
  },
}
