<template>
  <div>
    <!-- String & Hidden-->
    <div v-if="type === 'string' || type === 'hidden'">
      <input
        type="text"
        :value="value"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <!-- File & Image -->
    <div v-if="type == 'image' || type == 'file'">
      file-picker
      <file-picker
        :type="type"
        :config="config"
        :value="value"
        :onChange="handleFilePickerChange"
      />
    </div>
    <!-- Else -->
    <div v-else>
      other type
    </div>
  </div>
</template>

<script>
import FilePicker from './FilePicker.vue';
// import Helper from '../helper.js';
// import TextInput from './Inputs/TextInput.vue';
// import vSelect from 'vue-select'
// import { codemirror } from 'vue-codemirror'
// import 'codemirror/mode/markdown/markdown.js';
// import 'codemirror/lib/codemirror.css';
// import draggable from 'vuedraggable';

export default {
  props: ['type', 'config', 'value'],
  components: { FilePicker },
  // data: function () {
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
  // },
  methods: {
    handleFilePickerChange: function (val) {
      this.$emit('input', val)
    }
  }
}
</script>
