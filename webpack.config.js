const path = require('path');
const webpack = require('webpack');

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
        test: /\.js$/, 
        include: /node_modules/, 
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

