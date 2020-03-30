const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env) {
  return {
    mode: env && env.production ? 'production' : 'development',
    entry: './src/client.js',
    output: {
      filename: 'client.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/assets'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.s?css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HTMLWebpackPlugin({
        template: './src/index.html'
      })
    ]
  };
}
