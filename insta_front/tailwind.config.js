/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {DEFAULT: '#0095f6', hover: '#1877f2'},
        ink: {DEFAULT: '#262626', soft: '#8e8e8e', line: '#dbdbdb'},
        surface: '#fafafa'
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.06)',
        soft: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: []
}
