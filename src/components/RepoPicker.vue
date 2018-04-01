<template>
  <div class="picker" :class="status">
    <header class="search">
      <input v-model="keywords" type="text" placeholder="Search by name"/>
    </header>
    <div class="results">
      <p v-if="query == ''" class="empty">
        <strong>Search your GitHub repositories.</strong>
        Type the name of the organization first and the name of the repository second (e.g. "Wiredcraft/jekyllplus").
      </p>
      <ul class="list" v-else-if="results.items && results.items.length">
        <li v-for="result in results.items">
          <router-link :to="{ path: result.full_name + '/' + result.default_branch + '/list' }">
            <svg viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            {{ result.full_name }}
            <div class="meta">
              <span class="private" v-if="result.private">
                <svg viewBox="0 0 24 24">
                  <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                </svg> ·
              </span>
              Last updated {{ result.pushed_at | fromNow }} ·
              <span class="description">{{ result.description }}</span>
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else-if="results.items && results.items.length == 0" class="empty">
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
        var url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent('fork:true ' + this.keywords) + '&access_token=' + this.token;
        this.$http.get(url).then(response => {
          this.results = response.body;
          this.status = '';
        }, response => {
          this.status = '';
          this.$notify({
            type: 'error',
            text: 'Search failed (' + response.body.message + ')',
            duration: -1
          });
        });
      }, 500
    )
  }
}
</script>
