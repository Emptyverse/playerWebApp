const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
  css: [
    'https://unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css'
  ],
  js: [
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.1.0/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js',
    'https://unpkg.com/element-ui@2.14.1/lib/index.js',
  ]
}
const externals = {
  // 属性名称 vue, 表示遇到 import xxx from 'vue' 这类引入 'vue'的，不去 node_modules 中找，而是去找全局变量 Vue（其他的为VueRouter、Vuex、axios、ELEMENT、echarts，注意全局变量是一个确定的值，不能修改为其他值，修改为其他大小写或者其他值会报错，若有异议可留言）
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT'
}
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        api: resolve('src/api'),
        base: resolve('src/base'),
        assets: resolve('src/assets'),
        common: resolve('src/common'),
        '@': resolve('src/components'),
        pages: resolve('src/pages')
      }
    }
  },
  chainWebpack: (config) => {
    // 分析打包大小
    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end();
    }
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    if (isProduction) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
      //视为一个外部库，而不将它打包进来
      config.externals(externals)
    }
  },
  productionSourceMap: !isProduction, //关闭生产环境下的SourceMap映射文件
  css: {
    sourceMap: !isProduction, // css sourceMap 配置
  },


  // devServer: {
  //   proxy: {
  //     '/login/cellphone': {
  //       target: 'http://localhost:3000/',
  //       changeOrigin: true
  //     },
  //     '/logout': {
  //       target: 'http://localhost:3000/',
  //       changeOrigin: true
  //     }
  //   }
  // }
}
