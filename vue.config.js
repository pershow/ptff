const { defineConfig } = require('@vue/cli-service');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'otf', 'ttf','html'];
const isProdOrTest = process.env.NODE_ENV !== 'development'
module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  assetsDir: './',
  productionSourceMap: false, // 设为false，既可以减少包大小，也可以加密源码
  transpileDependencies: true,
  chainWebpack(config) {
    config.plugins.delete('prefetch'); //默认开启prefetch(预先加载模块)，提前获取用户未来可能会访问的内容 在首屏会把这十几个路由文件，都一口气下载了 所以我们要关闭这个功能模块
    if (isProdOrTest) {
      // 对超过10kb的文件gzip压缩
      config.plugin('compressionPlugin').use(
        new CompressionWebpackPlugin({
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // 匹配文件名
          threshold: 10240,
        }),
      );
    }
  },
});
