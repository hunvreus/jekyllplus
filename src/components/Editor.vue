<template>
  <div id="content" class='editor' :class="status">
    <!-- Header (save button, history, file name...) -->
    <header class="header">
      <div class="container">
        <div class="controls">
          <!-- History -->
          <history :path="path"/>
          <!-- Save -->
          <button class="button primary save" :disabled="status != ''" :class="{ processing: status != '' }"  @click.prevent="saveFile">Save</button>
          <!-- More -->
          <span class="dropdown menu more" v-if="$route.name == 'edit'" :class="{ active: more }">
            <a class="icon" @click.prevent="more = !more">
              <svg viewBox="0 0 24 24">
                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
              </svg>
            </a>
            <div class="options">
              <router-link :to="{ name: 'new', query: { duplicate: path } }" :class="'option'">Duplicate</router-link>
              <hr/>
              <delete-file :path="path" :sha="sha"/>
            </div>
          </span>
        </div>
        <a class="icon menu" @click.prevent="$emit('menu')">
          <svg viewBox="0 0 24 24">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </a>
        <div class="meta">
          <span class="type" v-if='collection'>{{ collection }}</span>
          <span class="type" v-else>Default</span>
          <file-name v-if="model" v-model="path" :title="model.title" :collection="collection"/>
        </div>
      </div>
    </header>
    <!-- Body (fields for editing) -->
    <div class="body container narrow">
      <form v-if="fields" v-on:submit.prevent="saveFile">
        <field v-for="field in fields" :key="field.name" :field="field" :model="model"></field>
      </form>
    </div>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue';
import FileName from './FileName.vue';
import DeleteFile from './DeleteFile.vue';
import History from './History.vue';
import Helper from '../helper.js';

export default {
  name: 'editor',
  components: { Field, History, FileName, DeleteFile },
  props: [ 'config', 'jekyllConfig' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      path: this.$route.params.path,
      rename: this.$route.params.path,
      file: {},
      fields: null,
      extension: '',
      collection: '',
      sha: '',
      model: null,
      status: 'loading',
      more: false
    };
  },
  mounted() {
    if (this.config) {
      this.setCollection();
      this.setModel();
    }
  },
  watch: {
    'config': function (to, from) {
      this.setCollection();
      this.setModel();
    },
    '$route': function (to, from) {
      this.path = '';
      this.setCollection();
      this.setModel();
    }
  },
  methods: {
    setConfig: function () {
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
        this.setCollection();
        this.setModel();
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the configuration file',
          duration: -1
        });
      });
    },
    setCollection: function () {
      if (this.$route.name == 'new') {
        if (this.$route.query.collection) {
          this.collection = this.$route.query.collection;
        }
        else if (this.$route.query.duplicate) {
          this.getCollection(this.$route.query.duplicate);
        }
      }
      else {
        this.getCollection(this.path);
      }
    },
    getCollection: function (path) {
      // Define the type of file we're dealing with: page, collection, include...
      this.extension = path.substr(path.lastIndexOf('.') + 1).toLowerCase();
      // First, we check the extension is html or md
      if (['html', 'md'].indexOf(this.extension) > -1) {
        var segments = path.split('/');
        if (segments.length > 1 && segments[0].substring(0, 1) == '_') {
          // Path includes a subfolder that starts with a "_": it's collection (maybe)
          this.collection = segments[0].substring(1);
        }
        else {
          // Path doesn't include a subfolder, we're defaulting to a page
          this.collection = 'pages';
        }
      }
      else {
        this.$notify({
          type: 'warn',
          text: 'The editor only supports HTML and Markdown: switching to default.'
        });
      }
    },
    setModel: function () {
      this.fields = (this.collection != '' && this.config.collections[this.collection]) ? this.config.collections[this.collection].fields : this.config.default.fields;
      var path = '';
      if (this.$route.name == 'edit') path = this.path;
      if (this.$route.name == 'new' && this.$route.query.duplicate) path = this.$route.query.duplicate;
      if (path != '') {
        // We retrieve the file we want to edit or duplicate from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + path + '?access_token=' + this.token;
        this.$http.get(url).then(response => {
          // Upon retrieval, we decode and parse the YAML front matter and body
          this.error = '';
          this.status = '';
          this.file = jsyaml.loadFront(Base64.decode(response.body.content), 'body');
          // Somehow the library returns the body with a new line at the beginning
          this.file.body = this.file.body.replace(/^\n/, '');
          // When editing, we need the sha
          if (this.$route.name == 'edit') this.sha = response.body.sha;
          var content = this.file;
          // We create a model by merging the file and config
          this.model = Helper.createModel(this.fields, content);
        }, response => {
          this.$notify({
            type: 'error',
            text: 'Couldn\'t retrieve the file (' + response.body.message + ')',
            duration: -1
          });
          // We send the user back to the repo
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/');
        });
      }
      else {
        // If it's a new file, we simply create a model with no content
        this.model = Helper.createModel(this.fields, {});
        this.status = '';
      }
    },
    deleteFile: function (e) {

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
        params.message = 'Update '+ this.path + ' (via Jekyll+)';
      }

      this.status = 'saving';

      this.$http.put(url, params).then(response => {
        this.$notify({
          type: 'success',
          text: 'File saved.'
        });
        if (this.$route.name == 'new') {
          // Upon creating a file, we redirect the user to the edit form
          this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/edit/' + encodeURIComponent(this.path));
        }
        else {
          // Upon editing a file, we getch again the file to update the state
          this.setModel();
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
