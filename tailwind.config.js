module.exports = {
  theme: {
    extend: {
      colors: {
        yt: {
          // Background layers
          bg: {
            DEFAULT: '#181818', // Main background
            secondary: '#212121', // Slightly lighter panels/cards
            tertiary: '#383838', // Hover / active states
          },

          // Border + divider
          border: 'rgba(255,255,255,0.1)', // Subtle border (like YouTube's)

          // Text colors
          text: {
            primary: '#FFFFFF', // Pure white for main text
            secondary: '#AAAAAA', // Muted gray for metadata
            muted: '#717171', // Even softer, used for icons/disabled
          },

          // Accent (YouTube red + blue links)
          accent: {
            red: '#FF0000', // YouTube brand red
            link: '#3EA6FF', // Links / hover highlights
          },
        },
      },
    },
  },
};
