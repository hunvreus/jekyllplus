<template>
  <div id='notifications' v-if='notifications'>
    <div v-for='n in count' class='notification'>
      <a class='close' @click.prevent='modal = false'>
        <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
          <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notification',
  data: function() {
    return {
      notifications: []
    };
  }
}
</script>
