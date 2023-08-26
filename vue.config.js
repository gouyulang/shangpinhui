const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 有了map文件就可以像未加密的代码一样，准确的知道是哪一样那一列有错。所以该文件如果项目不需要可以去掉。
  productionSourceMap:false,
  transpileDependencies: true,
  // eslint校验工具关闭
  lintOnSave: false,
  //配置代理跨域
  devServer: {
    proxy: {
      "/api": {      // 匹配所有以 '/api'开头的请求路径
        target: "http://gmall-h5-api.atguigu.cn",    // 代理目标的基础路径
      },
    },
  },
})
