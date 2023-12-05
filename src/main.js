import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as VueRouter from 'vue-router';

loadFonts()

const routes = [
  { path: '/', redirect: 'transcription-player-frontend/' },
  { path: '/transcription-player-frontend/', component: App }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
