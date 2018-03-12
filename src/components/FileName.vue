<template>
  <div class='file-name'>
    <a @click.prevent='modal = true'>{{ this.path }}</a>
    <!-- Rename modal -->
    <div class='modal' :class='{ active: modal }' @click.self.prevent='modal = false'>
      <div class='box smaller' :class='{ loading: status != "" }'>
        <header class='header'>
          <a class='close' @click.prevent='modal = false'>
            <svg viewBox='0 0 24 24'>
              <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
            </svg>
          </a>
          <h2>Rename your file</h2>
        </header>
        <section class='body'>
          <div class='field full-width'>
            <input type='text' v-model='newPath'/>
          </div>
        </section>
        <footer class='footer'>
          <button class='button smaller' @click.prevent='modal = false'>Cancel</button>
          <button class='button primary smaller' @click.prevent='rename' :disabled='status != ""' :class='{ processing: status != "" }'>Rename</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'file-name',
  props: [ 'value', 'title', 'type' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      path: this.value,
      newPath: '',
      lock: this.$route.name != 'new',
      modal: false,
      status: ''
    };
  },
  watch: {
    'title': function (to, from) {
      this.createPath();
    },
    'path': function (to, from) {
      this.$emit('input', this.path);
    }
  },
  mounted() {
    this.createPath();
    this.newPath = this.path;
  },
  methods: {
    createPath: function () {
      if (!this.lock) {
        var time = moment().format('YYYY-MM-DD');
        var title = this.title.trim();
        var name = '';
        if (title == '') name = time + '-Untitled.md';
        else name = time + '-' + title.replace(/\s+/g, '-').toLowerCase() + '.md';
        // TODO: Add transliteration (e.g. https://www.npmjs.com/package/transliteration)
        this.path = '_' + this.type + '/' + name;
      }
    },
    rename: function () {
      // If the user changed the path manually, we prevent automatically setting it up
      this.status = 'renaming';
      this.lock = true;
      if (this.$route.name == 'edit') {
        var path = this.path;
        // Git magic inspired by https://medium.com/@obodley/renaming-a-file-using-the-git-api-fed1e6f04188)
        // 1. Get the current branch
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/branches/' + this.ref + '?access_token=' + this.token;
        this.$http.get(url).then(response => {
          var sha = response.body.commit.sha;
          // 2. Get the current tree
          var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/git/trees/' + sha + '?recursive=1&access_token=' + this.token;
          this.$http.get(url).then(response => {
            // Get the file we want to rename
            // var file = response.body.tree.filter(function(obj) {
            //   return obj.path == path;
            // });
            console.log(response.body.tree);
            console.log(path);
            var newTree = response.body.tree
              // .filter(item => item.type !== 'tree')
              .map(i => {
                if (i.path === path) {
                  return {
                    path: this.newPath,
                    mode: i.mode,
                    type: i.type,
                    sha: i.sha
                  }
                }
                return {
                  path: i.path,
                  mode: i.mode,
                  type: i.type,
                  sha: i.sha
                }
              })
console.log(newTree);
            // 3. Create a new tree\
            var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/git/trees?access_token=' + this.token;
            var input = {
              base_tree: response.body.sha,
              tree: newTree
            };
            this.$http.post(url, input).then(response => {
              // 4. Create a commit for the new tree
              var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/git/commits?access_token=' + this.token;
              var input = {
                message: 'Rename ' + path + ' to ' + this.newPath,
                tree: response.body.sha,
                parents: [sha]
              };
              this.$http.post(url, input).then(response => {
                // 5. Point your branch at the new commit
                var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/git/refs/heads/' + this.ref + '?access_token=' + this.token;
                var input = {
                  sha: response.body.sha
                };
                this.$http.patch(url, input).then(response => {
                  this.path = this.newPath;
                  this.status = '';
                  this.modal = false;
                }, response => {
                  // TODO: Throw error
                });
              }, response => {
                // TODO: Throw error
              });
            }, response => {
              // TODO: Throw error
            });
          }, response => {
            // TODO: Throw error
          });
        }, response => {
          // TODO: Throw error
        });
      }
      else if (this.$route.name == 'new') {
        this.path = this.newPath;
        this.status = '';
        this.modal = false;
      }
    }
  }
}
</script>
