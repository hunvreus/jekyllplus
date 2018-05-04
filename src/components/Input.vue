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
    <div v-if="type === 'image' || type === 'file'">
      file-picker
      <file-picker
        :type="type"
        :config="config"
        :value="value"
        :onChange="handleInputChange"
      />
    </div>
    <!-- Checkbox -->
    <div v-if="type === 'checkbox'">
      <input
        type="checkbox"
        value="value"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <!-- Switch -->
    <div v-if="type === 'switch'">
      <label class="switch">
        <input
          type="checkbox"
          :value="value"
          @input="$emit('input', $event.target.value)"
        />
        <div class="slider"><span></span></div>
      </label>
    </div>
    <!-- Date -->
    <div v-else-if="type === 'date'">
      <input
        type="date"
        value="value"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <!-- Select -->
    <div v-else-if="type === 'select'">
      <span class="select">
        <select
          :value="value"
          @input="$emit('input', $event.target.value)"
        >
          <option
            v-for="option in options"
            :value="(typeof option === 'string') ? option : option.value">{{ (typeof option === 'string') ? option : option.label }}
          </option>
        </select>
      </span>
    </div>
    <!-- Text -->
    <div v-else-if="type === 'text'">
      <textarea
        rows="20"
        value="value"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <!-- Object -->
    <div v-else-if="type === 'object'">
      <fieldset>
        <field v-for="field in childFields" :key="field.name" :field="field" :model="model"></field>
      </fieldset>
    </div>
    <div v-else-if="type === 'markdown'">
      markdown
    </div>
    <!-- Tags -->    
    <div v-if="type === 'tags'">
      <v-select
        taggable
        :close-on-select="false"
        :no-drop="true"
        multiple
        :value="value"
        :onChange="handleInputChange"
      ></v-select>
    </div>
    <!-- Markdown -->
    <div v-else-if="type === 'text' || type=='markdown'">
      <codemirror
        :value="value"
        :options="codemirrorOptions"
        :class="{ autoresize: autoresize }"
        :changes="handleInputChange"
      ></codemirror>
    </div>
  </div>
</template>

<script>
import FilePicker from './FilePicker.vue';
import vSelect from 'vue-select';
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';

export default {
  name: 'custom-input',
  props: ['type', 'config', 'value', 'model', 'childFields', 'autoresize'],
  components: { FilePicker, vSelect, codemirror },
  methods: {
    handleInputChange: function (val) {
      console.log(val)
      this.$emit('input', val)
    },
  },
  data: function () {
    return {
      codemirrorOptions: {
        mode: 'text/markdown',
        lineWrapping: true
      }
    }
  },
}
</script>
