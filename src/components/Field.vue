<template>
  <div class='field' v-if='model'>
    <label>{{ field.label }}</label>
    <!-- String -->
    <div v-if='field.type == "string"'>
      <input type='text' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='text' v-else v-model='model[field.name]'/>
    </div>
    <!-- Hidden -->
    <div v-if='field.type == "hidden"'>
      <input type='text' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='text' v-else v-model='model[field.name]'/>
    </div>
    <!-- Image -->
    <div v-if='field.type == "image"'>
      <div class='image-picker' v-if='field.multiple' v-for='n in count'>
        <input readonly type='text' v-model='model[field.name][n - 1]'/>
        <button class='button' v-on:click=''>Select file</button>
      </div>
      <div class='image-picker' v-else>
        <input readonly type='text' @click.prevent='modal = true' v-model='model[field.name]'/>
        <button class='button' @click.prevent='modal = true'>Select file</button>
      </div>
      <div class='modal' :class='{ active: modal }' @click.prevent.self='modal = false'>
        <div class='box large'>
          <header class='header'>
            <a class='close' @click.prevent='modal = false'>
              <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
                <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
              </svg>
            </a>
            <h2>Choose a file</h2>
          </header>
          <section class='body'>
            <file-picker :model='model[field.name]' :type='"image"' @selected='selected'/>
          </section>
          <footer class='footer'>
            <upload/>
            <button class='button smaller' @click.prevent='modal = false'>Cancel</button>
            <button class='button primary smaller' @click.prevent='model[field.name] = value; modal = false'>Select</button>
          </footer>
        </div>
      </div>
    </div>
    <!-- Checkbox -->
    <div v-if='field.type == "checkbox"'>
      <input type='checkbox' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='checkbox' v-else v-model='model[field.name]'/>
    </div>
    <!-- Switch -->
    <div v-if='field.type == "switch"'>
      <label class='switch'>
        <input type='checkbox' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
        <input type='checkbox' v-else v-model='model[field.name]'/>
        <div class='slider'><span></span></div>
      </label>
    </div>
    <!-- Date -->
    <div v-else-if='field.type == "date"'>
      <input type='date' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='date' v-else v-model='model[field.name]'/>
    </div>
    <!-- List -->
    <div v-else-if='field.type == "select"'>
      <span class='select' v-if='field.multiple' v-for='n in count'>
        <select v-model='model[field.name][n - 1]'>
          <option v-for='option in field.options' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
      <span class='select' v-else>
        <select v-model='model[field.name]'>
          <option v-for='option in field.options' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
    </div>
    <!-- Text -->
    <div v-else-if='field.type == "text" || field.type=="markdown"'>
      <textarea rows='20' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <textarea rows='20' v-else v-model='model[field.name]'/>
    </div>
    <!-- Object -->
    <div v-else-if='field.type == "object"'>
      <fieldset>
        <field v-for='childField in field.fields' :key='childField.name' :field='childField' :model='model[field.name]'></field>
      </fieldset>
    </div>
    <!-- Add an entry for multiple fields -->
    <a v-if='field.multiple && field.type != "hidden"' v-on:click='count += 1' class='button smaller add'>Add an entry</a>
  </div>

</template>

<script>
import FilePicker from './FilePicker.vue';
import Upload from './Upload.vue';

export default {
  name: 'field',
  props: ['field', 'model'],
  components: {
    FilePicker,
    Upload
  },
  data: function () {
    // TODO: Remove
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      modal: null,
      value: '',
      count: 1
    }
  },
  methods: {
    selected: function (path) {
      this.value = path;
    }
  }
}
</script>
