<template>
  <div class="hello">
    <h2>Projects</h2>
    <Project
    v-for="(value, name) in projects"
    :key="name"
    :name="name"
    :data="value"
    />
  </div>
</template>

<script>
import projects from '@/../static/projects/projects.json'
import Project from './Project/Project.vue'

console.log(projects)

export default {
  name: 'HelloWorld',
  components: {
    Project
  },
  data () {
    return {
      projects
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
