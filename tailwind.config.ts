const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f9fafb",
        },
        text: {
          primary: "#111827",
          muted: "#4b5563",
        },
      },
      fontFamily: {
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
