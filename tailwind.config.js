module.exports = {
  theme: {
    extend: {
      colors: {
        yt: {
          // Background layers
          bg: {
            DEFAULT: '#151518', //'#181818', // Main background
            secondary: '#231f28', //'#212121', // Slightly lighter panels/cards
            tertiary: '#272727', // Hover / active states
          },

          // Border + divider
          border: '#3f3f3f', // Subtle border (like YouTube's)
          border_2: 'rgba(255,255,255,0.2)',
          // Text colors
          text: {
            primary: '#FFFFFF', // Pure white for main text
            secondary: '#AAAAAA', // Muted gray for metadata
            muted: '#717171', // Even softer, used for icons/disabled
          },

          // Accent (YouTube red + blue links)
          accent: {
            red: '#FF0000', // YouTube brand red
            'hover-red': '#ff4343',
            link: '#3EA6FF', // Links / hover highlights
          },
        },
      },
    },
  },
};
