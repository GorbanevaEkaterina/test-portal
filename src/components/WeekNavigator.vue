<template>
  <div class="week-navigator mb-4 p-3 border rounded">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="btn-group" role="group">
        <button
          @click="switchWeek(false)"
          class="btn btn-outline-secondary"
          :title="prevButtonTitle"
          type="button"
        >
          ←
        </button>
        <div class="d-flex gap-2">
          <div class="input-group" v-if="mode ">
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

          <div class="input-group" v-if="mode">
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
          :title="nextButtonTitle"
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
        <div v-if="mode === 'compact'" class="text-muted small">
          (2 недели)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import Datepicker from 'vue3-datepicker'
import ru from 'date-fns/locale/ru'
import { format, addDays, subDays, startOfWeek, endOfWeek, isMonday, isSunday } from 'date-fns'

const props = defineProps({
  weekStart: { type: String, default: '' },
  weekEnd: { type: String, default: '' },
  weekNumber: { type: Number, default: 0 },
  odd: { type: Number, validator: v => [0, 1, 2].includes(v), default: 0 },
  mode: { type: String, default: 'full', validator: v => ['full', 'compact'].includes(v) }
})

const emit = defineEmits(['update:weekStart', 'update:weekEnd'])

const locale = ru

// Функция для получения текущей недели
const getCurrentWeekDates = () => {
  const today = new Date()
  
  // Получаем понедельник текущей недели
  const getMonday = (date) => {
    const day = date.getDay()
    const diff = date.getDate() - (day === 0 ? -6 : day - 1)
    const monday = new Date(date)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    return monday
  }
  
  // Для компактного режима возвращаем 2 недели
  const getEndDate = (monday, isCompact = false) => {
    return addDays(monday, isCompact ? 13 : 6) // 2 недели или 1 неделя
  }
  
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return ''
    return format(date, 'dd.MM.yyyy')
  }
  
  const monday = getMonday(today)
  const endDate = getEndDate(monday, props.mode === 'compact')
  
  return {
    start: formatDate(monday),
    end: formatDate(endDate),
    startDate: monday,
    endDate: endDate
  }
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

const currentWeek = getCurrentWeekDates()

// Используем переданные пропсы или текущую неделю по умолчанию
const localWeekStart = ref(props.weekStart || currentWeek.start)
const localWeekEnd = ref(props.weekEnd || currentWeek.end)

const internalStartDate = ref(props.weekStart ? parseDate(props.weekStart) : currentWeek.startDate)
const internalEndDate = ref(props.weekEnd ? parseDate(props.weekEnd) : currentWeek.endDate)

// Если пропсы не переданы, инициализируем текущей неделей
onMounted(() => {
  if (!props.weekStart || !props.weekEnd) {
    emit('update:weekStart', currentWeek.start)
    emit('update:weekEnd', currentWeek.end)
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
  monday.setHours(0, 0, 0, 0)
  return monday
}

// Важное изменение: при переключении режимов сохраняем понедельник
const adjustDatesForModeChange = (newMode, oldMode, currentStartDate) => {
  if (!currentStartDate) return { start: '', end: '' }
  
  const monday = getMonday(currentStartDate)
  
  if (newMode === 'compact' && oldMode === 'full') {
    // При переходе с полного на компактный:
    // Берём понедельник за неделю ДО текущего понедельника
    const compactMonday = subDays(monday, 7)
    const compactEnd = addDays(compactMonday, 13)
    
    return {
      start: formatDate(compactMonday),
      end: formatDate(compactEnd),
      startDate: compactMonday,
      endDate: compactEnd
    }
  } else if (newMode === 'full' && oldMode === 'compact') {
    // При переходе с компактного на полный:
    // Берем понедельник из второй недели компактного расписания
    const fullMonday = addDays(monday, 7)
    const fullEnd = addDays(fullMonday, 6)
    
    return {
      start: formatDate(fullMonday),
      end: formatDate(fullEnd),
      startDate: fullMonday,
      endDate: fullEnd
    }
  }
  
  // Если режим не менялся или менялся на тот же
  const endDate = addDays(monday, newMode === 'compact' ? 13 : 6)
  return {
    start: formatDate(monday),
    end: formatDate(endDate),
    startDate: monday,
    endDate: endDate
  }
}

const getEndDate = (monday) => {
  // Для компактного режима возвращаем 2 недели, для полного - 1 неделю
  return addDays(monday, props.mode === 'compact' ? 13 : 6)
}

const disabledDatesStart = {
  customPredictor: (date) => date.getDay() !== 1 // Только понедельник
}

const disabledDatesEnd = {
  customPredictor: (date) => date.getDay() !== 0 // Только воскресенье
}

const onStartDateSelect = (date) => {
  if (!date) return

  const monday = getMonday(date)
  const endDate = getEndDate(monday)

  const start = formatDate(monday)
  const end = formatDate(endDate)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)

  internalEndDate.value = endDate
}

const onEndDateSelect = (date) => {
  if (!date) return

  // Для компактного режима вычисляем понедельник от конца периода
  const endDate = date
  const daysToSubtract = props.mode === 'compact' ? 13 : 6
  const monday = subDays(endDate, daysToSubtract)

  const start = formatDate(monday)
  const end = formatDate(endDate)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)

  internalStartDate.value = monday
}

