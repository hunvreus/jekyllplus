<template>
  <div id='app' :class='"route-" + $route.name'>
    <router-view></router-view>
    <notifications position='bottom center'/>
  </div>
</template>

<script>
import User from './components/User.vue';
import Notification from './components/Notification.vue';

export default {
  name: 'app',
  components: {
    User
  },
  data () {
    return {
      token: this.$root.$data.token,
      error: '',
      user: {}
    }
  }
}
</script>

<style lang='scss'>
  @import '/sass/egg.scss';
</style>
