<template>
  <div id="content" class='files' :class="status">
    <!-- Header (save button, history, file name...) -->
    <header class="header">
      <div class="container">
        <div class="controls">
          <!-- Upload -->
          <upload :path="path" @uploaded="setFiles"/>
          <!-- Create -->
          <button class="button primary new" @click.prevent="modal = true">Create</button>
          <div class="modal" :class="{ active: modal }" @click.self.prevent="modal = false">
            <div class="box">
              <header class="header">
                <a class="close" @click.prevent="modal = false">
                  <svg viewBox="0 0 24 24">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </a>
                <h2>Create</h2>
              </header>
              <section class="body">
                <ul v-if="config && config.collections">
                  <li v-for="(item, key, index) in config.collections">
                    <router-link :to="{ name: 'new', query: { collection: key }}">
                    {{ item.name }}
                    </router-link>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        <a class="icon menu" @click="$emit('menu')">
          <svg viewBox="0 0 24 24">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </a>
        <div class="meta">
          <span class=""></span>
        </div>
      </div>
    </header>
    <div class="body container narrow">
      <!-- Breadcrumb -->
      <header class="breadcrumb">
        <router-link v-if="path != ''" :to="{ name: 'files' }">
          <svg viewBox="0 0 24 24">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
          </svg>
        </router-link>
        <span v-else>
          <svg viewBox="0 0 24 24">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
          </svg>
        </span>
        <span v-if="breadcrumb.length" v-for="link in breadcrumb">
          /
          <router-link v-if="link.last != true" :to="{ name: 'files', query: { path: link.path }}">{{ link.label }}</router-link>
          <span v-else>{{ link.label }}</span>
        </span>
      </header>
      <!-- Files -->
      <ul class="list" v-if="filteredFiles.length">
        <li v-for="file in filteredFiles" :key="file.path">
          <router-link class="directory" v-if="file.type === 'dir'" :to="{ name: 'files', query: { path: file.path }}">
            <svg viewBox="0 0 24 24">
              <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
            </svg>
            {{ file.name }}
          </router-link>
          <router-link class="file" v-else :to="{ name: 'edit', params: { path: file.path }}">
            <svg viewBox="0 0 24 24">
              <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,4H6V20H11L18,20V11H11V4Z" />
            </svg>
            {{ file.name }}
          </router-link>
        </li>
      </ul>
      <div class="empty centered" v-else>
        No valid file to select (HTML or Markdown).
      </div>
    </div>
  </div>
</template>

<script>
import Upload from './Upload.vue';

export default {
  components: { Upload },
  props: [ 'config', 'jekyllConfig' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      path:  this.$route.query.path ? this.$route.query.path : '',
      token: this.$root.$data.token,
      modal: false,
      files: [],
      status: ''
    };
  },
  mounted() {
    this.setFiles();
  },
  watch: {
    '$route': function (to, from) {
      this.ref = this.$route.params.ref; // Switch the branch
      this.path = this.$route.query.path ? this.$route.query.path : ''; // Change in directory
      this.setFiles();
    }
  },
  methods: {
    setFiles: function () {
      this.status = 'loading';
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, { params: params }).then(response => {
        this.status = '';
        this.files = response.body;
      }, response => {
        this.status = '';
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the commit history (' + response.body.message + ')',
          duration: -1
        });
      });
    }
  },
  computed: {
    filteredFiles: function () {
      var exclude = (this.jekyllConfig && this.jekyllConfig.exclude) ? this.jekyllConfig.exclude : [];
      return this.files
        .filter(function (file) {
          // Define the type of file we're dealing with: page, collection, include...
          var extension = file.path.substr(file.path.lastIndexOf('.') + 1).toLowerCase();
          return (file.type == 'dir') || ['html', 'md'].indexOf(extension) > -1;
          // return (obj.type == 'dir' && obj.path.substring(0, 1) != '_') || ['html', 'md'].indexOf(extension) > -1;
        })
        .filter(function (file) {
          // Filter out excluded files from the Jekyll config
          return exclude.indexOf(file.path) < 0;
          // return (obj.type == 'dir' && obj.path.substring(0, 1) != '_') || ['html', 'md'].indexOf(extension) > -1;
        })
        .sort(function(a, b) {
          return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : ((a.path > b.path) ? 1 : ((b.path > a.path) ? -1 : 0)));
        });
    },
    breadcrumb: function () {
      var breadcrumb = [];
      var path = '';
      var segments = this.path.split('/');
      if (segments.length == 1 && segments[0] == '') segments = [];
      for (var i = 0, length = segments.length; i < length; i++) {
        path += segments[i];
        breadcrumb.push({
          label: segments[i],
          path: path,
          last: i == length - 1
        });
        path += '/';
      }
      return breadcrumb;
    }
  }
}
</script>
