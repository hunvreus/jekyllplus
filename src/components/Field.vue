<template>
  <div class="field full-width" v-if="model">
    <label v-if="field.label">{{ field.label }}</label>
    <!-- String -->
    <div v-if="field.type == 'string'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <input type="text" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
        </draggable>
      </div>
      <input type="text" v-else v-model="model[field.name]"/>
    </div>
    <!-- Hidden -->
    <div v-if="field.type == 'hidden'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <input type="text" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
        </draggable>
      </div>
      <input type="text" v-else v-model="model[field.name]"/>
    </div>
    <!-- File & Image -->
    <div v-if="field.type == 'image' || field.type == 'file'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <file-picker v-for="n in model[field.name].length" :key="n" v-model="model[field.name][n - 1]" :type="field.type" :config="config"/>
        </draggable>
      </div>
      <file-picker v-else v-model="model[field.name]" :type="field.type" :config="config"/>
    </div>
    <!-- Checkbox -->
    <div v-if="field.type == 'checkbox'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <input type="checkbox" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
        </draggable>
      </div>
      <input type="checkbox" v-else v-model="model[field.name]"/>
    </div>
    <!-- Switch -->
    <div v-if="field.type == 'switch'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <label class="switch" v-for="n in model[field.name].length">
            <input type="checkbox" v-model="model[field.name][n - 1]"/>
            <div class="slider"><span></span></div>
          </label>
        </draggable>
      </div>
      <label v-else class="switch">
        <input type="checkbox" v-model="model[field.name]"/>
        <div class="slider"><span></span></div>
      </label>
    </div>
    <!-- Date -->
    <div v-else-if="field.type == 'date'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <input type="date" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
        </draggable>
      </div>
      <input type="date" v-else v-model="model[field.name]"/>
    </div>
    <!-- Select -->
    <div v-else-if="field.type == 'select'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <span class="select" v-for="n in model[field.name].length">
            <select v-model="model[field.name][n - 1]">
              <option v-for="option in field.options" :value="(typeof option == 'string') ? option : option.value">{{ (typeof option == 'string') ? option : option.label }}</option>
            </select>
          </span>
        </draggable>
      </div>
      <span class="select" v-else>
        <select v-model="model[field.name]">
          <option v-for="option in field.options" :value="(typeof option == 'string') ? option : option.value">{{ (typeof option == 'string') ? option : option.label }}</option>
        </select>
      </span>
    </div>
    <!-- Tags -->
    <div v-if="field.type == 'tags'">
      <!-- <div v-if="field.multiple" class="multiple">
        <input type="text" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
      </div> -->
      <v-select taggable :close-on-select="false" :no-drop="true" multiple v-model="model[field.name]" ></v-select>
    </div>
    <!-- Text -->
    <div v-else-if="field.type == 'text'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <textarea rows="20" v-for="n in model[field.name].length" v-model="model[field.name][n - 1]"/>
        </draggable>
      </div>
      <textarea rows="20" v-else v-model="model[field.name]"/>
    </div>
    <!-- Markdown -->
    <div v-else-if="field.type == 'text' || field.type=='markdown'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <codemirror v-for="n in model[field.name].length" v-model="model[field.name][n-1]" :options="codemirrorOptions"></codemirror>
        </draggable>
      </div>
      <codemirror v-model="model[field.name]" :options="codemirrorOptions" :class="{ autoresize: field.autoresize }"></codemirror>
    </div>
    <!-- Object -->
    <div v-else-if="field.type == 'object'">
      <div v-if="field.multiple" class="multiple">
        <draggable v-model="model[field.name]" :options="draggableOptions">
          <fieldset v-for="n in model[field.name].length" v-model="model[field.name][n - 1]">
            <field v-for="childField in field.fields" :key="childField.name" :field="childField" :model="model[field.name][n - 1]"></field>
          </fieldset>
        </draggable>
      </div>
      <fieldset v-else>
        <field v-for="childField in field.fields" :key="childField.name" :field="childField" :model="model[field.name]"></field>
      </fieldset>
    </div>
    <!-- Description if it exists -->
    <small v-if="field.description" class="description">{{ field.description }}</small>
    <!-- Add an entry for multiple fields -->
    <a v-if="field.multiple && field.type != 'hidden'" @click="addEntry" class="button smaller add">Add an entry</a>
  </div>
</template>

<script>
import FilePicker from './FilePicker.vue';
import Helper from '../helper.js';
import vSelect from 'vue-select'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import draggable from 'vuedraggable';
// import 'codemirror/theme/base16-dark.css';

export default {
  name: 'field',
  props: ['field', 'model', 'config', 'fixedOrder'],
  components: { FilePicker, vSelect, codemirror, draggable },
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
      empty: (this.field.type == 'object') ? Helper.createModel(this.field.fields, {}) : '',
      codemirrorOptions: {
        mode: 'text/markdown',
        lineWrapping: true
      }
    }
  },
  methods: {
    addEntry: function () {
      this.model[this.field.name].push(this.empty);
    },
  }
}
</script>
