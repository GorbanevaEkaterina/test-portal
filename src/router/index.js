


import { createRouter, createWebHistory } from 'vue-router'
import ScheduleSelector from '../components/ScheduleSelector.vue'
import ScheduleView from '../components/ScheduleView.vue'
import ScheduleCombine from '../components/ScheduleCombine.vue'

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
      // dateEnd не используется в api-compact
      mode: 'compact'
    })
  },
  {
    path: '/psuti/schedule-open/combine',
    name: 'ScheduleCombine',
    component: ScheduleCombine,
    props: (route) => ({
      // ScheduleCombine не требует type/value по умолчанию,
      // он сам позволяет их выбирать
      dateStart: route.query.dateStart,
      dateEnd: route.query.dateEnd
    })
  }
]
// console.log("route.query.dateStart: ", route.query.dateStart);
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router