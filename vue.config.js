const { defineConfig } = require('@vue/cli-service');
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    devtool: 'source-map'
  },

  chainWebpack: (config) => {
    // eslint-disable-next-line no-empty
    if(process.env.NODE_ENV == 'production') {} else {
      config.devtool('source-map');
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
