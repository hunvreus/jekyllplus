<template>
  <div id="content" class='editor' :class="status">
    <!-- Header (save button, history, file name...) -->
    <header class="header">
      <div class="container">
        <div class="controls">
          <!-- History -->
          <history :path="path" :sha="sha"/>
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
              <router-link :to="{ name: 'new', query: { duplicate: path } }" target="_blank" :class="'option'">Duplicate</router-link>
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
          <file-name v-if="model && jekyllConfig" v-model="path" :title="model.title" :collection="collection" :jekyllConfig="jekyllConfig"/>
          <small>
            <span v-if="editor == 'collection'" class="collection">{{ config.collections[collection].name }} collection ·</span>
            <a :href="'https://github.com/' + username + '/' + repo + '/blob/' + ref + '/' + path" target="_blank">See on GitHub</a>
          </small>
        </div>
      </div>
    </header>
    <!-- Body (fields for editing) -->
    <div class="body container narrow">
      <div v-if="editor == 'collection'">
        <div v-if="model && multilingual && jekyllConfig" class="field full-width">
          <label>Language & Translations</label>
          <language v-model="model.lang" :jekyllConfig="jekyllConfig" :collection="collection" :path="path" :sha="sha"/>
        </div>
        <field v-if="fields" v-for="field in fields" :key="field.name" :field="field" :model="model" :config="config"></field>
      </div>
      <div v-else class="field full-width">
        <textarea v-if="model" v-model="model.content" rows="20"/>
      </div>
    </div>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import Field from './Field.vue';
import FileName from './FileName.vue';
import Language from './Language.vue';
import DeleteFile from './DeleteFile.vue';
import History from './History.vue';
import Helper from '../helper.js';

export default {
  name: 'editor',
  components: { Field, History, FileName, DeleteFile, Language },
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
      editor: 'default',
      multilingual: false,
      fields: null,
      extension: '',
      collection: null,
      sha: '',
      model: null,
      status: 'loading',
      more: false
    };
  },
  mounted() {
    if (this.config) {
      this.setEditor();
      this.setModel();
    }
  },
  watch: {
    'config': function (to, from) {
      this.setEditor();
      this.setModel();
    },
    '$route': function (to, from) {
      this.setEditor();
      this.setModel();
    }
  },
  methods: {
    setEditor: function () {
      // First we try and figure out if we're dealing with a collection
      if (this.$route.name == 'new') {
        if (this.$route.query.collection) {
          this.collection = this.$route.query.collection;
        }
        else if (this.$route.query.duplicate) {
          this.getCollection(this.$route.query.duplicate);
        }
        else if (this.$route.query.translate) {
          this.getCollection(this.$route.query.translate);
        }
      }
      else {
        this.getCollection(this.path);
      }
      // If the collection has a configuration in .jekyllplus.yml, we switch the editor to "collection"
      if (this.collection != '' && this.config.collections[this.collection]) {
        this.editor = 'collection';
      }
    },
    getCollection: function (path) {
      // Define the type of file we're dealing with: page, collection, include...
      this.extension = path.substr(path.lastIndexOf('.') + 1).toLowerCase();
      // First, we check the extension is html or md
      if (['html', 'md'].indexOf(this.extension) > -1) {
        // We assume it's a collection
        // TODO: check if it really is a collection (rely on the Jekyll conf)
        this.type = 'collection';
        var segments = path.split('/');
        if (segments.length > 1 && segments[0].substring(0, 1) == '_') {
          // Path includes a subfolder that starts with a "_": it maybe be a collection
          this.collection = segments[0].substring(1);
        }
        else {
          // Path doesn't include a subfolder starting with "_", it's a page
          this.collection = 'pages';
        }
      }
    },
    setModel: function () {
      var path = '';
      if (this.$route.name == 'edit') path = this.path;
      if (this.$route.name == 'new' && this.$route.query.duplicate) path = this.$route.query.duplicate;
      if (this.$route.name == 'new' && this.$route.query.translate) path = this.$route.query.translate;
      if (this.editor == 'collection') {
        this.fields = this.config.collections[this.collection].fields;
        // We also check if this collection is multilingual
        this.multilingual = (this.config.collections[this.collection].multilingual) ? true : false;
      }
      if (path != '') {
        // We retrieve the file we want to edit, duplicate or translate from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + path;
        var params = {
          access_token: this.token,
          ref: this.ref,
          timestamp: Date.now()
        };

        this.$http.get(url, { params: params }).then(response => {
          this.status = '';
          // When editing, we need the sha
          if (this.$route.name == 'edit') this.sha = response.body.sha;
          // Upon retrieval, we prepare the editor
          if (this.editor == 'collection') {
            // If it's a collection, we decode and parse the YAML front matter and body
            this.file = jsyaml.loadFront(Base64.decode(response.body.content), 'body');
            // Somehow the library returns the body with a new line at the beginning
            this.file.body = this.file.body.replace(/^\n/, '');
            // We create a model by merging the file and config
            this.model = Helper.createModel(this.fields, this.file);
            // If multilingual, we add language to the model
            if (this.multilingual) this.model.lang = this.file.lang;
          }
          else {
            this.model = {
              content: Base64.decode(response.body.content)
            }
          }
          // If we're translating a file, we override the language
          if (this.$route.query.lang && this.$route.query.lang != '') {
            this.model.lang = this.$route.query.lang;
          }
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
        if (this.editor == 'collection') {
          // If it's a new file, we simply create a model with no content
          this.model = Helper.createModel(this.fields, {});
          this.status = '';
        }
        else {
          this.model = {
            content: ''
          }
        }
      }
    },
    saveFile: function (e) {
      if (this.editor == 'collection') {
        if (this.multilingual && this.model.lang != this.jekyllConfig.lang[0]) {
          // If the file is multilingual, and if it's not the default language,
          // we need to double `lang` with `categories`
          this.model.categories = this.model.lang;
        }
        // Prepare the file content from the model
        var body = this.model.body;
        var yaml = JSON.parse(JSON.stringify(this.model));
        delete yaml.body;
        Helper.sanitizeObject(yaml); // Removing empty/null attributes from the object
        yaml = YAML.safeDump(yaml);
        var content = '---\n';
            content += yaml;
            content += '---\n';
            content += body;
      }
      else {
        var content = this.model.content;
      }

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
          // Upon editing a file, we fetch again the file to update the state
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
