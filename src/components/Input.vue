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
        <div>
          <label class="collapsed-field" v-if="collapsed && field.multiple">{{ order || 1 }} of {{ total || 1 }}</label>
          <div class="input-nav">
            <a v-if="field.multiple" class="icon" @click="handleFieldToggleClick">
              <svg viewBox="0 0 24 24">
                <path v-if="collapsed" d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z" />
                <path v-if="!collapsed" d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z" />
              </svg>
            </a>
            <a v-if="deleteBtn" class="icon" @click="onDelete(order-1)">
              <svg viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </a>
            <a v-if="handle" class="icon handle">
              <svg viewBox="0 0 24 24">
                <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
              </svg>
            </a>
          </div>
        </div>
        <field v-if="!collapsed || !field.multiple" v-for="childField in childFields" :key="childField.name" :field="childField" :model="model"></field>
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
  props: ['field', 'value', 'config', 'model', 'order', 'total', 'allCollapsed', 'onDelete', 'deleteBtn', 'handle'],
  components: { FilePicker, vSelect, codemirror },
  data: function () {
    return {
      codemirrorOptions: {
        mode: 'text/markdown',
        lineWrapping: true
      },
      type: this.field.type,
      options: this.field.options,
      childFields: this.field.fields,
      autoresize: this.field.autoresize,
      collapsed: true
    }
  },
  watch: {
    allCollapsed: function (to, from) {
      this.collapsed = to
    } 
  },
  methods: {
    handleInputChange: function (val) {
      this.$emit('input', val)
    },
    handleFieldToggleClick: function () {
      this.collapsed = !this.collapsed
    }
  },
}
</script>
