
import { createRouter, createWebHistory } from 'vue-router'
import ScheduleSelector from '../components/ScheduleSelector.vue'
import ScheduleView from '../components/ScheduleView.vue'

const routes = [
  { path: '/', component: ScheduleSelector },
  {
    path: '/schedule',
    component: ScheduleView,
    props: (route) => ({
      type: route.query.type,
      value: route.query.value,
      dateStart: route.query.dateStart,
      dateEnd: route.query.dateEnd
    })
  }
]

const router = createRouter({
  history: createWebHistory('/psuti/schedule-open/'), 
  routes
})

export default router