var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

var serverPort = 3000;

var plugins = [
  new HtmlWebpackPlugin({
    title: 'Traveler World Generator',
    template: 'index.html'
  }),
  new HotModuleReplacementPlugin()
];

var entry = [
  'webpack-dev-server/client?http://localhost:' + serverPort,
  'webpack/hot/only-dev-server',
  './src/index.js',
];

var output = {
  path: path.join(__dirname, '../dist'),
  filename: 'bundle.js',
  publicPath: 'http://localhost:' + serverPort + '/'
}

loaders = [
  {
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    include: path.join(__dirname, '../src'),
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
  },
  {
    test: /\.(png|woff|woff2|eot|ttf|svg)/,
    loader: 'url-loader?limit=200000',
  },
];

module.exports = {
  devtool: 'eval',
  entry: entry,
  plugins: plugins,
  output: output,
  module: {
    loaders: loaders
  },
  resolve: {
    root: path.join(__dirname, '../src'),
    extensions: ['', '.js']
  },
  serverPort: serverPort,
};

