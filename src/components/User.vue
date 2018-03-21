<template>
  <div class="user" v-if="user">
    <a :href="user.html_url" class="tooltip profile" target="_blank">
      <img class="avatar" :src="user.avatar_url"/>
      {{ user.login }}
      <span class="text">Profile on GitHub</span>
    </a>
    <a class="icon tooltip logout" v-on:click="logout">
      <svg viewBox="0 0 24 24">
        <path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13" />
      </svg>
      <span class="text">Logout</span>
    </a>
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
        if (response.status == 401) this.logout(); // 401 is "Unauthorized access" (either the token expired or is invalid)
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
