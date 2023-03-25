const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/app/index.ts'),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      title: 'nitcheServer',
      filename: './index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.json"
          }
        }],
        exclude: [/node_modules/],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
}