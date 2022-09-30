const { defineConfig } = require("@vue/cli-service");
const env = process.env.NODE_ENV;

module.exports = defineConfig({
  publicPath: "./",
  lintOnSave: env === "development" ? true : false,
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    host: "127.0.0.1",
    open: true,
    proxy: {
      "/api": {
        target: "https://iot.wumei.live",
        changeOrigin: true,
        ws: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
