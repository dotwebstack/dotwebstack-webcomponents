const path = require('path');
const webpack = require('webpack');

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
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(env),
    }),
  ],
};
