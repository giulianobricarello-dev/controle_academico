const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        brand: token('brand'),
        'brand-ink': token('brand-ink'),
        'brand-soft': token('brand-soft'),
        danger: token('danger'),
        'danger-ink': token('danger-ink'),
        'danger-soft': token('danger-soft'),
        success: token('success'),
        'success-soft': token('success-soft'),
        navy: token('navy'),
        'navy-accent': '#7FB0FF',
      },
      fontFamily: {
        sans: ['"Public Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Source Serif 4 Variable"', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 31 61 / 0.06)',
      },
      keyframes: {
        pop: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        pop: 'pop 160ms ease-out',
      },
    },
  },
  plugins: [],
}
