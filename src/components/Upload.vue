<template>
  <label class='button primary smaller'>
    Upload
    <input type='file'/>
  </label>
</template>

<script>
export default {
  name: 'upload',
  props: {
    path: {
      default: 'images'
    }
  },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      current: this.path,
      files: [],
      error: '',
      selected: '',
      status: ''
    };
  },
  methods: {
    getFiles: function () {
      // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
      this.status = 'loading';
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.current;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {params: params}).then(response => {
        this.error = '';
        this.files = response.body;
        // We add to each file the extension and test whether it's an image
        for (var i = 0, length = this.files.length; i < length; i++) {
          this.files[i].extension = this.files[i].name.substr(this.files[i].name.lastIndexOf('.') + 1).toLowerCase();
          if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'].indexOf(this.files[i].extension) > -1) this.files[i].image = true;
          this.status = '';
        }
      }, response => {
        this.error = 'Error: ' + response.body.message;
        this.status = '';
      });
    },
    select: function (path, type) {
      if (type == 'dir') {
        this.selected = '';
        this.current = path;
      }
      else {
        this.selected = (this.selected == path) ? this.selected = '' : this.selected = path;
      }
    }
  }
}
</script>

<style>
label.button {
  float: left;
  font-weight: normal;
}
.button input {
  display: none;
}
</style>
