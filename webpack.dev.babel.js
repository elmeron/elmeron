import webpack from 'webpack';
import merge from 'webpack-merge';
import commonConfig from './webpack.common.babel.js';

export default merge(commonConfig, {
  devServer: {
    port: 8081,
    host: 'localhost',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
