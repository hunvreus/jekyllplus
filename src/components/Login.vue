<template>
  <div>
    <a :href='"https://micro-github-mgwngwjrab.now.sh/login?scope=repo"'>Login</a>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      redirect_uri: this.$route.query.redirect_uri ? 'http://localhost:8080/' + this.$route.query.redirect_uri : '',
    };
  }
}
</script>
