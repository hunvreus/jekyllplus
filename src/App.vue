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
export default {
  name: 'app',
  data () {
    return {
      username: this.$root.$data.username,
      repo: this.$root.$data.repo,
      token: this.$root.$data.token,
      error: ''
    }
  }
}
</script>

<style lang='scss'>
  @import '/sass/egg.scss';
</style>
