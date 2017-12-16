const path = require('path')

module.exports = {
  entry: {
    'vue-drag-select': './src/DragSelect.vue'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
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
        loader: 'vue-loader',
        options: {
          postcss: [require('autoprefixer')]
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
