module.exports = {
  configureWebpack: {
    devtool: "source-map"
  },
  devServer: {
    open: true,
    host: "172.20.10.2",
    port: "8081",
    https: false,
    hotOnly: false
    // proxy: {
    //   "/lottery": {
    //     target: "http://221.181.129.89:20115/lottery", //服务器地址
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/lottory": ""
    //     }
    //   }
    // }
  }
};
