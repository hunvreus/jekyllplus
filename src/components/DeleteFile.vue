<template>
  <div class="delete-file">
    <a @click.prevent="modal = true" class="option danger">Delete</a>
    <!-- Delete modal -->
    <div class="modal" :class="{ active: modal }" @click.self.prevent="closeModal">
      <div class="box smaller" :class="{ loading: status != '' }">
        <header class="header">
          <a class="close" @click.prevent="closeModal">
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </a>
          <h2>Do you really want to delete this file?</h2>
        </header>
        <section class="body">
          <p class="smaller">This action cannot be undone. This will permanently delete <code>{{ path }}</code> from your repository.</p>
          <p class="smaller">Please type in the full path of the file to confirm.</p>
          <div class="field full-width">
            <input type="text" v-model="input"/>
          </div>
        </section>
        <footer class="footer">
          <button class="button smaller" @click.prevent="closeModal" :disabled="status != ''">Cancel</button>
          <button class="button smaller danger" @click.prevent="deleteFile" :disabled="status != '' || path != input" :class="{ processing: status != '' }">Delete</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'delete-file',
  props: [ 'path', 'sha' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      input: '',
      modal: false,
      status: ''
    };
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.closeModal();
    });
  },
  methods: {
    closeModal: function () {
      if (this.status == '') {
        this.modal = false;
      }
    },
    deleteFile: function () {
      if (this.path == this.input) {
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + this.path + '?access_token=' + this.token;
        var params = {
          message: 'Delete '+ this.path + ' (via Jekyll+)',
          branch: this.ref,
          sha: this.sha
        };
        this.status = 'deleting';
        this.$http.delete(url, { params: params }).then(response => {
          this.$notify({
            type: 'success',
            text: 'File deleted.'
          });
          this.$emit('delete', this.path);
          if (this.$route.name == 'edit') {
            // The user was editing the file, we send him to the root of the repo
            this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/files');
          }
        }, response => {
          this.$notify({
            type: 'error',
            text: 'Couldn\'t delete the file: ' + response.body.message,
            duration: -1
          });
        });
      }
      else {
        this.$notify({
          type: 'warning',
          text: 'The path doesn\'t match.'
        });
      }
    }
  }
}
</script>
