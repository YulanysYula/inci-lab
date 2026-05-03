/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Apothecary palette — warm cream paper, deep ink, botanical sage,
        // dried-rose, and a muted terracotta for warnings.
        cream: {
          50: "#FBF7EF",
          100: "#F5EFE2",
          200: "#EDE3CD",
        },
        ink: {
          DEFAULT: "#1F1B16",
          soft: "#3A342B",
          mute: "#6B6356",
        },
        sage: {
          50: "#EAEFE7",
          200: "#B8C5AC",
          500: "#6B7F5C",
          700: "#4A5A3F",
        },
        rose: {
          200: "#E8C9C0",
          500: "#B7715F",
          700: "#8A4F40",
        },
        ochre: {
          200: "#E8D4A2",
          500: "#C2934A",
        },
      },
      fontFamily: {
        // Distinctive, editorial pairing — not the usual Inter/Roboto.
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Inter Tight"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.015em",
        widish: "0.08em",
      },
    },
  },
  plugins: [],
};
