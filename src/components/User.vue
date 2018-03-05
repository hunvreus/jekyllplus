<template>
  <div id='user' v-if='user'>
    <div class='dropdown menu'>
      <a>
        <img class='avatar' :src='user.avatar_url'/>
      </a>
      <div class='options'>
        <a :href='user.html_url' target='_blank'>Profile on GitHub</a>
        <hr/>
        <a v-on:click='logout'>Logout</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user',
  data: function() {
    return {
      user: {}
    };
  },
  mounted() {
    if (this.$root.$data.token) this.getUser();
  },
  methods: {
    getUser: function () {
      // Retrieve user's details from GitHub
      var url = 'https://api.github.com/user?access_token=' + this.$root.$data.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.user = response.body;
        this.$root.$data.user = this.user;
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    },
    logout: function () {
      localStorage.removeItem('token');
      this.$root.$data.token = null;
      this.$root.$data.user = null;
      this.user = null;
      this.$router.push('/login');
    }
  }
}
</script>
