import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Chords from '@/components/Chords'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/chords',
      name: 'Chords',
      component: Chords
    }
  ]
})
