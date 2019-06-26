<template>
  <div>
    <h1>{{ name }}</h1>
    <div>{{ metaData.git_url }}</div>
    <div v-if="$asyncComputed.readme.updating">Загрузка README...</div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">README.md</h3>
          <VueMarkdown
          :source="readme"
          ></VueMarkdown>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import projects from '@/../static/projects/projects.json'

export default {
  components: {
    VueMarkdown
  },
  props: {
    name: String
  },
  data () {
    return {
      projects
    }
  },
  asyncComputed: {
    readme: {
      async get () {
        if (!this.name) {
          return ''
        }
        const rsp = await fetch(`static/projects/${this.name}/README.md`, {
          methods: 'GET',
          headers: {
            'Accept': 'text/plain'
          }
        })
        if (!rsp.ok) {
          return 'Ошибка! Возможно, нет README'
        }
        return rsp.text()
      },
      default: ''
    }
  },
  computed: {
    metaData () {
      return this.projects[this.name] || {}
    }
  }
}
</script>

<style>

</style>
