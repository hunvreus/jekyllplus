<template>
  <div>
    <table class='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='file in files'>
          <td>
            <div class='directory' v-if='file.type === "dir"'>
              <router-link :to='{ name: "list", params: { path: file.path }}'>{{ file.name }}</router-link>
            </div>
            <div class='file' v-if='file.type === "file"'>
              {{ file.name }}
            </div>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      username: this.$root.$data.username,
      repo: this.$root.$data.repo,
      token: this.$root.$data.token,
      path: (this.$route.params.path) ? '/' + this.$route.params.path : '/',
      files: []
    };
  },
  mounted() {
    console.log('Mounted');
    this.files = this.getFiles();
  },
  methods: {
    getFiles: function() {
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents' + this.path + '?access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.files = response.body;
      }, response => {
        // error callback
      });
    }
  }
}
</script>

<style>
table {
  width: 100%;
}
</style>
