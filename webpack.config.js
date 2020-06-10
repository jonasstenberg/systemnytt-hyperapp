const { NormalModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const postcssImport = require('postcss-import')
const postcssInlineSVG = require('postcss-inline-svg')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  entry: {
    app: './index.js'
  },
  devServer: {
    contentBase: './dist',
    overlay: true,
    compress: true,
    hot: true,
    port: 1234,
    historyApiFallback: true
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
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                postcssImport(),
                postcssInlineSVG()
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
  plugins: [
    new NormalModuleReplacementPlugin(
      /.*HYPERAPP$/,
      resource => (resource.request = resource.request.replace(/HYPERAPP/, './hyperapp-devtools'))
    ),
    new StylelintPlugin({
      context: './styles',
      files: '**/*.css'
    }),
    new HtmlWebpackPlugin({
      template: './static/views/index.html'
    })
  ]
}
