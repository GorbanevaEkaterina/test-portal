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
        <div class="d-flex gap-2">
        
        <div class="input-group">
          <Datepicker
            v-model="internalStartDate"
            :enable-time="false"
            :locale="ru"
            :format="formatDate"
            :max-date="maxDate"
            :min-date="minDate"
            :disabled-dates="disabledDatesStart"
            @update:model-value="onStartDateSelect"
            :input-class="'form-control form-control-sm'"
            placeholder="Начало"
          />
          <span class="input-group-text">
            <i class="fa fa-calendar"></i>
          </span>
        </div>

        
        <div class="input-group">
          <Datepicker
            v-model="internalEndDate"
            :enable-time="false"
            :locale="ru"
            :format="formatDate"
            :max-date="maxDate"
            :min-date="minDate"
            :disabled-dates="disabledDatesEnd"
            @update:model-value="onEndDateSelect"
            :input-class="'form-control form-control-sm'"
            placeholder="Конец"
          />
          <span class="input-group-text">
            <i class="fa fa-calendar"></i>
          </span>
        </div>
      </div>
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

     
      

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Datepicker from 'vue3-datepicker'
import ru from 'date-fns/locale/ru'
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns'


const props = defineProps({
  weekStart: { type: String, required: true },
  weekEnd: { type: String, required: true },
  weekNumber: { type: Number, default: 0 },
  odd: { type: Number, validator: v => [0, 1, 2].includes(v), default: 0 }
})

const emit = defineEmits(['update:weekStart', 'update:weekEnd'])


const locale = ru


const localWeekStart = ref(props.weekStart)
const localWeekEnd = ref(props.weekEnd)


const internalStartDate = ref(null)
const internalEndDate = ref(null)


watch(() => props.weekStart, (val) => {
  if (val) {
    const [d, m, y] = val.split('.').map(Number)
    internalStartDate.value = new Date(y, m - 1, d)
  }
})
watch(() => props.weekEnd, (val) => {
  if (val) {
    const [d, m, y] = val.split('.').map(Number)
    internalEndDate.value = new Date(y, m - 1, d)
  }
})


const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 0, 1)


const formatDate = (date) => {
  if (!date || isNaN(date.getTime())) return ''
  return format(date, 'dd.MM.yyyy')
}

const getMonday = (date) => {
  const day = date.getDay()
  const diff = date.getDate() - (day === 0 ? -6 : day - 1)
  const monday = new Date(date)
  monday.setDate(diff)
  return monday
}

const getSunday = (monday) => {
  return addDays(monday, 6)
}


const disabledDatesStart = {
  customPredictor: (date) => date.getDay() !== 1 // Только понедельник
}
const disabledDatesEnd = {
  customPredictor: (date) => date.getDay() !== 0 // Только воскресенье
}


const onStartDateSelect = (date) => {
  console.log("1111 ", date);
  if (!date) return

  const monday = getMonday(date)
  const sunday = getSunday(monday)

  const start = formatDate(monday)
  const end = formatDate(sunday)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)

  
  internalEndDate.value = sunday
}

const onEndDateSelect = (date) => {
  if (!date) return

  
  const sunday = date
  const monday = subDays(sunday, 6)

  const start = formatDate(monday)
  const end = formatDate(sunday)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)

 
  internalStartDate.value = monday
}


const switchWeek = (next) => {
  const currentMonday = parseDate(localWeekStart.value)
  if (!currentMonday) return 

  const newMonday = next ? addDays(currentMonday, 7) : subDays(currentMonday, 7)
  const newSunday = addDays(newMonday, 6)

  const start = formatDate(newMonday)
  const end = formatDate(newSunday)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)
}


const parseDate = (str) => {
  if (!str || typeof str !== 'string') return null
  const parts = str.split('.')
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map(Number)
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? null : date
}
</script>

<style scoped>
.week-navigator {
  background-color: #f8f9fa;
}

.input-group {
  display: flex;
  align-items: stretch;
}

.input-group .form-control {
  border-radius: 0;
}

.input-group .input-group-text {
  border-radius: 0;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-left: 0;
}

.input-group .input-group-text i {
  margin: 0;
}
</style>

