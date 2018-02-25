<template>
  <div class='editor'>
    <form v-if='config && config.collections && config.collections.posts' class='editor'>
      <header class='header'>
        <!-- <history :commits='history'></history> -->
        <button class='button primary small'>Save</button>
      </header>
      <div class='body'>
        <field v-for='field in config.collections.posts.fields' :key='field.name' :field='field' :file='file'></field>
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
      error: ''
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
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}}).then(response => {
        this.error = '';
        this.file = jsyaml.loadFront(response.body);
        this.file.body = this.file.__content;
      }, response => {
        this.error = 'Error: ' + response.body.message;
      });
    },
    getConfig: function () {
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/.jekyllplus.yml?access_token=' + this.token;
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}}).then(response => {
        this.error = '';
        this.config = YAML.safeLoad(response.body);
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
    }
  }
}
</script>
