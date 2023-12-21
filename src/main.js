import { createApp } from 'vue'
import App from './App.vue'
import LoginCallback from './components/LoginCallback.vue';
import SignupNotAllowed from './components/SignupNotAllowed.vue';
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as VueRouter from 'vue-router';
import MyPlayer from './components/MyPlayer.vue'
import MyMain from './components/MyMain.vue'
import { createPinia } from 'pinia'

loadFonts()

const routes = [
  { path: '/', redirect: 'main' },
  {
    path: '/main', component: MyMain,
    children: [
      {
        path: '',
        redirect: { name: 'player' }
      },
      {
        path: 'player',
        name: 'player',
        component: MyPlayer
      }
    ]
  },
  { path: '/login-callback/', component: LoginCallback },
  { path: '/signup-not-allowed-callback/', component: SignupNotAllowed }
]

const router = VueRouter.createRouter({
  history: process.env.VUE_APP_MODE === "demonstration" ? VueRouter.createWebHashHistory('/transcription-player-frontend/') : VueRouter.createWebHistory(),
  routes,
});

const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#app')
