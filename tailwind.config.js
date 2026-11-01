/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Midnight Executive design tokens. These are the only brand colors;
        // lighter/darker shades are used for surfaces, borders and states.
        midnight: {
          DEFAULT: '#101D30',
          950: '#0A1420',
          900: '#101D30',
          800: '#16283F',
          700: '#1E3550',
          600: '#294564',
          500: '#35577A',
          400: '#557799',
          300: '#8BA3BB',
          200: '#C3D1DF',
          100: '#DFE6EF',
          50: '#F2F6FA',
        },
        brand: {
          DEFAULT: '#147D78',
          950: '#073B38',
          900: '#0A4F4B',
          800: '#0E625D',
          700: '#116F6A',
          600: '#147D78',
          500: '#1A918B',
          400: '#3AA9A3',
          300: '#6EC5C0',
          200: '#A7DDDA',
          100: '#D3EEEB',
          50: '#EBF6F5',
        },
        gold: {
          DEFAULT: '#D6A449',
          950: '#4A3611',
          900: '#6B4E17',
          800: '#8C6620',
          700: '#A97D29',
          600: '#C08F32',
          500: '#D6A449',
          400: '#E0B86B',
          300: '#EBD09A',
          200: '#F3E2C2',
          100: '#F9F0DD',
          50: '#FCF8EF',
        },
        industry: {
          DEFAULT: '#2878A8',
          950: '#0B2C40',
          900: '#124A67',
          800: '#185E83',
          700: '#1F6A96',
          600: '#2878A8',
          500: '#3E8DB9',
          400: '#6BAAD0',
          300: '#A2CAE2',
          200: '#CDE4F1',
          100: '#E4F0F7',
          50: '#F2F8FB',
        },
        // Base roles read from CSS variables so light/dark themes share one source of truth.
        canvas: 'var(--sa-canvas)',
        surface: 'var(--sa-surface)',
        ink: 'var(--sa-ink)',
        muted: 'var(--sa-muted)',
        line: 'var(--sa-line)',
      },
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
      boxShadow: {
        card: '0 1px 2px rgba(16, 29, 48, 0.04), 0 8px 24px -18px rgba(16, 29, 48, 0.22)',
        raised: '0 12px 32px -20px rgba(16, 29, 48, 0.35)',
      },
    },
  },
  plugins: [],
}
