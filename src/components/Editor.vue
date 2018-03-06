<template>
  <div id='editor' :class='status'>
    <form v-if='config && config.collections && config.collections.posts' v-on:submit.prevent='save'>
      <!-- Header (save button, history, file name...) -->
      <header class='header'>
        <div class='meta'>
          <div class='dropdown menu'>
            <code class='file'><a :href='"https://github.com/" + username + "/" + repo + "/blob/" + this.ref + "/" + this.path' target='_blank'>{{ this.path }}</a></code>
            <div class='updated' v-if='history[0]'>Last updated {{ history[0].commit.author.date | fromNow }}</div>
            <div class='options'>
              <history :commits='history'></history>
            </div>
          </div>
        </div>
        <button class='button primary' :class='{ disabled: status != "" }'>Save</button>
        <div class='dropdown menu'>
          <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
            <path fill='#000000' d='M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z' />
          </svg>
          <div class='options'>
            <a>Duplicate</a>
            <hr/>
            <a>Remove</a>
          </div>
        </div>
      </header>
      <!-- Body (fields for editing) -->
      <div class='body'>
        <header class='meta'>
          <label>Path</label>
          <input type='text' v-model='path'/>
        </header>
        <field v-for='field in config.collections.posts.fields' :key='field.name' :field='field' :model='model'></field>
      </div>
    </form>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue';
import History from './History.vue';
import moment from 'moment';

export default {
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      path: this.$route.params.path,
      token: this.$root.$data.token,
      config: {},
      file: {},
      sha: '',
      history: {},
      model: null,
      error: '',
      status: ''
    };
  },
  components: {
    Field,
    History
  },
  mounted() {
    this.getConfig();
  },
  watch: {
    '$route'(to, from) {
      this.getFile();
    }
  },
  methods: {
    createModel: function (fields, content, model = {}) {
      // Traverse the fields and merge it with content into the model
      for (var i = 0, length = fields.length; i < length; i++) {
        if (fields[i].name) {
          var name = fields[i].name;
          if (fields[i].type == 'object') {
            // For objects, we use a recursion
            content[name] = content[name] ? content[name] : {};
            model[name] = {};
            model[name] = this.createModel(fields[i].fields, content[name], model[name]);
          }
          else {
            if (content.hasOwnProperty(name)) {
              // Content exists for this field, we assign it to the model
              model[name] = content[name];
            }
            else {
              // Content doesn't exists for this field, we define a default value
              var value;
              if (fields[i].default) {
                // Default is pre-defined
                value = field[i].default;
              }
              else {
                // No pre-defined default, we rely on the type of field
                switch(fields[i].type) {
                  case 'select':
                    value = [''];
                    break;
                  case 'toggle':
                  case 'checkbox':
                    value = false;
                    break;
                  case 'date':
                    value = moment().format('YYYY-MM-DD');
                    break;
                  default:
                    value = '';
                }
              }
              // We assign the value to the model, wrapped in an array if the field is
              // "multiple"
              model[name] = (fields[i].multiple) ? [ value ] : value;
            }
          }
        }
      }
      return model;
    },
    getConfig: function () {
      // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/.jekyllplus.yml';
      var params = {
        access_token: this.token,
        ref: this.ref
      };
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}, params: params}).then(response => {
        // Upon retrieval, we parse the YAML file
        this.error = '';
        this.config = YAML.safeLoad(response.body);
        this.config['__content'] = this.config.body;
        // We then retrieve the file we want to edit
        this.getFile();
      }, response => {
        this.error = 'Couldn\'t retrieve the configuration file (.jekyllplus.yml): ' + response.body.message;
      });
    },
    getFile: function () {
      var fields = this.config.collections.posts.fields;
      if (this.$route.name == 'edit') {
        // If we're editing a file, we retrieve it from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
        this.$http.get(url).then(response => {
          // Upon retrieval, we decode and parse the YAML front matter and body
          this.error = '';
          this.file = jsyaml.loadFront(window.atob(response.body.content), 'body');
          this.sha = response.body.sha;
          var content = this.file;
          // We create a model by merging the file and config
          this.model = this.createModel(fields, content);
          // We also get the commit history
          this.getHistory();
        }, response => {
          this.error = 'Error: ' + response.body.message;
        });
      }
      else {
        // If it's a new file, we simply create a model with no content
        this.model = this.createModel(fields, {});
      }
    },
    getHistory: function () {
      // Retrieve the commit history of the file we edit from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/commits?path=' + this.path + '&access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.history = response.body;
      }, response => {
        this.error = 'Couldn\'t retrieve the commit history: ' + response.body.message;
      });
    },
    save: function (e) {
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
        content: window.btoa(content),
        branch: this.ref
      };
      if (this.$route.name == 'edit') params.sha = this.sha; // For edit we need the sha

      this.status = 'saving';

      this.$http.put(url, params).then(response => {
        if (this.$route.name == 'new') {
          // Upon creating the file, we redirect the user to the edit form
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/edit/' + encodeURIComponent(this.path));
        }
        else {
          // Upon editing the file, we getch again the file and history to update the state
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
