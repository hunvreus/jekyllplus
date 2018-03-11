<template>
  <div id='app' :class='"route-" + $route.name'>
    <section class='section'>
      <div class='container'>
        <div v-if='error' class='notification error'>{{ this.error }}</div>
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
import User from './components/User.vue';

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
