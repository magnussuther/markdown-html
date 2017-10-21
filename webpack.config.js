module.exports = {
  entry: './index.js',
  output: {
    filename: 'dokument.js',
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
