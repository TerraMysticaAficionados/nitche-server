const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/app/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      title: 'nitcheServer',
      filename: './index.html',
    })
  ],
  devServer: {
    static: {

    },
    compress: true,
    port: 8080,
  },
  // resolve: {
  //   extensions: ['.ts'],
  // }
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }

}