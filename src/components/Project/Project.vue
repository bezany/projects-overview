<template>
  <div>
    <h3>{{ name }}</h3>
    <div>{{ data.git_url }}</div>
    <VueMarkdown
    :source="readme"
    ></VueMarkdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown
  },
  props: {
    name: String,
    data: Object
  },
  asyncComputed: {
    readme: {
      async get () {
        const rsp = await fetch(`static/projects/${this.name}/README.md`, {
          methods: 'GET',
          headers: {
            'Accept': 'text/plain'
          }
        })
        if (!rsp.ok) {
          throw new Error('get error: ' + rsp.statusText)
        }
        return rsp.text()
      },
      default: ''
    }
  }
}
</script>

<style>

</style>
