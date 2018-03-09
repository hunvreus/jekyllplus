<template>
  <div id='editor' :class='status'>
    <form v-if='config && config.collections && config.collections.posts' v-on:submit.prevent='save'>
      <!-- Header (save button, history, file name...) -->
      <header class='header'>
        <div class='meta'>
          <!-- Filename -->
          <code class='file'><a :href='"https://github.com/" + username + "/" + repo + "/blob/" + this.ref + "/" + this.path' target='_blank'>{{ this.path }}</a></code>
          <a @click.prevent='modal = true'>
            <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
              <path fill='#000000' d='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z' />
            </svg>
          </a>
          <!-- Rename modal -->
          <div class='modal modal-rename' :class='{ active: modal }' @click.prevent.self='modal = false'>
            <div class='box smaller'>
              <header class='header'>
                <a class='close' @click.prevent='modal = false'>
                  <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
                    <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
                  </svg>
                </a>
                <h2>Rename your file</h2>
              </header>
              <section class='body'>
                <input type='text' v-model='path'/>
              </section>
              <footer class='footer'>
                <button class='button smaller' @click.prevent='modal = false'>Cancel</button>
                <button class='button primary smaller'>Rename</button>
              </footer>
            </div>
          </div>
          <!-- History -->
          <span class='dropdown menu'>
            <div class='updated' v-if='history[0]'>
              <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
                <path fill='#000000' d='M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z' />
              </svg>
              {{ history[0].commit.author.date | fromNow }}
            </div>
            <div class='options'>
              <history :commits='history'></history>
            </div>
          </span>
        </div>
      </header>
      <!-- Body (fields for editing) -->
      <div class='body'>
        <field v-for='field in config.collections.posts.fields' :key='field.name' :field='field' :model='model'></field>
      </div>
      <!-- Controls (Save button) -->
      <footer class='controls'>
        <button class='button primary save' :class='{ disabled: status != "" }'>Save</button><span class='dropdown menu'><button class='button primary more'><svg style='width:24px;height:24px' viewBox='0 0 24 24'>
            <path fill='#000000' d='M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z' />
          </svg></button>
          <div class='options'>
            <a>Duplicate</a>
            <hr/>
            <a>Delete</a>
          </div>
        </span>
      </footer>
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
      status: '',
      modal: false,
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
    },
    'model.title': function (to, from) {
      if (this.$route.name == 'new') {
        var title = this.model.title.trim();
        if (title == '') this.path = 'Untitled.md';
        else this.path = title.replace(/\s+/g, '-').toLowerCase() + '.md';
        // TODO: Add transliteration (e.g. https://www.npmjs.com/package/transliteration)
      }
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
          this.file = jsyaml.loadFront(Base64.decode(response.body.content), 'body');
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
