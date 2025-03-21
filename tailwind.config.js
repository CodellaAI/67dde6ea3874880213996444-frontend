
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          red: '#F54E2A',
          blue: '#0079D3',
          dark: '#1A1A1B',
          lightGray: '#F6F7F8',
          mediumGray: '#DAE0E6',
          darkGray: '#878A8C',
          border: '#EDEFF1',
        },
      },
    },
  },
  plugins: [],
}
