<template>
  <div v-if="type === 'string'">
    <div v-if="multiple" class="multiple">
      multiple
      <!-- <input type="text" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/> -->
    </div>
    <!-- <input type="text" v-else v-model="model[field.name]"/> -->

  </div>
</template>

<script>
// import Helper from '../helper.js';
import TextInput from './Inputs/TextInput.vue';
// import vSelect from 'vue-select'
// import { codemirror } from 'vue-codemirror'
// import 'codemirror/mode/markdown/markdown.js';
// import 'codemirror/lib/codemirror.css';
// import draggable from 'vuedraggable';

export default {
  name: 'field',
  props: ['type', 'multiple'],
  components: { TextInput },
  data: function () {
  //   return {
  //     username: this.$route.params.username,
  //     repo: this.$route.params.repo,
  //     ref: this.$route.params.ref,
  //     token: this.$root.$data.token,
  //     empty: (this.field.type == 'object') ? Helper.createModel(this.field.fields, {}) : '',
  //     codemirrorOptions: {
  //       mode: 'text/markdown',
  //       lineWrapping: true
  //     }
  //   }
  },
  // methods: {
  //   addEntry: function () {
  //     this.model[this.field.name].push(this.empty);
  //   },
  // }
}
</script>
