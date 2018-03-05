<template>
  <div class='field' v-if='model'>
    <label>{{ field.label }}</label>
    <!-- String -->
    <div v-if='field.type == "string"'>
      <input type='text' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='text' v-else v-model='model[field.name]'/>
    </div>
    <!-- Image -->
    <div v-if='field.type == "image"'>
      <div class='image-picker' v-if='field.multiple' v-for='n in count'>
        <input readonly type='text' v-model='model[field.name][n - 1]'/>
        <button class='button' v-on:click=''>Pick</button>
      </div>
      <div class='image-picker' v-else>
        <input readonly type='text' v-model='model[field.name]'/>
        <button class='button' @click.prevent='modal = true'>Pick</button>
        <div class='modal' :class='{ active: modal }' @click.prevent.self='modal = false'>
          <div class='box'>
            <header class='header'>
              <a class='close' @click.prevent='modal = false'>
                <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
                  <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
                </svg>
              </a>
              <h2>Choose a file</h2>
            </header>
            <section class='body'>
              <file-picker/>
            </section>
            <footer class='footer'>
            </footer>
          </div>
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
    <a v-if='field.multiple' v-on:click='count += 1' class='button smaller add'>Add an entry</a>

  </div>

</template>

<script>
import FilePicker from './FilePicker.vue';

export default {
  name: 'field',
  props: ['field', 'model'],
  components: {
    FilePicker
  },
  data: function () {
    // TODO: Remove
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      modal: false,
      count: 1
    }
  },
  watch: {
    // TODO: Remove
    value: function (val) {
      this.count = (val) ? ((this.field.multiple && val.length) ? val.length : 1) : 1;
    }
  },
  computed: {
    // TODO: Remove
    value: function () {
      return (this.model && this.field && this.field.name && this.model[this.field.name]) ? this.model[this.field.name] : [];
    },
    preview: function () {
      if (this.field.type == 'image') {
        // Retrieve the raw image (`.jekyllplus.yml`) from GitHub
        var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents' + this.model[this.field.name];
        var params = {
          access_token: this.token,
          ref: this.ref
        };
        this.$http.get(url, {params: params}).then(response => {
          console.log(response.body);
        }, response => {
          this.error = 'Couldn\'t retrieve the configuration file (.jekyllplus.yml): ' + response.body.message;
        });
      }
    }
  },
  methods: {
    pick: function () {

    }
  }
}
</script>
