<template>
  <div id='app'>
    <section class='section'>
      <div class='container'>

        <div v-if='error' class='notification error'>{{ this.error }}</div>
        <router-view></router-view>
        <a href='https://micro-github-mgwngwjrab.now.sh/login?redirect_uri=http://localhost:8080/hunvreus/marketing/master/edit/_posts%2F2018-01-29-tony-blog.md'>Login</a>
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
