<template>
  <div class="field full-width" v-if="model">
    <label v-if="field.label">{{ field.label }}</label>
    <!-- add nav btn for collapsing/expanding all  -->
    <div v-if="field.multiple" @click="handleToggleAllClick">{{ allCollapsed ? 'expand all' : 'collapse all' }}</div>
    <div>
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="{handle:'.handle'}">
          <div v-for="n in model[field.name].length">
            <custom-input
              v-model="model[field.name][n - 1]"
              :config="config"
              :model="model[field.name][n - 1]"
              :field="field"
              :order="n"
              :total="model[field.name].length"
              :allCollapsed="allCollapsed"
              :onDelete="handleDeleteClick"
              :handle="true"
              :deleteBtn="true"
            />
          </div>
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
  data: function () {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      empty: (this.field.type == 'object') ? Helper.createModel(this.field.fields, {}) : '',
      allCollapsed: true
    }
  },
  methods: {
    addEntry: function () {
      this.model[this.field.name].push(this.empty);
    },
    handleToggleAllClick: function () {
      this.allCollapsed = !this.allCollapsed
    },
    handleDeleteClick: function (n) {
      this.model[this.field.name].splice(n, 1)
    }
  }
}
</script>
