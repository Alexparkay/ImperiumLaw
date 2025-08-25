/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FFFFFF', // White base
          secondary: '#F5F5F5', // Light gray card background
          accent: '#EBEBEB',   // Hover states
        },
        txt: {
          primary: '#333333', // Headings
          secondary: '#666666', // Body text
          muted: '#999999',   // Less important text
        },
        accentColor: {
          primary: '#3B82F6', // Blue
          secondary: '#10B981', // Green
          warning: '#F59E0B', // Orange
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'spin-slow': 'spin 7s linear infinite',
      },
      screens: {
        '3xl': '2200px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        imperiumlight: {
          "primary": "#3B82F6",
          "secondary": "#10B981",
          "accent": "#F59E0B",
          "neutral": "#EBEBEB",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "rgba(0, 0, 0, 0.1)",
          "info": "#3ABFF8",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#F87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "color-scheme": "light",
          "fontFamily": 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
          "--tw-prose-body": "#666666",
          "--tw-prose-headings": "#333333",
          "--tw-prose-lead": "#666666",
          "--tw-prose-links": "#3B82F6",
          "--tw-prose-bold": "#333333",
          "--tw-prose-counters": "#999999",
          "--tw-prose-bullets": "#999999",
          "--tw-prose-hr": "rgba(0, 0, 0, 0.1)",
          "--tw-prose-quotes": "#333333",
          "--tw-prose-quote-borders": "rgba(0, 0, 0, 0.1)",
          "--tw-prose-captions": "#999999",
          "--tw-prose-code": "#333333",
          "--tw-prose-pre-code": "#666666",
          "--tw-prose-pre-bg": "#F5F5F5",
          "--tw-prose-th-borders": "rgba(0, 0, 0, 0.1)",
          "--tw-prose-td-borders": "rgba(0, 0, 0, 0.1)",
          "base-content": "#666666",
          "primary-content": "#FFFFFF",
          "secondary-content": "#FFFFFF",
          "accent-content": "#FFFFFF",
          "neutral-content": "#333333",
          "info-content": "#FFFFFF",
          "success-content": "#FFFFFF",
          "warning-content": "#FFFFFF",
          "error-content": "#FFFFFF",
        },
      },
      'light',
    ],
    darkTheme: "imperiumlight",
  },
  darkMode: 'class',
};
