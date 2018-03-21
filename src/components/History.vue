<template>
  <span class="history" v-if="history[0]">
    <a class="icon tooltip-bottom" @click.prevent="modal = true">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />
      </svg>
      <span class="text">{{ updated }}</span>
    </a>
    <!-- Modal (commit log) -->
    <div class="modal" :class="{ active: modal }" @click.self.prevent="modal = false">
      <div class="box smaller">
        <header class="header">
          <a class="close" @click.prevent="modal = false">
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </a>
          <h2>History</h2>
        </header>
        <section class="body">
          <a v-for="commit in history" :href="commit.html_url" :title="commit.commit.message" target="_blank">
            <div class="avatar">
              <img v-if="commit.author" :src="commit.author.avatar_url"/>
            </div>
            <strong>{{ commit.commit.message }}</strong>
            <small>
              {{ commit.commit.author.name }}
              {{ commit.commit.author.date | fromNow }}
            </small>
          </a>
        </section>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'history',
  props: ['path'],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      history: [],
      modal: false
    };
  },
  computed: {
    updated: function () {
      return "Updated " + this.$options.filters.fromNow(this.history[0].commit.author.date);
    }
  },
  mounted() {
    this.getHistory();
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.modal = false;
    });
  },
  methods: {
    getHistory: function () {
      // Retrieve the commit history of the file we edit from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/commits?path=' + this.path + '&access_token=' + this.token;
      this.$http.get(url).then(response => {
        this.error = '';
        this.history = response.body;
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the commit history (' + response.body.message + ')',
          duration: -1
        });
      });
    }
  }
}
</script>
