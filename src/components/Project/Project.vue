<template>
  <div>
    <h1>{{ name }} <v-chip>{{ metaData.git_url }}</v-chip></h1>
    <div
    v-if="documentationUrl"
    ><a target="_blank" :href="documentationUrl">Документация</a></div>
    <div
    v-if="metaData.publishPath"
    >Путь публикации: {{ metaData.publishPath }}</div>
    <div v-if="$asyncComputed.readme.updating">Загрузка README...</div>
    <v-card
    style="margin-top: 10px;"
    >
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
    },
    documentationUrl () {
      const meta = this.metaData
      if (!meta || !meta.documentation) {
        return null
      }
      return `static/projects/${this.name}/documentation/index.html`
    }
  }
}
</script>

<style>

</style>
