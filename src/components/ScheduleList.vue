<template>
  <div class="schedule-list-container">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Навигация -->
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
            {{ type === 'teacher' ? 'Преподаватель' : 'Аудитория' }}: <strong>{{ value }}</strong>
          </span>
        </div>
      </div>

      <!-- Отображение в зависимости от выбранного типа -->
      <div v-if="currentView === 'compact'">
        <CompactSchedule
          v-if="scheduleData"
          :schedule="scheduleData"
          :type="type"
          :value="value"
        />
      </div>
      <div v-else>
        <WeekSchedule
          v-if="scheduleData"
          :schedule="scheduleData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import CompactSchedule from './CompactSchedule.vue'
import WeekSchedule from './WeekSchedule.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const scheduleData = ref(null)
const currentView = ref('compact') // По умолчанию компактное

// Получаем параметры из URL
const type = computed(() => route.query.type || 'classroom')
const value = computed(() => route.query.value || '')
const dateStart = computed(() => route.query.dateStart || '')
const dateEnd = computed(() => route.query.dateEnd || '')

// Функция загрузки расписания
const fetchSchedule = async () => {
  loading.value = true
  error.value = null
  
  try {
    // В зависимости от типа представления используем разные API
    const apiUrl = currentView.value === 'compact' 
      ? '/student/schedule-open/api-compact'
      : '/student/schedule-open/api-list'
    
    const params = {
      type: type.value,
      value: value.value
    }
    
    // Добавляем даты в зависимости от типа представления
    if (currentView.value === 'compact') {
      // Для компактного только dateStart
      if (dateStart.value) {
        params.dateStart = dateStart.value
      } else {
        // Если даты нет, используем текущую неделю
        const today = new Date()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (today.getDay() + 6) % 7)
        params.dateStart = monday.toLocaleDateString('ru-RU').replace(/\./g, '.')
      }
    } else {
      // Для полного и dateStart и dateEnd
      if (dateStart.value) {
        params.dateStart = dateStart.value
      }
      if (dateEnd.value) {
        params.dateEnd = dateEnd.value
      } else if (dateStart.value) {
        // Если есть dateStart, но нет dateEnd, добавляем 6 дней
        const startDate = new Date(dateStart.value.split('.').reverse().join('-'))
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        params.dateEnd = endDate.toLocaleDateString('ru-RU').replace(/\./g, '.')
      }
    }
    
    const response = await axios.get(apiUrl, { params })
    
    if (response.data) {
      scheduleData.value = response.data
    } else {
      error.value = 'Пустой ответ от сервера'
    }
  } catch (err) {
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
  // Сохраняем выбор в localStorage для сохранения предпочтений
  localStorage.setItem('preferredScheduleView', view)
}

// Загружаем данные при монтировании и изменении параметров
onMounted(() => {
  // Восстанавливаем предпочтения пользователя
  const preferredView = localStorage.getItem('preferredScheduleView')
  if (preferredView) {
    currentView.value = preferredView
  }
  
  // Если даты не указаны, устанавливаем текущую неделю
  if (!dateStart.value) {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (today.getDay() + 6) % 7)
    
    const startDateStr = monday.toLocaleDateString('ru-RU').replace(/\./g, '.')
    const endDate = new Date(monday)
    endDate.setDate(monday.getDate() + 6)
    const endDateStr = endDate.toLocaleDateString('ru-RU').replace(/\./g, '.')
    
    // Обновляем URL без перезагрузки страницы
    router.replace({
      query: {
        ...route.query,
        dateStart: startDateStr,
        dateEnd: endDateStr
      }
    })
  } else {
    fetchSchedule()
  }
})

// Следим за изменениями параметров роута
watch([type, value, dateStart, dateEnd], () => {
  if (dateStart.value) {
    fetchSchedule()
  }
})

// Следим за изменением типа представления
watch(currentView, fetchSchedule)
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