const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

const config = {
  entry: ['./src/WebMLPolyfill.js'],
  output: {
    filename: 'webml-polyfill.js',
    path: path.resolve(__dirname, 'dist')
  },
	module: {
		rules: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  resolve: {
		extensions: ['.js']
  },
  externals: {
    'fs': true
  },
  devtool: 'source-map',
  devServer: {
    // https: true,
    publicPath: '/dist/',
    disableHostCheck: true,
    host: '0.0.0.0',
  }
};

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  config.plugins = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, unused: false },
      output: { comments: false }
    }),
    new WriteFilePlugin(),
  ];
} else {
  config.mode = 'development';
  config.plugins = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development'),}),
    new WriteFilePlugin(),
  ];
}

module.exports = config