'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // assetsPublicPath: 'https://testcdn.lingo-ace.com/ops/',
    proxyTable: {
      // '/opsapi': {
      //   // target: 'http://10.10.4.224',//（请求环境值改这儿）
      //   target: 'http://10.10.4.201',//（请求环境值改这儿）
      //   // target:'https://test202.teacher.lingo-ace.com',//test接口
      //   changeOrigin: true
      // },
      // '/homeworkapi': {
      //   target: 'https://d-exer.lingoace.com',//（请求环境值改这儿）
      //   changeOrigin: true
      // },
      '/media.pplingo.com': {
        target: 'https://s3.cn-north-1.amazonaws.com.cn',
        changeOrigin: true
      },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 9301, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: 'https://cdn.lingo-ace.com/ops/',
    assetsPublicPathCf: 'https://cdn.lingo-ace.com/ops-cf/',
    assetsPublicPathSim: 'https://sim.cdn.lingo-ace.com/ops/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
