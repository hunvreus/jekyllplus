import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import App from './App.vue'
import List from './components/List.vue'
import Editor from './components/Editor.vue'

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      redirect: '/list',
      component: List
    },
    {
      path: '/list',
      component: List
    },
    {
      name: 'list',
      path: '/list/:path',
      component: List
    },
    {
      name: 'editor',
      path: '/edit',
      component: Editor
    }
  ]
})

new Vue({
  el: '#app',
  router,
  data: {
    username: 'Wiredcraft',
    repo: 'marketing',
    token: 'f4e3b230c471cbe5440be1ff4038dd2c8e9d903b'
  },
  render: h => h(App)
})
