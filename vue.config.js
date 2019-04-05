const fs = require('fs')
const path = require('path')

module.exports = {
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Slowly/'
    : '/',
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['SLOWLY_VERSION'] = readVersionContent() 
      return args
    })
  }
}

function readVersionContent() {
  const filePath = path.resolve(__dirname, './public/version.json')
  return fs.readFileSync(filePath).toString()
}