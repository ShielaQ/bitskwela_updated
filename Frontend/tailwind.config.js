/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:      ['Poppins', 'system-ui', 'sans-serif'],
        display:   ['Unbounded', 'system-ui', 'sans-serif'],
        serif:     ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        orange: { DEFAULT: '#F7931A', dark: '#E0840F', light: '#FEF5E7', border: '#FDDFA0' },
        brand:  { head: '#222222', body: '#555555', muted: '#999999' },
        surface: { DEFAULT: '#F8F8F8', card: '#FFFFFF' },
        line:   { DEFAULT: '#E8E8E8', mid: '#D0D0D0' },
        ok:     { DEFAULT: '#16A34A', light: '#F0FDF4' },
        bad:    { DEFAULT: '#DC2626', light: '#FEF2F2' },
        info:   { DEFAULT: '#2563EB', light: '#EFF6FF' },
      },
      borderRadius: {
        sm:   '6px',
        DEFAULT: '10px',
        lg:   '14px',
        pill: '999px',
      },
      boxShadow: {
        card:  '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        hover: '0 4px 20px rgba(247,147,26,0.14)',
        float: '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
