<!-- src/components/TeacherList.vue -->
<template>
  <div class="row" style="padding: 25px 15px 15px">
    <div
      v-for="teacher in filteredTeachers"
      :key="teacher.teacher"
      class="col-6 col-xl-3 col-lg-3 col-md-4 local-col-6-1"
      @click="goToSchedule('teacher', teacher.teacher)"
      style="cursor: pointer"
    >
      <span class="list-group-item node-tree_stage local-list-item">
        {{ teacher.teacher }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  teachers: { type: Array, required: true, default: () => [] },
  department: { type: String, required: true }
})

const router = useRouter()

const filteredTeachers = computed(() =>
  props.teachers.filter(t => t.department === props.department)
)

const goToSchedule = (type, value) => {
  router.push({ path: '/schedule', query: { type, value } })
}
</script>