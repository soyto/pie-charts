/* global require */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let developmentConfig = function(env, argv) {
  return {
    'mode': argv.mode,
    'entry': path.resolve('src', 'app.js'),
    'output': {
      'filename': 'app.js',
      'path': path.resolve('www')
    },
    'devtool': 'inline-source-map',
    'devServer': {
      'contentBase': path.resolve('www'),
      'open': false
    },
    'plugins': [
      new CleanWebpackPlugin(['www']),
      new HtmlWebpackPlugin({
        'template': path.resolve('src', 'www', 'index.html'),
        'minify': true,
        'inject': true,
        'filename': 'index.html'
      }),
      new MiniCssExtractPlugin({
        'filename': argv.mode !== 'production' ? '[name].css' : '[name].[hash].css',
        'chunkFilename': argv.mode !== 'production' ? '[id].css' : '[id].[hash].css',
      })
    ],
    'module': {
      'rules': [
        {
          'test': /\.m?js$/,
          'exclude': /(node_modules|bower_components)/,
          'use': {
            'loader': 'babel-loader',
            'options': {
              'presets': ['@babel/preset-env']
            }
          }
        },
        {
          'test': /\.scss$/,
          'use': [
            argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };
};

module.exports = [developmentConfig];