<template>
  <div id='editor' :class='status'>
    <form v-if='config && config.collections && config.collections[type]' v-on:submit.prevent='saveFile'>
      <!-- Header (save button, history, file name...) -->
      <header class='header'>
        <div class='container'>
          <div class='controls'>
            <!-- History -->
            <history :path='path'/>
            <!-- Save -->
            <button class='button primary save' :disabled='status != ""' :class='{ processing: status != "" }'>Save</button>
            <!-- More -->
            <span class='dropdown menu more'>
              <a class='icon'>
                <svg viewBox='0 0 24 24'>
                  <path d='M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z'/>
                </svg>
              </a>
              <div class='options'>
                <a>Duplicate</a>
                <hr/>
                <a>Delete</a>
              </div>
            </span>
          </div>
          <div class='meta'>
            <a class='type'>{{ type }}</a>
            <file-name v-if='model' v-model='path' :title='model.title' :type='type'/>
          </div>
        </div>
      </header>
      <!-- Body (fields for editing) -->
      <div class='body container narrow'>
        <field v-for='field in config.collections[type].fields' :key='field.name' :field='field' :model='model'></field>
      </div>
    </form>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue';
import FileName from './FileName.vue';
import History from './History.vue';
import Helper from '../helper.js';

export default {
  name: 'editor',
  components: { Field, History, FileName },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      path: this.$route.params.path,
      rename: this.$route.params.path,
      config: {},
      fileConfig: {},
      file: {},
      extension: '',
      type: '',
      sha: '',
      model: null,
      status: 'loading',
      modal: false,
    };
  },
  mounted() {
    this.getConfig();
    this.$notify({
      type: 'error',
      text: 'Couldn\'t retrieve the configuration file',
      duration: -1
    });
  },
  watch: {
    '$route'(to, from) {
      this.getFile();
    }
  },
  methods: {
    getConfig: function () {
      // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/.jekyllplus.yml';
      var params = {
        access_token: this.token,
        ref: this.ref
      };
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}, params: params}).then(response => {
        // Upon retrieval, we parse the YAML file
        this.config = YAML.safeLoad(response.body);
        this.config['__content'] = this.config.body;
        // We then retrieve the file we want to edit
        this.getType();
        this.getFile();
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the configuration file',
          duration: -1
        });
      });
    },
    getType: function () {
      if (this.$route.name == 'new') {
        this.type = this.$route.params.type;
      }
      else {
        // Define the type of file we're dealing with: page, collection, include...
        this.extension = this.path.substr(this.path.lastIndexOf('.') + 1).toLowerCase();
        // First, we check the extension is html or md
        if (['html', 'md'].indexOf(this.extension) > -1) {
          var segments = this.path.split('/');
          if (segments.length > 1 && segments[0].substring(0, 1) == '_') {
            // Path includes a subfolder that starts with a "_": collection
            this.type = segments[0].substring(1);
          }
          else {
            // Path doesn't include a subfolder, we're defaulting to a page
            this.type = 'pages';
          }
        }
        else {
          this.$notify({
            type: 'warn',
            text: 'The editor only supports HTML and Markdown: switching to default.',
            duration: -1
          });
          this.type = 'default';
        }
      }
    },
    getFile: function () {
      var fields = this.config.collections[this.type].fields;
      if (this.$route.name == 'edit') {
        // If we're editing a file, we retrieve it from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
        this.$http.get(url).then(response => {
          // Upon retrieval, we decode and parse the YAML front matter and body
          this.error = '';
          this.status = '';
          this.file = jsyaml.loadFront(Base64.decode(response.body.content), 'body');
          this.sha = response.body.sha;
          var content = this.file;
          // We create a model by merging the file and config
          this.model = Helper.createModel(fields, content);
        }, response => {
          this.$notify({
            type: 'error',
            text: 'Couldn\'t retrive the file (' + response.body.message + ')',
            duration: -1
          });
          // We send the user back to the repo
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref);
        });
      }
      else {
        // If it's a new file, we simply create a model with no content
        this.model = Helper.createModel(fields, {});
        this.status = '';
      }
    },
    saveFile: function (e) {
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
        message: 'Create '+ this.path + ' (via Jekyll+)',
        content: Base64.encode(content),
        branch: this.ref
      };
      if (this.$route.name == 'edit') {
        params.sha = this.sha; // For edit we need the sha
        params.message = 'Create '+ this.path + ' (via Jekyll+)';
      }

      this.status = 'saving';

      this.$http.put(url, params).then(response => {
        if (this.$route.name == 'new') {
          // Upon creating a file, we redirect the user to the edit form
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/edit/' + encodeURIComponent(this.path));
        }
        else {
          // Upon editing a file, we getch again the file to update the state
          this.getFile();
        }
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t save the file: ' + response.body.message,
          duration: -1
        });
      });
    }
  }
}
</script>
