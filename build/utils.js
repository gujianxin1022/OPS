'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const config = require('../config')
var glob = require('glob')
var PAGE_PATH = path.resolve(__dirname, '../src/pages')
let env;
if (process.argv[process.argv.length-1] === 'production') {
  env = 'production'
} else {
  env = 'development'
}

exports.htmlPlugin = function() {
  let conf = {
    // 模板来源
    template: path.resolve(__dirname, '../index.html'),
    // 文件名称
    filename: 'index.html',
    // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
    // chunks: ['manifest', 'app'],
    inject: true,
    env: env,
    minify: {
      removeComments: false
    }
  }
  return new HtmlWebpackPlugin(conf)
}

exports.resolve = function(dir) {
  return path.join(__dirname, '..', dir)
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

