<template>
  <div>
    <div v-if='error' class='notification error'>{{ this.error }}</div>
    <ul class='list files'>
      <li v-for='file in filteredFiles'>
        <div class='directory' v-if='file.type === "dir"'>
          <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
            <path fill='#000000' d='M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z' />
          </svg>
          <div class='name'>{{ file.name }}</div>
        </div>
        <div class='file' v-if='file.type === "file"'>
          <img :src='file.download_url + "&sanitize=1"' alt='file.name'/>
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
        // We add the extension and type
        file.extension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        return (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'].indexOf(file.extension) > -1);
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    }
  },
  computed: {
    filteredFiles() {
      return this.files.filter((file) => {
        file.extension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        return (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'].indexOf(file.extension) > -1);
      });
    }
  }
}
</script>
