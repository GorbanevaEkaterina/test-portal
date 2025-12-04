<template>
  <div class="schedule-combine container py-4">
    <header>
      <h2 class="text-center mb-4">Расписание</h2>
    </header>

    <div class="schedule-head mb-4">
      <div class="row">
        
        <div class="col-12 col-lg-8">
          <div class="dataSet">
            <div class="datasub">
              <div>Диапазон дат</div>
              <div class="box-data d-flex align-items-center">
                <div class="local-arrow" @click="switchWeek(false)">
                  <span class="l-btn-arrow input-group-text">
                    <i class="fa fa-arrow-left"></i>
                  </span>
                </div>
                <div class="dp__main dp__theme_light" style="flex: 1; margin: 0 10px;">
                  <input
                    class="form-control text-center"
                    type="text"
                    :value="`${dateRange.start} - ${dateRange.end}`"
                    readonly
                  />
                </div>
                <div class="local-arrow" @click="switchWeek(true)">
                  <span class="l-btn-arrow input-group-text">
                    <i class="fa fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div class="col-12 col-lg-4 mt-3 mt-lg-0">
          <div class="d-flex align-items-center mb-2">
            <label class="form-label me-3" style="width: 180px;">Обе недели сразу:</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="filters.both"
                @change="onFilterChange"
              />
            </div>
          </div>
          <div class="d-flex align-items-center mb-2">
            <label class="form-label me-3" style="width: 180px;">Чётная неделя:</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="filters.even"
                @change="onFilterChange"
              />
            </div>
          </div>
          <div class="d-flex align-items-center">
            <label class="form-label me-3" style="width: 180px;">Нечётная неделя:</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="filters.odd"
                @change="onFilterChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="text-center mb-4">
      <button
        id="free-exp"
        class="btn btn-outline-primary"
        style="width: 100%; font-size: 0.9rem;"
        @click="showSchedule"
      >
        Отобразить расписание
      </button>
    </div>

    
    <!-- <div class="local-box-col-select">
      <div class="dropdown addOption local-add-opt" @click="openAddMenu">
        <div class="plus-simbol">+</div>
        <div class="dropdown-content" v-show="showAddMenu">
          <a @click="addEntity('group')">Группа</a>
          <a @click="addEntity('teacher')">Преподаватель</a>
          <a @click="addEntity('classroom')">Аудитория</a>
        </div>
      </div>

     
      <div class="mt-3" v-if="entities.length">
        <div
          v-for="(entity, idx) in entities"
          :key="idx"
          class="alert alert-info d-flex justify-content-between align-items-center"
        >
          <span>
            <b>{{ entityTypeLabel(entity.type) }}:</b> {{ entity.value }}
          </span>
          <button class="btn btn-sm btn-outline-danger" @click="removeEntity(idx)">×</button>
        </div>
      </div>
    </div> -->
    
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Реактивные данные
const entities = ref([])
const showAddMenu = ref(false)
const dateRange = reactive({
  start: '01.12.2025',
  end: '14.12.2025'
})

const filters = reactive({
  both: false,
  even: false,
  odd: true
})

// Методы
const switchWeek = (next) => {
  const [d, m, y] = dateRange.start.split('.').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + (next ? 14 : -14)) // сдвиг на 2 недели

  const newStart = date.toLocaleDateString('ru-RU').replace(/\./g, '.')
  date.setDate(date.getDate() + 13)
  const newEnd = date.toLocaleDateString('ru-RU').replace(/\./g, '.')

  dateRange.start = newStart
  dateRange.end = newEnd
}

const entityTypeLabel = (type) => {
  return { group: 'Группа', teacher: 'Преподаватель', classroom: 'Аудитория' }[type] || type
}

const openAddMenu = () => {
  showAddMenu.value = !showAddMenu.value
}

const addEntity = (type) => {
  const value = prompt(`Введите ${entityTypeLabel(type).toLowerCase()}:`)
  if (value?.trim()) {
    entities.value.push({ type, value: value.trim() })
  }
  showAddMenu.value = false
}

const removeEntity = (index) => {
  entities.value.splice(index, 1)
}

const onFilterChange = () => {
  if (filters.both) {
    filters.even = false
    filters.odd = false
  } else if (!filters.even && !filters.odd) {
    filters.odd = true // по умолчанию нечётная
  }
}

const showSchedule = () => {
  if (entities.value.length === 0) {
    alert('Выберите хотя бы одну группу, преподавателя или аудиторию.')
    return
  }

  // Берём первую сущность для перехода (мультивыбор — в будущем)
  const entity = entities.value[0]
  router.push({
    name: 'ScheduleFull',
    query: {
      type: entity.type,
      value: entity.value,
      dateStart: dateRange.start,
      dateEnd: dateRange.end
    }
  })
}
</script>

<style scoped>
.schedule-combine {
  padding-top: 20px;
}
.dataSet {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}
.box-data {
  display: flex;
  align-items: center;
}
.local-arrow {
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
  width: 200px;
}
.dropdown-content a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: black;
}
.dropdown-content a:hover {
  background: #f0f0f0;
}
.plus-simbol {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #007bff;
  color: white;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
}
</style>