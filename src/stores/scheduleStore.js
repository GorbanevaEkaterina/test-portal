
import { defineStore } from 'pinia'
import axios from 'axios'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedule: null,
    loading: false,
    error: null,
    currentParams: null, // опционально для отслеживания кэша
  }),

  actions: {
    async fetchSchedule({ type, value, dateStart, dateEnd, mode }) {
      // Опционально: избегать дублирования запросов
      const params = { type, value, dateStart, dateEnd, mode }
      if (JSON.stringify(params) === JSON.stringify(this.currentParams)) {
        return // уже загружено
      }

      this.loading = true
      this.error = null
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('type', type)
        queryParams.append('value', value)
        if (dateStart) queryParams.append('date_start', dateStart)
        if (dateEnd && mode === 'full') queryParams.append('date_end', dateEnd)
        if (mode) queryParams.append('view', mode)

        const url = `/student/schedule-open?${queryParams.toString()}`
        const response = await axios.get(url)
        this.schedule = response.data
        this.currentParams = params
      } catch (err) {
        this.error = err.response?.data?.message || 'Ошибка загрузки расписания'
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.schedule = null
      this.loading = false
      this.error = null
      this.currentParams = null
    }
  }
})