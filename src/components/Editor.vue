<template>
  <div id='editor' :class='status'>
    <form v-if='config && config.collections && config.collections[type]' v-on:submit.prevent='save'>
      <!-- Header (save button, history, file name...) -->
      <header class='header'>
        <div class='controls'>
          <!-- History -->
          <span class='dropdown menu history' v-if='history[0]'>
            <a class='icon' :title='updated'>
              <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
                <path d='M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z' />
              </svg>
            </a>
            <div class='options'>
              <div v-for='commit in history'>
                <a :href='commit.html_url' target='_blank'>
                  <img :src='commit.author.avatar_url'>
                  {{ commit.commit.author.name }}
                  {{ commit.commit.author.date | fromNow }}
                </a>
              </div>
            </div>
          </span>
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
          <!-- Filename -->
          <a class='filename' @click.prevent='modal = true'>{{ this.path }}</a>
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
        </div>
      </header>
      <!-- Body (fields for editing) -->
      <div class='body'>
        <field v-for='field in config.collections[type].fields' :key='field.name' :field='field' :model='model'></field>
      </div>
    </form>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue';
import Helper from '../helper.js';

export default {
  name: 'editor',
  components: { Field },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      path: this.$route.params.path,
      config: {},
      fileConfig: {},
      file: {},
      extension: '',
      type: '',
      sha: '',
      history: {},
      model: null,
      error: '',
      status: 'loading',
      modal: false,
    };
  },
  computed: {
    updated: function () {
      // return "";
      return "Updated " + this.$options.filters.fromNow(this.history[0].commit.author.date);
    }
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
        this.getType();
        this.getFile();
      }, response => {
        this.error = 'Couldn\'t retrieve the configuration file (.jekyllplus.yml): ' + response.body.message;
      });
    },
    getType: function () {
      // Define the type of file we're dealing with: page, collection, include...
      this.extension = this.path.substr(this.path.lastIndexOf('.') + 1).toLowerCase();
      // First, we check the extension is html or md
      if (['html', 'md'].indexOf(this.extension) > -1) {
        var segments = this.path.split('/');
        if (segments.length == 1) {
          // Path doesn't include a subfolder, we're dealing with a page
          this.type = 'page';
        }
        else if (segments[0].substring(0, 1) == '_') {
          // Path starts with a "_"
          this.type = segments[0].substring(1);
        }
        else {
          this.type = 'default';
        }
      }
      else {
        // ERROR: It's not a supported file
      }
      console.log(this.type);
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
          // We also get the commit history
          this.getHistory();
        }, response => {
          this.error = 'Error: ' + response.body.message;
        });
      }
      else {
        // If it's a new file, we simply create a model with no content
        this.model = Helper.createModel(fields, {});
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
          // Upon editing a file, we getch again the file to update the state
          this.getFile();
        }
      }, response => {
        this.error = 'Couldn\'t save the file: ' + response.body.message;
      });
    }
  }
}
</script>
