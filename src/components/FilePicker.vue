<template>
  <div class='filepicker' :class='status'>
    <header v-if='breadcrumb' class='breadcrumb'>
      <a @click.prevent='select("", "dir")'>
        <svg viewBox='0 0 24 24'>
          <path d='M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z'/>
        </svg>
      </a>
      <span v-for='link in breadcrumb'>
        /
        <a @click.prevent='select(link.path, "dir")' v-if='link.last != true'>{{ link.label }}</a>
        <span v-else>{{ link.label }}</span>
      </span>
    </header>
    <div v-if='error' class='notification error'>{{ this.error }}</div>
    <ul>
      <li v-for='file in files' v-if='file.type === "dir" || (file.type === "file" && file.image == true)' :class='{ active: file.path == selected, image: file.image }' :title='file.name'>
        <!-- Directories -->
        <div class='directory' v-if='file.type === "dir"' @click='select(file.path, file.type)'>
          <div class='thumbnail'>
            <svg viewBox='0 0 24 24'>
              <path d='M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z' />
            </svg>
          </div>
          <div class='name'>{{ file.name }}</div>
        </div>
        <!-- Images -->
        <div class='file' v-if='file.type === "file" && type == "image" && file.image == true' @click='select(file.path, file.type)'>
          <div class='thumbnail' :style='{ backgroundImage: "url("+ file.download_url + "&sanitize=1)" }'></div>
          <div class='name'>{{ file.name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'file-picker',
  props: {
    path: {
      default: 'images'
    },
    type: {
      default: null
    }
  },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      current: this.path,
      files: [],
      error: '',
      selected: '',
      status: ''
    };
  },
  mounted() {
    this.getFiles();
  },
  watch: {
    'current': function (to, from) {
      this.getFiles();
    },
    'selected': function (to, from) {
      this.$emit('selected', '/' + this.selected);
    }
  },
  methods: {
    getFiles: function () {
      // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
      this.status = 'loading';
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.current;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {params: params}).then(response => {
        this.error = '';
        this.files = response.body;
        // We add to each file the extension and test whether it's an image
        for (var i = 0, length = this.files.length; i < length; i++) {
          this.files[i].extension = this.files[i].name.substr(this.files[i].name.lastIndexOf('.') + 1).toLowerCase();
          if (['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'].indexOf(this.files[i].extension) > -1) this.files[i].image = true;
          this.status = '';
        }
      }, response => {
        this.error = 'Error: ' + response.body.message;
        this.status = '';
      });
    },
    select: function (path, type) {
      if (type == 'dir') {
        this.selected = '';
        this.current = path;
      }
      else {
        this.selected = (this.selected == path) ? this.selected = '' : this.selected = path;
      }
    }
  },
  computed: {
    breadcrumb: function () {
      var segments = this.current.split('/');
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
    }
  }
}
</script>
