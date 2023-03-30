const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pagesSrc = path.resolve(__dirname, 'src/app/pages/')

const tsWebpackConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
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
            configFile: "tsconfig.app.json"
          }
        }],
        exclude: [/node_modules/],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    // modules: ['node_modules'],
  }
}

const homePageConfig = {
  ...tsWebpackConfig,
  entry: path.resolve(pagesSrc,'home/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    filename: "home.bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/pages/home/index.html',
      title: 'HOME',
      filename: 'home.html',
    })
  ],
}

const twoPageConfig = {
  ...tsWebpackConfig,
  entry: path.resolve(pagesSrc,'two/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    filename: "two.bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/pages/two/index.html',
      title: 'TWO',
      filename: 'two.html',
    })
  ],
}

const serverConfig = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/server/index.ts'),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/server')
  },
  target:"node",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.server.json"
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

module.exports = [
  homePageConfig,
  twoPageConfig,
  // serverConfig
]