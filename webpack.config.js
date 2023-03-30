import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesSrc = path.resolve(__dirname, 'src/app/pages/')

const baseConfig = {
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
  }
}

/**
 * Compile folders under /src/app/pages/[pageName] where pageName a directory with index.ts and index.html
 * Pages are then made available as http://localhost:8080/[pageName].html
 * 
 * @param {WebpackConfiguration} config 
 * @param {string} pageName 
 * @param {string} pageTitle 
 * @returns 
 */
function createPageConfig(config, pageName, pageTitle = null) {
  return {
    ...config,
    entry: path.resolve(pagesSrc,`${pageName}/index.ts`),
    output: {
      path: path.resolve(__dirname, `dist/app/${pageName}`),
      filename: `${pageName}.bundle.js`,
      clean: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/app/pages/${pageName}/index.html`,
        title: pageTitle || pageName.toUpperCase(),
        filename: `index.html`,
      })
    ],
  }
}

export default [
  createPageConfig(baseConfig, "home", "homepage"),
  createPageConfig(baseConfig, "two", "second page")
]