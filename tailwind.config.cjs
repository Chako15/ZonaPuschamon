module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sao-blue': '#00b3ff',
        'sao-neon': '#7df9ff',
        'sao-dark': '#0b1020'
      },
      boxShadow: {
        'neon': '0 4px 30px rgba(0,179,255,0.15), inset 0 0 30px rgba(125,249,255,0.04)'
      }
    },
  },
  plugins: [],
}
