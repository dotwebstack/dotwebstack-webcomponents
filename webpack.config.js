const path = require('path');
const webpack = require('webpack');

const pkg = require('./package.json');
const env = process.env.NODE_ENV || 'development';
const srcDir = path.resolve(__dirname, 'src');
const buildDir = path.resolve(__dirname, 'build');

module.exports = {
  mode: env,
  optimization: {
    minimize: false,
  },
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
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        query: {
          compilerOptions: {
            declaration: env === 'production',
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  }
};
