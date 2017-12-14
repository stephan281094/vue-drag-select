const path = require('path')
// eslint-disable-next-line  no-unused-vars
const webpack = require('webpack')

module.exports = {
  entry: {
    'vue-drag-select': './src/DragSelect.vue'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
    library: 'DragSelect',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
