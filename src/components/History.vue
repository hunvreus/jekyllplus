<template>
  <div class='history'>
    <div v-for='commit in commits'>
      <a :href='commit.html_url' target='_blank'>
        <img :src='commit.author.avatar_url'>
        {{ commit.commit.author.name }}
        {{ commit.commit.author.date | fromNow }}
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'history',
    props: [ 'commits' ]
  }
</script>
