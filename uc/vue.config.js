const target = "http://172.16.103.12";
const { name } = require('./package.json')

const production = process.env.NODE_ENV === 'production'
const publicPath = production ? 'https://172.16.103.12/uc' : 'https://localhost:7788/uc'
module.exports = {
  publicPath: "/uc",
  devServer: {
    port: '7788',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      "/nfs": {
        target: target,
      },
      "/organization-api": {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      "/user-api": {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      "/robot-ss-api": {
        // 侯杰本地
        // target: 'http://192.168.7.33:8082',
        // 周忠立本地
        // target: 'http://192.168.4.219:8080',
        // 裴清华本地
        // target: 'http://192.168.5.0:8080',
        // 测试环境
        // target: 'https://172.16.103.233',
        target: target,
        changeOrigin: true,
        secure: false,
      },
      '/material-server-api': {
        target: 'http://192.168.4.219:8080',
        // 开发
        // target: target,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    }
  },
  chainWebpack: config => {
    // 如果需要本地启动则需要去掉该配置，否则404
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
  },
};
