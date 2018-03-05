<template>
  <div>
    <div v-if='error' class='notification error'>{{ this.error }}</div>
    <ul class='list files'>
      <li v-for='file in files'>
        <div class='directory' v-if='file.type === "dir"'>

          <div class='name'>{{ file.name }}</div>
        </div>
        <div class='file' v-if='file.type === "file"'>
          <img :src='file.download_url + "&sanitize=1"' alt='file.name'/>
          {{ file }}
          <div class='name'>{{ file.name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'file-picker',
  props: {
    path: {
      default: 'images/clients'
    },
    type: {
      default: null
    }
  },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      files: [],
      error: ''
    };
  },
  mounted() {
    this.getFiles();
  },
  methods: {
    getFiles: function () {
      // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {params: params}).then(response => {
        this.error = '';
        this.files = response.body;
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    }
  },
  // computed: {
  //   parent: function () {
  //     if (this.path === '/' || this.path === '') {
  //       return '';
  //     }
  //     else {
  //       var parent = this.path.split('/').slice(0, -1).join('/');
  //       return parent;
  //     }
  //   }
  // }
}
</script>
