const path = require('path');

module.exports = {
  entry: {
    main: './src/video.js'
  },
  output: {
    path: path.resolve(__dirname, 'recursos/js'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        // .babelrc no está presente porque se utiliza las configuraciones en
        // este archivo
        options: {
          "presets": [
            [
              "@babel/preset-env",
              {
                "targets": {
                  "browsers": [
                    ">=1%",
                    "not op_mini all"
                  ]
                }
              }
            ]
          ],
          "plugins": [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-private-methods",
            "@babel/transform-runtime"
          ]
        }
      }
    }]
  }
};