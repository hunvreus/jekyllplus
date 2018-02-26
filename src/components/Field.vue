<template>
  <div class='field'>
    <label>{{ field.label }}</label>
    <!-- String -->
    <div v-if='field.type == "string"'>
      <input type='text' v-if='field.multiple' v-for='n in count' v-model='file[field.name][n - 1]'/>
      <input type='text' v-else v-model='file[field.name]'/>
    </div>
    <!-- Switch -->
    <div v-if='field.type == "toggle"'>
      <input type='checkbox' v-if='field.multiple' v-for='n in count' v-model='file[field.name][n - 1]'/>
      <input type='checkbox' v-else v-model='file[field.name]'/>
    </div>
    <!-- Date -->
    <div v-else-if='field.type == "date"'>
      <input type='date' v-if='field.multiple' v-for='n in count' v-model='file[field.name][n - 1]'/>
      <input type='date' v-else v-model='file[field.name]'/>
    </div>
    <!-- List -->
    <div v-else-if='field.type == "select"'>
      <span class='select' v-if='field.multiple' v-for='n in count'>
        <select v-model='file[field.name][n - 1]'>
          <option v-for='option in field.options' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
      <span class='select' v-else>
        <select v-model='file[field.name]'>
          <option v-for='option in field.options' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
    </div>
    <!-- Object -->
    <div v-else-if='field.type == "object"'>
      <fieldset>
        <field v-for='objField in field.fields' :key='objField.name' :field='objField' :file='file[field.name]'></field>
      </fieldset>
    </div>
    <!-- Text -->
    <div v-else-if='field.type == "text" || field.type=="markdown"'>
      <textarea rows='20' v-if='field.multiple' v-for='n in count' v-model='file[field.name][n - 1]'/>
      <textarea rows='20' v-else v-model='file[field.name]'/>
    </div>
    <a v-if='field.multiple' v-on:click='count += 1' class='add'>Add an entry</a>
  </div>
</template>

<script>
  export default {
    name: 'field',
    props: ['field', 'file', 'prefix'],
    data: function () {
      return {
        count: 1
      }
    },
    watch: {
      value: function (val) {
        this.count = (val) ? (this.field.multiple ? val.length : 1) : 1;
      }
    },
    computed: {
      value: function () {
        return (this.file && this.field && this.field.name) ? this.file[this.field.name] : '';
      }
    }
  }
</script>
