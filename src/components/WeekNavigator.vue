<template>
  <div class="week-navigator mb-4 p-3 border rounded">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
     
      <div class="btn-group" role="group">
        <button
          @click="switchWeek(false)"
          class="btn btn-outline-secondary"
          title="Предыдущая неделя"
        >
          ←
        </button>
        <button
          @click="switchWeek(true)"
          class="btn btn-outline-secondary"
          title="Следующая неделя"
        >
          →
        </button>
      </div>

      
      <div class="text-center flex-grow-1">
        <strong>Неделя №{{ weekNumber }}</strong>
        <span v-if="odd === 1" class="text-info"> (Нечётная)</span>
        <span v-if="odd === 2" class="text-success"> (Чётная)</span>
        <br />
        <small>{{ weekStart }} – {{ weekEnd }}</small>
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
          @change="onDateChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weekStart: { type: String, required: true }, // "24.11.2025"
  weekEnd: { type: String, required: true },   // "30.11.2025"
  weekNumber: { type: Number, default: 0 },
  odd: { type: Number, validator: v => v === 1 || v === 2 || v === 0, default: 0 }
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


const switchWeek = (next) => {
  const [d, m, y] = localWeekStart.value.split('.').map(Number)
  const date = new Date(y, m - 1, d)

  
  date.setDate(date.getDate() + (next ? 7 : -7))

  const newStart = formatDate(date)
  const newEnd = formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6))

  updateDates(newStart, newEnd)
}


const onDateChange = () => {
  
  if (isValidDate(localWeekStart.value) && isValidDate(localWeekEnd.value)) {
    updateDates(localWeekStart.value, localWeekEnd.value)
  }
}


const updateDates = (start, end) => {
  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)
}


const formatDate = (date) => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}

const isValidDate = (str) => {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(str)
}
</script>

<style scoped>
.week-navigator {
  background-color: #f8f9fa;
}
</style>