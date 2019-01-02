
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    login: "./public/components/Login.js",
    ticketSetup: "./public/components/create/TicketSetup.js",
    prSetup: "./public/components/create/PRSetup.js",
    cmpSetup: "./public/components/create/CmpSetup.js",
    register: "./public/components/Register.js",
    dashboard: "./public/components/Dashboard.js",
    menu: "./public/components/Menu.js",
    profile: "./public/components/Profile.js",
    reactRouter: "./public/routers/ReactRouter.js"
  },
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
    path: __dirname + "/public/js",
    filename: "[name].min.js"
  },
  node: {
    fs: "empty"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};