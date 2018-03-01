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
      path: '/:username/:repo/:ref/list',
      component: List
    },
    {
      name: 'list',
      path: '/:username/:repo/:ref/list/:path',
      component: List
    },
    {
      name: 'edit',
      path: '/:username/:repo/:ref/edit/:path',
      component: Editor
    },
    {
      name: 'new',
      path: '/:username/:repo/:ref/new/:type',
      component: Editor
    },
    // {
    //   path: '*',
    //   redirect: '/:username/:repo/:ref/list'
    // }
  ]
})

new Vue({
  el: '#app',
  router,
  data: {
    username: 'hunvreus',
    repo: 'marketing',
    ref: 'master',
    // token: null
    token: ''
  },
  render: h => h(App)
})

Vue.filter('fromNow', function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
})
