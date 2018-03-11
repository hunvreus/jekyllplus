<template>
  <div class='picker' :class='status'>
    <header class='search'>
      <input v-model='keywords' type='text' placeholder='Search by name'/>
    </header>
    <div class='results'>
      <p v-if='query == ""' class='empty'>
        <strong>Search your GitHub repositories.</strong>
        Type the name of the organization first and the name of the repository second (e.g. "Wiredcraft/jekyllplus").
      </p>
      <ul v-else-if='results.items && results.items.length'>
        <li v-for='result in results.items'>
          <router-link :to='{ path: result.full_name + "/" + result.default_branch + "/list" }'>
            {{ result.full_name }}
            <div class='meta'>
              <span class='private' v-if='result.private'>
                <svg viewBox='0 0 24 24'>
                  <path d='M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z' />
                </svg> ·
              </span>
              Last updated {{ result.pushed_at | fromNow }} ·
              <span class='description'>{{ result.description }}</span>
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else-if='results.items && results.items.length == 0' class='empty'>
        <strong>We couldn't find any matching repository. </strong>
        Try and fill in the complete name of the repo (e.g. "Wiredcraft/jekyllplus").
      </p>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'repo-picker',
  data: function() {
    return {
      user: this.$root.$data.user,
      orgs: this.$root.$data.orgs,
      token: this.$root.$data.token,
      keywords: '',
      results: {},
      status: ''
    };
  },
  watch: {
    keywords: function (to, from) {
      this.searchRepos();
    }
  },
  computed: {
    query: function () {
      return this.keywords.trim();
    }
  },
  methods: {
    searchRepos: _.debounce(
      function () {
        if (this.query == '') {
          this.results = {};
          return;
        }
        this.status = 'searching';
        var url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(this.keywords) + '&access_token=' + this.token;
        this.$http.get(url).then(response => {
          this.error = '';
          this.results = response.body;
          this.status = '';
        }, response => {
          this.error = 'Error: ' + response.body.message;
          this.status = '';
        });
      }, 500
    )
  }
}
</script>
