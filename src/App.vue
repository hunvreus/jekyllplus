<template>
  <div id='app' :class='"route-" + $route.name' @loading>
    <router-view></router-view>
    <notifications position='bottom center'/>
  </div>
</template>

<script>
import User from './components/User.vue';

export default {
  name: 'app',
  components: { User },
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
