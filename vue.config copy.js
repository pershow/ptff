const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'otf', 'ttf']
module.exports = defineConfig({
  productionSourceMap: false,// 设为false，既可以减少包大小，也可以加密源码
  transpileDependencies: true
})
