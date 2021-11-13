module.exports = {
  purge: [
    './public/**/*.html',
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'accent-1': '#FAFAFA',
        'accent-2': '#EAEAEA',
        'accent-7': '#333',
        success: '#0070f3',
        cyan: '#79FFE1',
        'light': {
          DEFAULT: '#BFBFBF',
          '50': '#FFFFFF',
          '100': '#FCFCFC',
          '200': '#EDEDED',
          '300': '#DEDEDE',
          '400': '#CFCFCF',
          '500': '#BFBFBF',
          '600': '#B8B8B8',
          '700': '#B0B0B0',
          '800': '#A8A8A8',
          '900': '#A1A1A1'
        },
        'portgore': {
          DEFAULT: '#2F275D',
          '50': '#50429E',
          '100': '#4C3F97',
          '200': '#453989',
          '300': '#3E337A',
          '400': '#372D6C',
          '500': '#2F275D',
          '600': '#28214F',
          '700': '#211B41',
          '800': '#191532',
          '900': '#120F24'
        },
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
}
