<template>
  <div>
    <div v-if='error' class='notification is-danger'>{{ this.error }}</div>
    <table class='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>
            <router-link class='button is-small' v-if='path !== "/"' :to='{ name: "list", params: { path: parent }}'>Go Back</router-link>
          </th>
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
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      path: this.$route.params.path,
      token: this.$root.$data.token,
      files: [],
      error: ''
    };
  },
  mounted() {
    this.getFiles();
  },
  watch: {
    '$route'(to, from) {
      this.getFiles();
    }
  },
  methods: {
    getFiles: function () {
      this.path = (this.$route.params.path) ? '/' + this.$route.params.path : '/';
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents' + this.path + '?access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.files = response.body;
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    }
  },
  computed: {
    parent: function () {
      if (this.path === '/' || this.path === '') {
        return '';
      }
      else {
        var parent = this.path.split('/').slice(0, -1).join('/');
        return parent;
      }
    }
  }
}
</script>

<style>
table {
  width: 100%;
}
</style>
