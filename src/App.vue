<template>
  <v-app>
    <v-navigation-drawer app
    fixed
    clipped
    v-model="showNavigation"
    >
      <v-list dense>
        <v-list-tile
        v-for="(name) in tiles"
        :key="name"
        @click="clickMenu(name)">
          <v-list-tile-content>
            <v-list-tile-title>{{ name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="showNavigation = !showNavigation"></v-toolbar-side-icon>
      <v-toolbar-title>Проекты</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import projects from '@/../static/projects/projects.json'

export default {
  name: 'App',
  data () {
    return {
      showNavigation: true,
      projects
    }
  },
  computed: {
    tiles () {
      const keys = Object.keys(this.projects)
      keys.sort()
      return keys
    }
  },
  methods: {
    clickMenu (name) {
      this.$router.push({ name: 'Project', params: { name } })
    }
  }
}
</script>
