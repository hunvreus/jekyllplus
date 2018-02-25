<template>
  <div class='field'>
    <label>{{ field.label }}</label>
    <!-- String -->
    <div v-if='field.type == "string"'>
      <input v-if='field.multiple' v-for='n in count' type='text' :value='value ? value[n - 1] : ""' :name='name + "[]"'/>
      <input v-else type='text' :value='value' :name='name'/>
    </div>
    <!-- Switch -->
    <div v-if='field.type == "toggle"'>
      <input v-if='field.multiple' v-for='n in count' type='checkbox' :value='value[n - 1] ? "on" : ""' :name='name'>
      <input v-else type='checkbox' :value='value ? "on" : ""' :name='name'>
    </div>
    <!-- Date -->
    <div v-else-if='field.type == "date"'>
      <input v-if='field.multiple' v-for='n in count' type='date' :value='value[n - 1]' :name='name + "[]"'/>
      <input v-else type='date' :value='value' :name='name'/>
    </div>
    <!-- List -->
    <div v-else-if='field.type == "list"'>
      <span class='select' v-if='field.multiple' v-for='n in count'>
        <select :name='name + "[]"'>
          <option v-for='option in field.values' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
      <span class='select' v-else>
        <select :name='name'>
          <option v-for='option in field.values' :value='(typeof option == "string") ? option : option.value'>{{ (typeof option == "string") ? option : option.label }}</option>
        </select>
      </span>
    </div>
    <!-- Object -->
    <div v-else-if='field.type == "object"'>
      <fieldset>
        <field v-for='field in field.fields' :key='field.name' :field='field' :file='value' :prefix='name'></field>
      </fieldset>
    </div>
    <div v-else-if='field.type == "text" || field.type=="markdown"'>
      <textarea v-if='field.multiple' v-for='n in count' :value='value[n - 1]' rows='20' :name='name + "[]"'/>
      <textarea v-else :value='value' rows='20' :name='name'/>
    </div>
    <a v-if='field.multiple' v-on:click='count += 1' class='add'>Add an entry</a>
  </div>
</template>

<script>
  export default {
    name: 'field',
    props: [ 'field', 'file', 'prefix' ],
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
      name: function () {
        return this.prefix ? this.prefix + '[' + this.field.name + ']' : this.field.name;
      },
      value: function () {
        return (this.file && this.field && this.field.name) ? this.file[this.field.name] : '';
      }
    }
  }
</script>
