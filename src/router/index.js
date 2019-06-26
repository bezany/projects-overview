import Vue from 'vue'
import Router from 'vue-router'
import Project from '@/components/Project/Project.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:name',
      name: 'Project',
      component: Project,
      props: true
    }
  ]
})
