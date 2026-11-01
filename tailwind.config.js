/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn Variable', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      // Larger type scale for Persian (RTL) readability. The previous 12px
      // "small" text was hard to read on desktop and mobile screens.
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.45rem' }],
        sm: ['0.9375rem', { lineHeight: '1.55rem' }],
        base: ['1.0625rem', { lineHeight: '1.75rem' }],
        lg: ['1.25rem', { lineHeight: '1.85rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.15rem' }],
        '3xl': ['2.125rem', { lineHeight: '2.5rem' }],
      },
    },
  },
  plugins: [],
}
