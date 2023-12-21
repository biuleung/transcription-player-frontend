const { defineConfig } = require('@vue/cli-service');
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? '/transcription-player-frontend/' : '/',
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      fallback: {
        timers: require.resolve('timers-browserify'),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        stream: require.resolve("stream-browserify")
      },
    },
  },

  chainWebpack: (config) => {
    // eslint-disable-next-line no-empty
    if (process.env.NODE_ENV == 'production') { } else {
      config.devtool('source-map');
    }
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})
