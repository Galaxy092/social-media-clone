module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFD', //Backgorund color
        secondary: '#F5F5F5',
        secondaryVariant: '#495057', //this is the dark gray that use for feature text
        accent: '#1A5DB4',
        black: '#0C050D', //this text color
      },
      screens: {
        xs: '480px', // Custom extra small screen size
        sm: '640px', // Custom small screen size
        md: '768px', // Custom medium screen size
        lg: '1024px', // Custom large screen size
        xl: '1280px', // Custom extra large screen size
        '2xl': '1536px', // Custom 2 extra large screen size
      },
    },
  },
};
