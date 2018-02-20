<template>
  <div>Editor</div>
</template>

<script>
export default {
  mounted() {
    console.log('Hello');
    require('yaml-front-matter/dist/js-yaml-front-client.min.js');
    var text = "---\n"
        +"name: Derek Worthen\n"
        +"age: young\n"
        +"contact: \n"
        +" email: email@domain.com\n"
        +" address: some location\n"
        +"pets: \n"
        +" - cat\n"
        +" - dog\n"
        +" - bat\n"
        +"---\n"
        +"Some Other content\n";
    console.log(text)
    var results = jsyaml.loadFront(text);
    console.log(results);
  }
}
</script>
