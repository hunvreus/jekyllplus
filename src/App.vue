<template>
  <div id='app'>
    <section class='section'>
      <div class='container'>
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
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.css');
</style>
