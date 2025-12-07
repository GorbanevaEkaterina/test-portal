
import { createRouter, createWebHistory } from 'vue-router'
import ScheduleSelector from '../components/ScheduleSelector.vue'
import ScheduleView from '../components/ScheduleView.vue'
import ScheduleCombine from '../components/ScheduleCombine.vue'
import ScheduleList from '../components/ScheduleList.vue'

const routes = [
  { path: '/', component: ScheduleSelector },
  {
    path: '/schedule',
    name: 'ScheduleFull',
    component: ScheduleView,
    props: (route) => ({
      type: route.query.type,
      value: route.query.value,
      dateStart: route.query.dateStart,
      dateEnd: route.query.dateEnd,
      mode: 'full'
    })
  },
  {
    path: '/compact',
    name: 'ScheduleCompact',
    component: ScheduleView,
    props: (route) => ({
      type: route.query.type,
      value: route.query.value,
      dateStart: route.query.dateStart,
      mode: 'compact'
    })
  },
  {
    path: '/psuti/schedule-open/combine',
    name: 'ScheduleCombine',
    component: ScheduleCombine,
    props: (route) => ({
      dateStart: route.query.dateStart,
      dateEnd: route.query.dateEnd
    })
  },
  {
    path: '/psuti/schedule-open/api-list',
    name: 'ScheduleList',
    component: ScheduleList,
    props: (route) => ({})
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
