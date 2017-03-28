import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  entry: './client/src/client.jsx',

  output: {
    path: path.resolve(__dirname, 'webserver/build/static'),
    filename: 'client.js',
  },

  module: {
    rules: [
      {
        test: /\.js[x]$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './client/static/index.html',
    }),
  ],
};