const switchWeek = (next) => {
  const currentMonday = parseDate(localWeekStart.value)
  if (!currentMonday) return

  // Определяем количество дней для сдвига
  const daysToShift = props.mode === 'compact' ? 14 : 7
  const shiftDirection = next ? daysToShift : -daysToShift
  
  const newMonday = addDays(currentMonday, shiftDirection)
  const newEndDate = getEndDate(newMonday)

  const start = formatDate(newMonday)
  const end = formatDate(newEndDate)

  localWeekStart.value = start
  localWeekEnd.value = end
  emit('update:weekStart', start)
  emit('update:weekEnd', end)
}

// Вычисляемые свойства для заголовков кнопок
const prevButtonTitle = computed(() => {
  return props.mode === 'compact' 
    ? 'Предыдущие 2 недели' 
    : 'Предыдущая неделя'
})

const nextButtonTitle = computed(() => {
  return props.mode === 'compact' 
    ? 'Следующие 2 недели' 
    : 'Следующая неделя'
})

// Наблюдаем за изменениями пропсов
watch(() => props.weekStart, (val) => {
  if (val) {
    const date = parseDate(val)
    if (date) {
      internalStartDate.value = date
      localWeekStart.value = val
    }
  }
})

watch(() => props.weekEnd, (val) => {
  if (val) {
    const date = parseDate(val)
    if (date) {
      internalEndDate.value = date
      localWeekEnd.value = val
    }
  }
})

// При изменении режима пересчитываем даты
watch(() => props.mode, (newMode, oldMode) => {
  console.log(`Mode changed in WeekNavigator from ${oldMode} to ${newMode}`)
  
  // Ждём следующего тика, чтобы получить актуальные значения
  nextTick(() => {
    const currentStartDate = parseDate(localWeekStart.value)
    if (currentStartDate) {
      const adjustedDates = adjustDatesForModeChange(newMode, oldMode, currentStartDate)
      
      console.log('Adjusted dates for mode change:', adjustedDates)
      
      localWeekStart.value = adjustedDates.start
      localWeekEnd.value = adjustedDates.end
      internalStartDate.value = adjustedDates.startDate
      internalEndDate.value = adjustedDates.endDate
      
      emit('update:weekStart', adjustedDates.start)
      emit('update:weekEnd', adjustedDates.end)
    }
  })
})
</script>

<style scoped>
.week-navigator {
  background-color: #f8f9fa;
}

.input-group {
  display: flex;
  align-items: stretch;
  width: auto;
}

.input-group .form-control {
  border-radius: 0;
  width: 120px;
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

.d-flex.gap-2 {
  gap: 0.5rem;
}

.btn-group {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
}

.text-muted.small {
  font-size: 0.85em;
  margin-top: 2px;
}
</style>