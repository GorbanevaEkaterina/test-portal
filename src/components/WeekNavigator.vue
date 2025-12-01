<template>
  <div class="week-navigator mb-4 p-3 border rounded">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
     
      <div class="btn-group" role="group">
        <button
          @click="switchWeek(false)"
          class="btn btn-outline-secondary"
          title="Предыдущая неделя"
          type="button"
        >
          ←
        </button>
        <button
          @click="switchWeek(true)"
          class="btn btn-outline-secondary"
          title="Следующая неделя"
          type="button"
        >
          →
        </button>
      </div>

      
      <div class="text-center flex-grow-1">
        <strong>Неделя №{{ weekNumber }}</strong>
        <span v-if="odd === 1" class="text-info"> (Нечётная)</span>
        <span v-if="odd === 2" class="text-success"> (Чётная)</span>
        <br />
        <small>{{ localWeekStart }} – {{ localWeekEnd }}</small>
      </div>

      
      <div class="d-flex gap-2">
        <input
          v-model="localWeekStart"
          type="text"
          class="form-control form-control-sm"
          placeholder="Начало"
          @change="onDateChange"
        />
        <input
          v-model="localWeekEnd"
          type="text"
          class="form-control form-control-sm"
          placeholder="Конец"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weekStart: { type: String, required: true }, // "01.12.2025"
  weekEnd: { type: String, required: true },   // "07.12.2025"
  weekNumber: { type: Number, default: 0 },
  odd: { type: Number, validator: v => [0, 1, 2].includes(v), default: 0 }
})

const emit = defineEmits(['update:weekStart', 'update:weekEnd'])

const localWeekStart = ref(props.weekStart)
const localWeekEnd = ref(props.weekEnd)


watch(() => props.weekStart, (val) => {
  localWeekStart.value = val
})
watch(() => props.weekEnd, (val) => {
  localWeekEnd.value = val
})


const getMonday = (date) => {
  const day = date.getDay() 
  const diff = date.getDate() - (day === 0 ? -6 : day - 1)
  const monday = new Date(date)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}


const formatDate = (date) => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}


const isValidDateStr = (str) => {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(str)
}


const switchWeek = (next) => {
  const [d, m, y] = localWeekStart.value.split('.').map(Number)
  const currentMonday = new Date(y, m - 1, d)
  currentMonday.setDate(currentMonday.getDate() + (next ? 7 : -7))

  const newStart = formatDate(currentMonday)
  const newEnd = formatDate(new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() + 6))

  updateDates(newStart, newEnd)
}

const onDateChange = () => {
  if (isValidDateStr(localWeekStart.value)) {
    const [d, m, y] = localWeekStart.value.split('.').map(Number)
    const inputDate = new Date(y, m - 1, d)
    const monday = getMonday(inputDate)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    updateDates(formatDate(monday), formatDate(sunday))
  }
}

const updateDates = (start, end) => {
  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)
}
</script>

<style scoped>
.week-navigator {
  background-color: #f8f9fa;
}
</style>