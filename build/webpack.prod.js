const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({}),
    new HtmlWebpackPlugin({
      title: 'aue',
    })
  ]
}
