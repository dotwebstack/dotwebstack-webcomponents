const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const env = process.env.NODE_ENV || 'development';
const srcDir = path.resolve(__dirname, 'src');
const buildDir = path.resolve(__dirname, 'build');

module.exports = {
  mode: env,
  entry: {
    index: path.join(srcDir, 'index.ts'),
  },
  output: {
    path: buildDir,
    filename: '[name].js',
    library: pkg.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        // query: {
        //   compilerOptions: {
        //     declaration: env === 'production',
        //   },
        // },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'examples', 'index.html'),
    }),
  ],
};

