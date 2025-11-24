'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const chalk = require('chalk')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const utils = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.config')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ora = require('ora')
const spinner = ora('building for production...')
spinner.start()

let env
if (process.argv[process.argv.length - 1] === 'production') {
  if (process.argv[process.argv.length - 2] === 'sim') {
    console.log('###########仿真环境##############')
    env = require('../config/sim.env')
  } else {
    console.log('###########生产环境##############')
    env = require('../config/prod.env')
  }
} else {
  const testEnv = process.argv[process.argv.length - 2]
  env = require('../config/dev.env')[testEnv]
  if (process.argv[process.argv.length - 2] === 'stage') {
    console.log('###########预上线环境##############')
  } else {
    console.log('###########测试环境##############')
  }
}
process.env.NODE_ENV = 'production'

const prodWebpackConfig = merge(baseWebpackConfig, {
  output: {
    path: utils.resolve('dist'),
    filename: 'static/js/[name].[contenthash].js',
    publicPath:
      env.NODE_ENV === '"production"'
        ? process.argv[process.argv.length - 2] === 'cf'
          ? config.build.assetsPublicPathCf
          : config.build.assetsPublicPath
        : env.NODE_ENV === '"simulation"'
        ? config.build.assetsPublicPathSim
        : config.dev.assetsPublicPath
  },
  mode: 'production',
  devtool: false,
  optimization: {
    splitChunks: {
      chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
      maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: '-', // 命名分隔符
      cacheGroups: {
        // 缓存组，会继承和覆盖splitChunks的配置
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true // 默认使用已有的模块
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
          priority: -10
        },
        moment: {
          name: 'moment', // 单独将 moment 拆包
          priority: 15, // 权重需大于其它缓存组
          test: /[\/]node_modules[\/]moment[\/]/
        },
        echarts: {
          name: 'echarts',
          priority: 15,
          test: /[\/]node_modules[\/]echarts[\/]/
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  module: {
    rules: [
      {
        test: /package\.json$/,
        loader: 'package-json-cleanup-loader',
        options: {
          only: ['version', 'name', 'otherParam']
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            transformToRequire: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          'css-loader',
          "css-unicode-loader",
          'postcss-loader',
          'css-unicode-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          'css-loader',
          'postcss-loader',
          "css-unicode-loader",
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 10000,
              name: 'static/img/[name].[contenthash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/fonts/[name].[contenthash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      // chunkFilename: 'static/css/[name].[contenthash].css',
      ignoreOrder: true
    }),
    // 服务端没有配置gzip
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|woff|woff2|svg|ttf|eot)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new CleanWebpackPlugin()
  ].concat(utils.htmlPlugin())
})

webpack(prodWebpackConfig, (err, status) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(
    status.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  )
  if (status.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(
    chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
        "  Opening index.html over file:// won't work.\n"
    )
  )
})
