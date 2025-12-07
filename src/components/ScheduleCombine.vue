<!-- <template>
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
                  <input class="form-control text-center" type="text" :value="`${dateRange.start} - ${dateRange.end}`"
                    readonly />
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
              <input class="form-check-input" type="checkbox" v-model="filters.both" @change="onFilterChange" />
            </div>
          </div>
          <div class="d-flex align-items-center mb-2">
            <label class="form-label me-3" style="width: 180px;">Чётная неделя:</label>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="filters.even" @change="onFilterChange" />
            </div>
          </div>
          <div class="d-flex align-items-center">
            <label class="form-label me-3" style="width: 180px;">Нечётная неделя:</label>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="filters.odd" @change="onFilterChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mb-4">
      <button id="free-exp" class="btn btn-outline-primary" style="width: 100%; font-size: 0.9rem;"
        @click="showSchedule">
        Отобразить расписание
      </button>
    </div>
    <div class="local-box-col-select">
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
    </div>

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
</style> -->

<template>
  <div class="schedule-combine container py-4">
    <header>
      <h2 class="text-center mb-4">Расписание</h2>
    </header>

    <!-- Загрузка данных -->
    <div v-if="indexLoading" class="text-center mb-4">Загрузка справочников...</div>
    <div v-else-if="indexError" class="alert alert-danger text-center mb-4">
      Ошибка загрузки данных: {{ indexError }}
    </div>

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
        :disabled="!entities.length"
      >
        Отобразить расписание
      </button>
    </div>

    <!-- Блок выбора сущностей -->
    <div class="local-box-col-select">
      <div class="input-group mb-3" style="border: 1px solid #ccc; border-radius: 5px; overflow: hidden;">
        <!-- Кнопка "+" с выпадающим меню выбора типа -->
        <div class="input-group-prepend position-relative" @click="toggleTypeMenu">
          <span
            class="input-group-text"
            style="background: #007bff; color: white; cursor: pointer; padding: 0 12px;"
          >
            <i class="fa fa-plus"></i>
          </span>
          <!-- Выпадающее меню выбора типа -->
          <div
            v-show="showTypeMenu"
            ref="typeMenuRef"
            class="dropdown-menu show"
            style="position: absolute; top: 100%; left: 0; z-index: 1001; min-width: 150px;"
          >
            <a class="dropdown-item" @click="selectType('group')">Группа</a>
            <a class="dropdown-item" @click="selectType('teacher')">Преподаватель</a>
            <a class="dropdown-item" @click="selectType('classroom')">Аудитория</a>
          </div>
        </div>

        <!-- Поле ввода с автодополнением -->
        <div class="position-relative w-100">
          <input
            ref="inputRef"
            type="text"
            class="form-control"
            :placeholder="selectedTypeForAdd ? `Введите ${entityTypeLabel(selectedTypeForAdd).toLowerCase()}...` : 'Сначала выберите тип'"
            v-model="searchQuery"
            @focus="showDropdown = true"
            @blur="hideDropdown"
            @keydown.down.prevent="highlightNext"
            @keydown.up.prevent="highlightPrev"
            @keydown.enter.prevent="selectHighlighted"
            :disabled="!selectedTypeForAdd"
          />

          <!-- Выпадающий список значений -->
          <div
            v-show="showDropdown && currentOptions.length > 0"
            ref="dropdownRef"
            class="dropdown-menu show"
            style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1000; max-height: 200px; overflow-y: auto;"
          >
            <a
              v-for="(item, idx) in currentOptions"
              :key="item"
              @click="addEntityFromList(item)"
              class="dropdown-item"
              :class="{ 'active': highlightedIndex === idx }"
              @mouseover="highlightedIndex = idx"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>

      <!-- Список выбранных сущностей -->
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useScheduleIndex } from '../composables/useScheduleApi'

const router = useRouter()

const typeMenuRef = ref(null)
const inputRef = ref(null)
const dropdownRef = ref(null)


const entities = ref([])
const selectedTypeForAdd = ref(null) // null | 'group' | 'teacher' | 'classroom'
const showTypeMenu = ref(false)
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)

const dateRange = reactive({
  start: '01.12.2025',
  end: '14.12.2025'
})

const filters = reactive({
  both: false,
  even: false,
  odd: true
})


const { data: indexData, loading: indexLoading, error: indexError, fetchIndex } = useScheduleIndex()

onMounted(() => {
  fetchIndex()
})


const handleClickOutside = (event) => {
  if (typeMenuRef.value && !typeMenuRef.value.contains(event.target)) {
    showTypeMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})


const entityTypeLabel = (type) => {
  return { group: 'Группа', teacher: 'Преподаватель', classroom: 'Аудитория' }[type] || type
}

const currentOptions = computed(() => {
  if (!indexData.value || !selectedTypeForAdd.value) return []
  const list = {
    group: indexData.value.groups || [],
    teacher: indexData.value.teachers || [],
    classroom: indexData.value.classrooms || []
  }[selectedTypeForAdd.value]

  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return list

  return list.filter(item => item.toLowerCase().includes(query))
})


const toggleTypeMenu = () => {
  showTypeMenu.value = !showTypeMenu.value
}

const selectType = (type) => {
  selectedTypeForAdd.value = type
  searchQuery.value = ''
  showTypeMenu.value = false
  highlightedIndex.value = -1
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

const addEntityFromList = (value) => {
  if (value?.trim()) {
    entities.value.push({
      type: selectedTypeForAdd.value,
      value: value.trim()
    })
  }
  selectedTypeForAdd.value = null
  searchQuery.value = ''
  showDropdown.value = false
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
    highlightedIndex.value = -1
  }, 200)
}

const highlightNext = () => {
  if (currentOptions.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value + 1) % currentOptions.value.length
}

const highlightPrev = () => {
  if (currentOptions.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value - 1 + currentOptions.value.length) % currentOptions.value.length
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && currentOptions.value[highlightedIndex.value]) {
    addEntityFromList(currentOptions.value[highlightedIndex.value])
  } else if (currentOptions.value.length > 0) {
    addEntityFromList(currentOptions.value[0])
  }
}

const removeEntity = (index) => {
  entities.value.splice(index, 1)
}

const switchWeek = (next) => {
  const [d, m, y] = dateRange.start.split('.').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + (next ? 14 : -14))

  const pad = (n) => String(n).padStart(2, '0')
  const format = (dt) => `${pad(dt.getDate())}.${pad(dt.getMonth() + 1)}.${dt.getFullYear()}`

  dateRange.start = format(date)
  date.setDate(date.getDate() + 13)
  dateRange.end = format(date)
}

const onFilterChange = () => {
  if (filters.both) {
    filters.even = false
    filters.odd = false
  } else if (!filters.even && !filters.odd) {
    filters.odd = true
  }
}

const showSchedule = () => {
  if (entities.value.length === 0) {

    return
  }

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
.local-box-col-select .input-group {
  display: flex;
  align-items: stretch;
}

.local-box-col-select .input-group .input-group-prepend {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.dropdown-menu {
  background: white;
  border: 1;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  color: #212529;
  text-decoration: none;
}

.dropdown-item:hover,
.dropdown-item.active {
  background-color: #e9ecef;
}

.form-control:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}
</style>