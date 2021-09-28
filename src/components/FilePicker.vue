<template>
  <div class="file-picker" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
    <div class="input">
      <img src="">
      <input readonly type="text" v-model="value"/>
      <div class="icon clear" v-show="isClearVisible" @click.prevent="$emit('input', '')">
        <svg viewBox="0 0 24 24">
          <path d="M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10c5.53,0,10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8
          s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
          <polygon points="15.59,7 12,10.59 8.41,7 7,8.41 10.59,12 7,15.59 8.41,17 12,13.41 15.59,17 17,15.59 13.41,12 17,8.41"/>
        </svg>
      </div>
      <a class="button" @click.prevent="show = true">Select file</a>
    </div>
    <div class="modal" :class="{ active: show }" @click.self.prevent="show = false">
      <div class="box larger">
        <header class="header">
          <a class="close" @click.prevent="show = false">
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </a>
          <h2>Choose a file</h2>
        </header>
        <section class="body" :class="status">
          <!-- Breadcrumb -->
          <header v-if="breadcrumb" class="breadcrumb">
            <a @click.prevent="changeDir('', 'dir')">
              <svg viewBox="0 0 24 24">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
            </a>
            <span v-for="link in breadcrumb">
              /
              <a @click.prevent="changeDir(link.path)" v-if="link.last != true">{{ link.label }}</a>
              <span v-else>{{ link.label }}</span>
            </span>
          </header>
          <!-- Files -->
          <ul v-if="filteredFiles.length">
            <li v-for="file in filteredFiles" :key="file.name" :class="{ active: file.path == selected, image: file.image }" :title="file.name">
              <!-- Directories -->
              <div class="directory" v-if="file.type === 'dir'" @click="changeDir(file.path)">
                <div class="thumbnail">
                  <svg viewBox="0 0 24 24">
                    <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                  </svg>
                </div>
                <div class="name">{{ file.name }}</div>
              </div>
              <!-- Images -->
              <div class="file" :class="{ image: file.image }" v-if="file.type === 'file'" @click="select(file)">
                <div v-if="file.image" class="thumbnail" :style="{ backgroundImage: 'url(' + file.download_url + '&sanitize=1)' }"></div>
                <div v-else class="thumbnail">
                  <svg viewBox="0 0 24 24">
                    <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
                  </svg>
                </div>
                <div class="name">{{ file.name }}</div>
              </div>
            </li>
          </ul>
          <div class="empty centered" v-else>
            No file to select.
          </div>
        </section>
        <!-- Footer -->
        <footer class="footer">
          <upload :path="current" :class="'primary smaller'" @uploaded="handleUploadDone"/>
          <a class="button smaller" @click.prevent="show = false">Cancel</a>
          <a class="button primary smaller" :disabled="!isSelectActive" @click.prevent="$emit('input', (selected != '' ? '/' + selected : '')); show = false">Select</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Upload from './Upload.vue';

export default {
  name: 'file-picker',
  components: { Upload },
  props: [ 'value', 'path', 'type', 'config' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      current: '',
      files: [],
      preview: null,
      selected: (this.value != '') ? this.value.replace(/^\/+/g, '') : {},
      show: false,
      status: '',
      isSelectActive: false,
      isClearVisible: false
    };
  },
  mounted() {
    if (this.value && this.value != '') {
      this.current = this.getParent(this.value.replace(/^\/+/g, ''));
    }
    else if (this.path) {
      this.current = this.path;
    }
    else if (this.config.folders) {
      if (this.config.folders.file) this.current = this.config.folders.file;
      if (this.type && this.type != '' && this.config.folders[this.type]) this.current = this.config.folders[this.type];
    }
    this.setFiles();
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.show = false;
    });
  },
  watch: {
    'current': function (to, from) {
      this.setFiles();
    },
    'selected': function (to, from) {
      this.isSelectActive = this.selected
    }
  },
  methods: {
    getParent: function(path) {
      // Get the parent directory from a path
      path = path.split('/');
      path.pop();
      return (path.join('/'));
    },
    setFiles: function () {
      // Retrieve the files for the current path from GitHub
      this.status = 'loading';
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.current;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {params: params}).then(response => {
        this.files = response.body;
        // We add to each file the extension and test whether it's an image
        for (var i = 0, length = this.files.length; i < length; i++) {
          this.files[i].extension = this.files[i].name.substr(this.files[i].name.lastIndexOf('.') + 1).toLowerCase();
          if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'].indexOf(this.files[i].extension) > -1) this.files[i].image = true;
          this.status = '';
        }
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the files (' + response.body.message + ')',
          duration: -1
        });
        this.status = '';
      });
    },
    changeDir: function (path) {
      this.selected = '';
      this.current = path;
    },
    select: function (file) {
      this.selected = (this.selected == file.path) ? '' : file.path;
    },
    handleMouseover: function () {
      if(this.value.length) {
        this.isClearVisible = true;
      }
    },
    handleMouseleave: function () {
      this.isClearVisible = false;
    },
    handleUploadDone: function (file, path) {
      this.$emit('input', path);
      this.show = false;
    }
  },
  computed: {
    breadcrumb: function () {
      var segments = this.current.split('/');
      if (segments.length == 1 && segments[0] == '') segments = [];
      var path = '';
      var breadcrumb = [];
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
    },
    filteredFiles: function () {
      if (this.type == 'image') return this.files.filter(file => file.type == 'dir' || file.image);
      else return this.files;
    }
  },
}
</script>
