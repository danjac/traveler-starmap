var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./build/dev');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(config.serverPort, 'localhost', function(err){
  if (err) {
    console.log(err);
  }
});
