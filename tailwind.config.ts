import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic colors (HSL)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Design system colors
        navy: {
          DEFAULT: "#002C4A",
          dark: "#001321",
          90: "rgba(0, 19, 33, 0.90)",
          70: "rgba(0, 19, 33, 0.70)",
          50: "rgba(0, 19, 33, 0.50)",
          30: "rgba(0, 19, 33, 0.30)",
          15: "rgba(0, 19, 33, 0.15)",
          10: "rgba(0, 19, 33, 0.10)",
          "05": "rgba(0, 19, 33, 0.05)",
        },
        gold: {
          DEFAULT: "#B19365",
          light: "#C9AD82",
          lighter: "#E8D9C2",
          lightest: "#F5EDE1",
        },
        gray: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
        },
        success: "#2E7D32",
        warning: "#F57C00",
        error: "#C62828",
        info: "#1565C0",
      },
      fontFamily: {
        sans: ["var(--font-primary)"],
        mono: ["var(--font-mono)"],
        table: ["var(--font-table)"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 19, 33, 0.08)",
        md: "0 4px 12px rgba(0, 19, 33, 0.10)",
        lg: "0 8px 30px rgba(0, 19, 33, 0.12)",
        xl: "0 16px 50px rgba(0, 19, 33, 0.16)",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "64px",
        "6xl": "80px",
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
