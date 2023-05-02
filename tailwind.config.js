module.exports = {
    content: ['./src/**/*.{njk,md,html}'],
    plugins: [require('daisyui'), require('@tailwindcss/typography')],
    daisyui: {
      themes: ["dark"]
    }
  };
