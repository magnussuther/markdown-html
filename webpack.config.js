module.exports = {
  entry: './index.js',
  output: {
    filename: 'build/build.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.woff2$/,
        use: ['file-loader'],
      },
    ],
  },
};
