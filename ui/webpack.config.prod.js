var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DefinePlugin = webpack.DefinePlugin;

const API_URL = process.env.API_URL || 'http://localhost:5000/';

var plugins = [
  new HtmlWebpackPlugin({
    title: 'Traveler World Generator',
    template: 'index.html'
  }),
  new UglifyJsPlugin({ minimize: true }),
  new DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      API_URL: JSON.stringify(API_URL),
    },
  }),
];

console.log(process.env.API_URL);

var entry = [
  './src/index.js',
];

var output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
}

loaders = [
  {
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    include: path.join(__dirname, 'src'),
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
  entry: entry,
  plugins: plugins,
  output: output,
  module: {
    loaders: loaders
  },
  resolve: {
    root: path.join(__dirname, 'src'),
    extensions: ['', '.js']
  },
};

