// craco.config.js
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    module: {
      // …
      rules: [
        // …
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: '@mdx-js/loader',
              /** @type {import('@mdx-js/loader').Options} */
              options: {}
            }
          ]
        }
      ]
    }
  }