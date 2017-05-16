import BabiliPlugin from 'babili-webpack-plugin';
import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common.babel.js';

export default merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new BabiliPlugin(),
  ],
});
