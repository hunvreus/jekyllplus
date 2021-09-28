<template>
  <label class="button" :class="{ processing: status == 'uploading', disabled: status == 'uploading' }">
    Upload
    <input type="file" @change="picked"/>
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
      file: {},
      content: '',
      status: ''
    };
  },
  methods: {
    picked: function (event) {
      this.status = 'uploading';
      var input = event.target;
      // Check if we have a file
      if (input.files && input.files[0]) {
        this.file = input.files[0];
        // Read the image and converts it to base64 format
        var reader = new FileReader();
        reader.onload = (e) => {
          // We strip out the info at the beginning of the file (mime type + encoding)
          this.content = e.target.result.replace(/^(.+,)/, '');
          // Once we have the base64 content we upload it to GitHub
          this.upload();
        }
        reader.readAsDataURL(input.files[0]);
      }
      return;
    },
    upload: function () {
      // TODO:
      // 1. Support multifiles
      // 2. Support overriding of file when already existing (or should we rename?)
      // We create the file on GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '/' + this.file.name + '?access_token=' + this.token;
      var params = {
        path: this.path,
        message: 'Uploaded '+ this.file.name + ' (via Jekyll+)',
        content: this.content,
        branch: this.ref
      };

      this.$http.put(url, params).then(response => {
        this.status = '';
        this.$emit('uploaded', this.file, response.body.content.path);
      }, response => {
        this.status = '';
        this.$notify({
          type: 'error',
          text: 'Failed to upload the file (' + response.body.message + ')',
          duration: -1
        });
      });
    }
  }
}
</script>

<style scoped>
label.button {
  float: left;
  font-weight: normal;
}
.button input {
  display: none;
}
</style>
