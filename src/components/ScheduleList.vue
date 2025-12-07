<template>
  <div class="schedule-list-container">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="scheduleData">
      <!-- Навигация с переключением вида -->
      <div class="schedule-navigation mb-3">
        <button 
          class="btn btn-sm btn-outline-primary mr-2"
          @click="setScheduleType('full')"
          :class="{ active: currentView === 'full' }"
        >
          Полное расписание
        </button>
        <button 
          class="btn btn-sm btn-outline-primary"
          @click="setScheduleType('compact')"
          :class="{ active: currentView === 'compact' }"
        >
          Компактное расписание
        </button>
        
        <div class="float-right">
          <span class="schedule-info">
            {{ getTypeLabel(type) }}: <strong>{{ value }}</strong>
          </span>
        </div>
      </div>

      <!-- WeekNavigator с управлением неделями -->
      <WeekNavigator 
        v-model:week-start="localWeekStart"
        v-model:week-end="localWeekEnd"
        :week-number="scheduleData.weekNumber || 0"
        :odd="scheduleData.odd || 0"
        :mode="currentView"
      />

      <!-- Отображение расписания в зависимости от выбранного типа -->
      <div v-if="currentView === 'compact'">
        <CompactSchedule
          :schedule="scheduleData"
          :type="type"
          :value="value"
        />
      </div>
      <div v-else>
        <WeekSchedule
          :schedule="scheduleData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import WeekNavigator from './WeekNavigator.vue'
import CompactSchedule from './CompactSchedule.vue'
import WeekSchedule from './WeekSchedule.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const scheduleData = ref(null)
const currentView = ref('compact') // По умолчанию компактное

// Локальные переменные для дат (управляются WeekNavigator)
const localWeekStart = ref('')
const localWeekEnd = ref('')

// Получаем параметры из URL
const type = computed(() => route.query.type || 'classroom')
const value = computed(() => route.query.value || '')
const dateStart = computed(() => route.query.dateStart || '')
const dateEnd = computed(() => route.query.dateEnd || '')

// Функция для получения понятного названия типа
const getTypeLabel = (type) => {
  const labels = {
    teacher: 'Преподаватель',
    classroom: 'Аудитория',
    group: 'Группа'
  }
  return labels[type] || type
}

// Функция загрузки расписания
const fetchSchedule = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Используем даты из WeekNavigator или из URL
    const weekStart = localWeekStart.value || dateStart.value
    const weekEnd = localWeekEnd.value || dateEnd.value
    
    if (!weekStart) {
      // Если дат нет нигде, ждем пока WeekNavigator их установит
      console.log('Waiting for WeekNavigator to set dates...')
      return
    }
    
    // В зависимости от типа представления используем разные API
    const apiUrl = currentView.value === 'compact' 
      ? '/student/schedule-open/api-compact'
      : '/student/schedule-open/api-list'
    
    const params = {
      type: type.value,
      value: value.value,
      dateStart: weekStart
    }
    
    // Для полного расписания добавляем dateEnd
    if (currentView.value === 'full') {
      params.dateEnd = weekEnd
    }
    
    console.log('Fetching schedule with params:', params)
    
    const response = await axios.get(apiUrl, { params })
    
    if (response.data) {
      scheduleData.value = response.data
      
      // Обновляем даты из ответа API
      if (response.data.week_start && response.data.week_end) {
        localWeekStart.value = response.data.week_start
        localWeekEnd.value = response.data.week_end
      }
    } else {
      error.value = 'Пустой ответ от сервера'
    }
  } catch (err) {
    console.error('Error fetching schedule:', err)
    error.value = `Ошибка при загрузке расписания: ${err.message}`
    
    if (err.response?.status === 404) {
      error.value = 'API endpoint не найден. Проверьте путь к API.'
    }
  } finally {
    loading.value = false
  }
}

// Установка типа расписания
const setScheduleType = (view) => {
  currentView.value = view
  localStorage.setItem('preferredScheduleView', view)
  
  // При смене типа представления нужно перезагрузить данные
  nextTick(() => {
    fetchSchedule()
  })
}

// Инициализация при монтировании
onMounted(() => {
  // Восстанавливаем предпочтения пользователя
  const preferredView = localStorage.getItem('preferredScheduleView')
  if (preferredView) {
    currentView.value = preferredView
  }
  
  // Если даты пришли из URL, устанавливаем их
  if (dateStart.value) {
    localWeekStart.value = dateStart.value
  }
  if (dateEnd.value) {
    localWeekEnd.value = dateEnd.value
  }
  
  // Ждем немного чтобы WeekNavigator инициализировался
  setTimeout(() => {
    if (localWeekStart.value) {
      fetchSchedule()
    }
  }, 100)
})

// Следим за изменениями дат из WeekNavigator
watch([localWeekStart, localWeekEnd], () => {
  if (localWeekStart.value) {
    // Обновляем URL с новыми датами
    router.replace({
      query: {
        ...route.query,
        dateStart: localWeekStart.value,
        dateEnd: localWeekEnd.value
      }
    })
    
    // Загружаем данные для новых дат
    fetchSchedule()
  }
})

// Следим за изменениями параметров из URL
watch([type, value], () => {
  if (localWeekStart.value) {
    fetchSchedule()
  }
})

// Следим за изменением типа представления
watch(currentView, () => {
  if (localWeekStart.value) {
    fetchSchedule()
  }
})
</script>

<style scoped>
.schedule-list-container {
  padding: 20px;
}

.schedule-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.schedule-navigation .btn.active {
  background-color: #007bff;
  color: white;
}

.schedule-info {
  font-size: 16px;
  padding: 5px 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

.error {
  text-align: center;
  padding: 50px;
  color: #dc3545;
  background-color: #f8d7da;
  border-radius: 5px;
  margin: 20px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>