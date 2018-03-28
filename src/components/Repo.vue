<template>
  <div id="main">
    <router-view @menu="show = true" :config="config" :jekyllConfig="jekyllConfig"></router-view>
    <nav id="navigation" :class="{ active: show }" @click.self.prevent="show = false">
      <div class="box">
        <header class="header">
          <div class="controls">
            <a class="close icon" @click.prevent="show = false">
              <svg viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </a>
            <a class="logo tooltip-right" href="https://jekyllplus.com" target="_blank">
              <svg viewBox="0 0 260 260" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Group" transform="translate(20.000000, 20.000000)" fill="#0070E0">
                    <path d="M40,80 L40,120 L80,120 L80,80 L140,80 L140,140 L180,140 L180,40 L80,40 L80,0 L40,0 L40,40 L2.4492936e-15,40 L0,80 L40,80 Z M110,210 C71.3400675,210 40,178.659932 40,140 L180,140 C180,178.659932 148.659932,210 110,210 Z M110,170 C126.568542,170 140,156.568542 140,140 L80,140 C80,156.568542 93.4314575,170 110,170 Z" id="Combined-Shape"></path>
                  </g>
                </g>
              </svg>
              <span class="text">Go to the official Jekyll+ website</span>
            </a>
          </div>
        </header>
        <section class="body">
          <div class="repo">
            <small class='label'>Repo</small>
            <a :href="'https://github.com/' + username" target="_blank">{{ username }}</a>
            /
            <a :href="'https://github.com/' + username + '/' + repo" target="_blank">{{ repo }}</a>
          </div>
          <div class="branch">
            <small class='label'>Branch</small>
            <div class="select">
              <select v-model="ref">
                <option v-for="branch in branches" :value="branch">{{ branch }}</option>
              </select>
            </div>
          </div>
          <nav class="links">
            <router-link :to="{ name: 'files' }" @click.native="show = false">
              <svg viewBox="0 0 24 24">
                <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z" />
              </svg>
              Files
            </router-link>
            <!-- <hr/>
            <small class='label'>Collections</small>
            <a class="pages">Pages</a>
            <a class="posts">Posts</a>
            <hr/>
            <small class='label'>Collections</small>
            <a class="includes">Includes</a>
            <a class="layouts">Layouts</a> -->
            <!-- <hr/> -->
            <a target="_blank" :href="'https://github.com/' + username + '/' + repo + '/edit/' + ref + '/.jekyllplus.yml'">
              <svg viewBox="0 0 24 24">
                <path  d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z" />
              </svg>
              Settings
            </a>
          </nav>
        </section>
        <footer class="footer">
          <User/>
        </footer>
      </div>
    </nav>
  </div>
</template>

<script>
const YAML = require('js-yaml');
import User from './User.vue';

export default {
  name: 'repo',
  components: { User },
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      jekyllConfig: null,
      config: null,
      branches: [],
      show: false
    };
  },
  mounted() {
    this.setConfig();
    this.setBranches();
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.show = false;
    });
  },
  watch: {
    'ref': function (to, from) {
      this.$router.push('/' + this.username + '/' + this.repo + '/' + this.ref + '/');
      this.show = false;
      this.setConfig();
    }
  },
  methods: {
    setConfig: function (defaultConfig = false) {
      if (defaultConfig == false) {
        // Retrieve the configuration (`.jekyllplus.yml`) from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/.jekyllplus.yml';
        var params = {
          access_token: this.token,
          ref: this.ref,
          timestamp: Date.now()
        };
        this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}, params: params}).then(response => {
          // Upon retrieval, we parse the YAML file
          this.config = YAML.safeLoad(response.body);
          this.setJekyllConfig();
        }, response => {
          if (response.status == 404) {
            // File isn't there, we try to switch to default configuration
            this.setConfig(true);
          }
          else {
            this.$notify({
              type: 'error',
              text: 'Couldn\'t retrieve the configuration file (' + response.body.message + ')',
              duration: -1
            });
          }
        });
      }
      else {
        // Retrieve the default configuration
        this.$http.get('/assets/default.yml').then(response => {
          // We warn developers in the console
          console.warn('Missing .jekyllpro.yml configuration file, switched to default configuration.');
          // Upon retrieval, we parse the YAML file
          this.config = YAML.safeLoad(response.body);
          this.setJekyllConfig();
        }, response => {
          this.$notify({
            type: 'error',
            text: 'Couldn\'t retrieve the configuration file (' + response.body.message + ')',
            duration: -1
          });
        });
      }


    },
    setJekyllConfig: function () {
      // Retrieve the Jekyll configuration (`_config.yml`) from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/_config.yml';
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {headers: {'Accept': 'application/vnd.github.v3.raw'}, params: params}).then(response => {
        // Upon retrieval, we parse the YAML file
        this.jekyllConfig = YAML.safeLoad(response.body);
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the Jekyll configuration file (' + response.body.message + ')',
          duration: -1
        });
      });
    },
    setBranches: function () {
      // Retrieve the branches from GitHub
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/branches?access_token=' + this.token;
      this.$http.get(url).then(response => {
        // Upon retrieval, we get the list of branches
        this.branches = response.body.map(branch => branch.name);
      }, response => {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t retrieve the list of branches (' + response.body.message + ')',
          duration: -1
        });
      });
    }
  }
}
</script>
