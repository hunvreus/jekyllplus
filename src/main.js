import moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import App from './App.vue'
import Field from './components/Field.vue'
import List from './components/List.vue'
import Editor from './components/Editor.vue'

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
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
      path: '/edit/:path',
      component: Editor
    },
    {
      path: '*',
      redirect: '/list'
    }
  ]
})

new Vue({
  el: '#app',
  router,
  data: {
    username: 'hunvreus',
    repo: 'marketing',
    token: ''
  },
  render: h => h(App)
})

Vue.filter('fromNow', function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
})
