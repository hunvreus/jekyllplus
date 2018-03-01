<template>
  <div class='field' v-if='model'>
    <label>{{ field.label }}</label>
    <!-- String -->
    <div v-if='field.type == "string"'>
      <input type='text' v-if='field.multiple' v-for='n in count' v-model='model[field.name][n - 1]'/>
      <input type='text' v-else v-model='model[field.name]'/>
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
    <a v-if='field.multiple' v-on:click='count += 1' class='button small add'>Add an entry</a>
  </div>
</template>

<script>
  export default {
    name: 'field',
    props: ['field', 'model'],
    data: function () {
      return {
        count: 1
      }
    },
    watch: {
      value: function (val) {
        this.count = (val) ? ((this.field.multiple && val.length) ? val.length : 1) : 1;
      }
    },
    computed: {
      value: function () {
        return (this.model && this.field && this.field.name && this.model[this.field.name]) ? this.model[this.field.name] : [];
      }
    }
  }
</script>
