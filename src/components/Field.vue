<template>
  <div class="field full-width" v-if="model">
    <label v-if="field.label">{{ field.label }}</label>
    <div>
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]">
          <custom-input
            v-for="n in model[field.name].length"
            v-model="model[field.name][n - 1]"
            :config="config"
            :model="model[field.name][n - 1]"
            :field="field"
          />
        </draggable>
      </div>
      <custom-input
        v-else
        v-model="model[field.name]"
        :config="config"
        :model="model[field.name]"
        :field="field"
      />
    </div>
    <!-- Description if it exists -->
    <small v-if="field.description" class="description">{{ field.description }}</small>
    <!-- Add an entry for multiple fields -->
    <a v-if="field.multiple && field.type != 'hidden'" @click="addEntry" class="button smaller add">Add an entry</a>
  </div>
</template>

<script>
import Input from './Input.vue';
import Helper from '../helper.js';
import draggable from 'vuedraggable';
// import 'codemirror/theme/base16-dark.css';

export default {
  name: 'field',
  props: ['field', 'model', 'config', 'fixedOrder'],
  components: { 'custom-input': Input, draggable },
  computed: {
    draggableOptions: function () {
      return {
        disabled: this.fixedOrder
      }
    }
  },
  data: function () {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      empty: (this.field.type == 'object') ? Helper.createModel(this.field.fields, {}) : ''
    }
  },
  methods: {
    addEntry: function () {
      this.model[this.field.name].push(this.empty);
    }
  }
}
</script>
