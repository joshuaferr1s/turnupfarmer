export default {
  content: ["./index.html", "./src/**/*.{vue,js,jsx}"],
  theme: { extend: {} },
  plugins: [require("@tailwindcss/forms")],
};
