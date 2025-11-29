<template>
  <div class="schedule-wrapper">
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-2">Загрузка расписания...</p>
    </div>
    <div v-else-if="!schedule?.items" class="alert alert-info">
      Нет данных для отображения
    </div>
    <div v-else>
      <div class="schedule-header mb-4 p-3 border rounded bg-light">
        <h3>
          Расписание
          <span v-if="props.type === 'group'">группы</span>
          <span v-else-if="props.type === 'teacher'">преподавателя</span>
          <span v-else-if="props.type === 'classroom'">аудитории</span>
          <b>{{ props.value }}</b>
        </h3>
        <p class="mb-1">
          Неделя № <b>{{ schedule.weekNumber }}</b>
          <span v-if="schedule.odd === 1" class="text-info">(Нечётная)</span>
          <span v-if="schedule.odd === 2" class="text-success">(Чётная)</span>
        </p>
        <p class="mb-0">
          Период: {{ schedule.week_start }} – {{ schedule.week_end }}
        </p>
      </div>

      <WeekNavigator
        v-model:week-start="localWeekStart"
        v-model:week-end="localWeekEnd"
        :week-number="schedule.weekNumber"
        :odd="schedule.odd"
      />

      <WeekSchedule :schedule="schedule" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import WeekNavigator from './WeekNavigator.vue'
import WeekSchedule from './WeekSchedule.vue'
import { useScheduleList } from '../composables/useScheduleApi'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['group', 'teacher', 'classroom'].includes(v)
  },
  value: { type: String, required: true },
  dateStart: { type: String, default: '' },
  dateEnd: { type: String, default: '' }
})

const localWeekStart = ref(props.dateStart || '')
const localWeekEnd = ref(props.dateEnd || '')


const schedule = ref(null)
const loading = ref(false)
const error = ref(null)


const loadSchedule = async (type, value, start, end) => {
  loading.value = true
  error.value = null

  const { fetchList, schedule: data, error: err, loading: load } = useScheduleList(type, value, start, end)
  try {
    await fetchList()
    schedule.value = data.value
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadSchedule(props.type, props.value, props.dateStart, props.dateEnd)
})


watch([localWeekStart, localWeekEnd], ([newStart, newEnd]) => {
  loadSchedule(props.type, props.value, newStart, newEnd)
})
</script>

<style scoped>
.schedule-wrapper {
  margin-top: 20px;
}
</style>
