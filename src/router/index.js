// import { createRouter, createWebHistory } from "vue-router";
// import ScheduleSelector from "../components/ScheduleSelector.vue";
// import ScheduleView from "../components/ScheduleView.vue";

// const routes = [
//   { path: "/", component: ScheduleSelector },
//   {
//     path: "/schedule",
//     name: "ScheduleView",
//     component: ScheduleView,
//     props: (route) => ({
//       type: route.query.type,
//       value: route.query.value,
//       dateStart: route.query.dateStart,
//       dateEnd: route.query.dateEnd,
//     }),
//   },
// ];

// const router = createRouter({
//   history: createWebHistory("/psuti/schedule-open/"),
//   routes,
// });

// export default router;

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ScheduleSelector from '../components/ScheduleSelector.vue'
import ScheduleView from '../components/ScheduleView.vue'

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
  }
]
// console.log("route.query.dateStart: ", route.query.dateStart);
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router