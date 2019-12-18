module.exports = {
  configureWebpack: {
    devtool: "source-map"
  },
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: "8081",
    https: false, //是否使用https协议
    hotOnly: false, //是否开启热更新
    proxy: {
      "/lottery": {
        target: "http://221.181.129.89:20115/lottery", //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          "^/lottory": ""
        }
      }
    }
  }
};
