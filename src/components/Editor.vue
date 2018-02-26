<template>
  <div class='editor'>
    <form v-if='config && config.collections && config.collections.posts' v-on:submit.prevent='save'>
      <header class='header'>
        <div class='meta'>
          <code class='file'>{{ this.path }}</code>
          <div class='updated' v-if='history[0]'>Last updated {{ history[0].commit.author.date | fromNow }}</div>
        </div>
        <!-- <history :commits='history'></history> -->
        <button class='button primary' v-bind:class='{ disabled: status != "" }'>Save</button>
      </header>
      <div class='body'>
        <field v-for='field in config.collections.posts.fields' :key='field.name' :field='field' :file='file' :form='form'></field>
      </div>
    </form>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue'
import History from './History.vue'

export default {
  data: function() {
    return {
      username: this.$root.$data.username,
      repo: this.$root.$data.repo,
      token: this.$root.$data.token,
      path: '',
      config: {},
      file: {},
      history: {},
      error: '',
      sha: '',
      form: {},
      status: ''
    };
  },
  components: {
    Field,
    History
  },
  mounted() {
    this.getConfig();
    this.getFile();
    this.getHistory();
  },
  watch: {
    '$route'(to, from) {
      this.getFile();
    }
  },
  methods: {
    getFile: function () {
      this.path = this.$route.params.path;
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.file = jsyaml.loadFront(window.atob(response.body.content), 'body');
        this.sha = response.body.sha;
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    },
    getConfig: function () {
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/.jekyllplus.yml?access_token=' + this.token;
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}}).then(response => {
        this.error = '';
        this.config = YAML.safeLoad(response.body);
        this.config['__content'] = this.config.body;
      }, response => {
        this.error = 'Couldn\'t retrieve the configuration file (.jekyllplus.yml): ' + response.body.message;
      });
    },
    getHistory: function () {
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/commits?path=' + this.path + '&access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.history = response.body;
      }, response => {
        this.error = 'Couldn\'t retrieve the commit history: ' + response.body.message;
      });
    },
    save: function (e) {
      // Prepare the file content
      var body = this.file.body;
      var yaml = this.file;
      delete yaml.body;
      yaml = YAML.safeDump(yaml);
      var content = '---\n';
          content += yaml;
          content += '---\n';
          content += body;

      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
      var params = {
        path: this.path,
        message: 'File edited through Jekyll+',
        content: window.btoa(content),
        sha: this.sha
      };
      this.status = 'saving';
      this.$http.put(url, params).then(response => {
        console.log();
        this.getFile();
        this.getHistory();
        this.status = '';
      }, response => {
        this.error = 'Couldn\'t save the file: ' + response.body.message;
      });
    }
  }
}
</script>
