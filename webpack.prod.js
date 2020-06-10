const { NormalModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const postcssImport = require('postcss-import')
const path = require('path')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist')
  },
  entry: {
    app: [
      path.join(__dirname, './index.js')
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    overlay: true,
    port: 1234
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'standard-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                postcssImport()
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          normalizeUrl: false
        }
      })
    ]
  },
  plugins: [
    new CleanPlugin(path.join(__dirname, 'dist')),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    new NormalModuleReplacementPlugin(
      /.*HYPERAPP$/,
      resource => (resource.request = resource.request.replace(/HYPERAPP/, 'hyperapp'))
    ),
    new StylelintPlugin({
      context: './styles',
      files: '**/*.css'
    }),
    new HtmlWebpackPlugin({
      template: './static/views/index.html',
      hash: true
    })
  ]
}
