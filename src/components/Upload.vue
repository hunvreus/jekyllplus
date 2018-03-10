<template>
  <label class='button primary smaller'>
    Upload
    <input type='file' @change='upload'/>
  </label>
</template>

<script>
export default {
  name: 'upload',
  props: [ 'path' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      current: this.path,
      error: '',
      status: ''
    };
  },
  methods: {
    upload: function (e) {
      var files = e.target.files || e.dataTransfer.files;
      console.log(files[0]);
      // this.someData = event.target.files[0]
      return;
      // Prepare the file content from the model
      var body = this.model.body;
      var yaml = this.model;
      delete yaml.body;
      yaml = YAML.safeDump(yaml);
      var content = '---\n';
          content += yaml;
          content += '---\n';
          content += body;

      // We edit/create the file on GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
      var params = {
        path: this.path,
        message: 'Update '+ this.path + ' (via Jekyll+)',
        content: Base64.encode(content),
        branch: this.ref
      };
      if (this.$route.name == 'edit') params.sha = this.sha; // For edit we need the sha

      this.status = 'saving';

      this.$http.put(url, params).then(response => {
        if (this.$route.name == 'new') {
          // Upon creating a file, we redirect the user to the edit form
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/edit/' + encodeURIComponent(this.path));
        }
        else {
          // Upon editing a file, we getch again the file and history to update the state
          this.getFile();
          this.getHistory();
          this.status = '';
        }
      }, response => {
        this.error = 'Couldn\'t save the file: ' + response.body.message;
      });
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
