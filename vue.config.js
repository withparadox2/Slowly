const fs = require('fs')
const path = require('path')
const ZipPlugin = require('zip-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Slowly/'
    : '/',
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['SLOWLY_VERSION'] = readVersionContent()
      return args
    })
  },
  configureWebpack: config => {
    let plugins = []
    if (process.env.NODE_ENV === 'production') {
      plugins.push(new ZipPlugin({
        path: path.join(__dirname, './dist'),
        filename: 'dist.zip'
      }))
    }
    return {
      plugins
    }
  }
}

function readVersionContent() {
  const filePath = path.resolve(__dirname, './public/version.json')
  return fs.readFileSync(filePath).toString()
}