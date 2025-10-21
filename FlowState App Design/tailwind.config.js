/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include all your components
  ],
  theme: {
    extend: {
      colors: {
        /* Link Tailwind colors to your global tokens */
        lavender: {
          50: 'var(--color-lavender-50)',
          100: 'var(--color-lavender-100)',
          200: 'var(--color-lavender-200)',
          300: 'var(--color-lavender-300)',
          400: 'var(--color-lavender-400)',
          500: 'var(--color-lavender-500)',
          600: 'var(--color-lavender-600)',
          700: 'var(--color-lavender-700)',
        },
        peach: {
          50: 'var(--color-peach-50)',
          100: 'var(--color-peach-100)',
          200: 'var(--color-peach-200)',
          300: 'var(--color-peach-300)',
          400: 'var(--color-peach-400)',
          500: 'var(--color-peach-500)',
        },
        mood: {
          low: 'var(--mood-low-bg)',
          moderate: 'var(--mood-moderate-bg)',
          good: 'var(--mood-good-bg)',
        },
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        input: 'var(--color-input)',
        muted: 'var(--color-muted-foreground)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },

      transitionDuration: {
        fast: 'var(--animate-duration-fast)',
        normal: 'var(--animate-duration-normal)',
        slow: 'var(--animate-duration-slow)',
      },
    },
  },
  plugins: [],
};
