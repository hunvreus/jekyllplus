import moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Notifications from 'vue-notification'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Notifications)

import App from './App.vue'
import Home from './components/Home.vue'
import Repo from './components/Repo.vue'
import Field from './components/Field.vue'
import Files from './components/Files.vue'
import Editor from './components/Editor.vue'
import Login from './components/Login.vue'

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'repo',
      path: '/:username/:repo/:ref',
      component: Repo,
      children: [
        {
          name: 'files',
          path: 'files',
          component: Files
        },
        {
          name: 'edit',
          path: 'edit/:path',
          component: Editor
        },
        {
          name: 'new',
          path: 'new',
          component: Editor
        },
        {
          path: '*',
          redirect: 'files'
        }
      ]
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
    localStorage.setItem('token', to.query.access_token);
    var redirect = localStorage.getItem('redirect') ? localStorage.getItem('redirect') : '/' ;
    next({ path: redirect });
    localStorage.removeItem('redirect');
  }
  // If the user doesn't have a token, we redirect him to log in and save the
  // initial path for later redirection
  if (to.name != 'login' && localStorage.getItem('token') === null) {
    var token = localStorage.getItem('token');
    localStorage.setItem('redirect', to.fullPath);
    next({ path: '/login' })
  }
  // If the user is logged in, we prevent him from going to the login page
  if (to.name == 'login' && localStorage.getItem('token') !== null) {
    next({ path: '/' })
  }
  next();
})

new Vue({
  el: '#app',
  router,
  data: function() {
    return {
      get token() {
        return localStorage.getItem('token') || null;
      },
      set token(value) {
        localStorage.setItem('token', value);
      }
    };
  },
  render: h => h(App)
})

Vue.filter('fromNow', function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
})
