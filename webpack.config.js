
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: {login: "./public/js/layout/Login.js",
          register: "./public/js/layout/Register.js",
          dashboard: "./public/js/layout/Dashboard.js",
          menu: "./public/js/layout/Menu.js"},
  module:{
    loaders: [
      {
        test: /\.js?$/,    
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['react', 'es2016'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy', "transform-async-to-generator"]
        }
      }
    ]
  },
  output: {
    path: __dirname + "/public/js/layout",
    filename: "[name].min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};