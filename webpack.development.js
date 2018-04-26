const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.config');

const srcDir = path.resolve(__dirname, 'src');

module.exports = merge(config, {
  entry: {
    index: path.join(srcDir, 'examples', 'index.tsx'),
  },
  devServer: {
    open: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'examples', 'index.html'),
    }),
  ],
});
