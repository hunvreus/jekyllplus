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
import Picker from './components/Editor.vue'
import Login from './components/Login.vue'

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Picker
    },
    {
      name: 'login',
      path: '/login',
      component: Login
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
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Callback from GitHub Oauth
  if (to.query.access_token) {
    console.log(to.query);
    localStorage.setItem('token', to.query.access_token);
    var redirect = localStorage.getItem('redirect');
    if (redirect) {
      next({ path: redirect })
      localStorage.removeItem('redirect');
    }
  }
  else if (to.name != 'login' && localStorage.getItem('token') === null) {
    // If the user doesn't have a token, he needs to log in
    var token = localStorage.getItem('token');
    localStorage.setItem('redirect', to.fullPath);
    next({ path: '/login' })
  }
  next();
})

new Vue({
  el: '#app',
  router,
  data: {
    username: 'hunvreus',
    repo: 'marketing',
    ref: 'master',
    token: localStorage.getItem('token')
  },
  render: h => h(App)
})

Vue.filter('fromNow', function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
})
