<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else class="wrapper">
    <div class="row">
      <div class="col">
        <div class="label-btn">
          <h3>Расписание</h3>
          <div class="display-icon-link text-right" style="margin-bottom: 8px">
            <a
              href="/psuti/schedule-open/classrooms"
              class="icon-link btn btn-outline-secondary local-t"
              style="margin-top: 0; width: 65px"
            >
              <span class="fa fa-users fa-lg" aria-hidden="true"></span>
            </a>
          </div>
        </div>
        <label for="schedule-type-select">Выберите расписание для отображения:</label>
      </div>
      <div class="col display-link-class text-right">
        <a href="/psuti/schedule-open/classrooms">
          <h5>Занятость аудиторий</h5>
        </a>
      </div>
    </div>

    <div class="row" style="margin-top: 10px">
      <div class="col-lg-4 select-container">
        <select v-model="currentSelect" class="form-control local-t" id="schedule-type-select">
          <option value="">Выберите тип расписания</option>
          <option value="Groups">По факультетам</option>
          <option value="Teachers">По кафедрам</option>
          <option value="GroupSearch">Поиск по названию группы</option>
          <option value="TeachersSearch">Поиск по ФИО преподавателя</option>
          <option value="Combine">Совмещённое расписание</option>
        </select>
      </div>

      <div v-if="currentSelect === 'Groups'" class="col-lg-4">
        <FacultySelector
          v-model:faculty="currentSelectFaculty"
          :faculties="faculties"
        />
      </div>

      <div v-if="currentSelect === 'Teachers'" class="col-lg-4">
        <DepartmentSelector
          v-model:department="currentSelectDepartment"
          :departments="departments"
        />
      </div>

      <div v-if="['GroupSearch', 'TeachersSearch'].includes(currentSelect)" class="col-lg-4">
        <SearchInput
          v-model:query="currentSearchQuery"
          @search="currentSearchFinal = $event"
        />
      </div>

      <div v-if="currentSelect === 'Combine'" class="col-lg-4">
        <CombineScheduleButton />
      </div>
    </div>

    <div id="tree_stage" class="treeview" style="user-select: none">
      <div class="list-group">
        <GroupList
          v-if="currentSelect === 'Groups' && currentSelectFaculty"
          :groups="filteredGroups"
          :has-extramural="hasExtramural"
        />

        <TeacherList
          v-if="currentSelect === 'Teachers' && currentSelectDepartment"
          :teachers="filteredTeachers"
          :department="currentSelectDepartment"
        />

       
        <div v-if="currentSelect === 'GroupSearch'" class="row" style="padding: 25px 15px 15px">
          <div
            v-for="group in groups"
            v-show="matchSearch(group)"
            :key="group"
            class="col-6 col-xl-3 col-lg-3 col-md-4 local-list-item-a"
            @click="goToSchedule('group', group)"
            style="cursor: pointer"
          >
            <span class="list-group-item node-tree_stage local-list-item">{{ group }}</span>
          </div>
        </div>

       
        <div v-if="currentSelect === 'TeachersSearch'" class="row" style="padding: 25px 15px 15px">
          <div
            v-for="teacher in teachers"
            v-show="matchSearch(teacher)"
            :key="teacher"
            class="col-6 col-xl-3 col-lg-3 col-md-4 local-col-6-1"
            @click="goToSchedule('teacher', teacher)"
            style="cursor: pointer"
          >
            <span class="list-group-item node-tree_stage local-list-item">{{ teacher }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import FacultySelector from './FacultySelector.vue'
import DepartmentSelector from './DepartmentSelector.vue'
import SearchInput from './SearchInput.vue'
import CombineScheduleButton from './CombineScheduleButton.vue'
import GroupList from './GroupList.vue'
import TeacherList from './TeacherList.vue'
import { useScheduleIndex } from '../composables/useScheduleApi'


const router = useRouter()


const { data, loading, error, fetchIndex } = useScheduleIndex()


const currentSelect = ref('')
const currentSelectFaculty = ref('')
const currentSelectDepartment = ref('')
const currentSearchQuery = ref('')
const currentSearchFinal = ref('')


const allGroups = computed(() => data.value?.groups || [])
const allTeachers = computed(() => data.value?.teacher || [])


const faculties = computed(() => {
  const uniques = [...new Set(allGroups.value.map(g => g.subdivision))]
  return uniques.sort((a, b) => {
    const numA = parseInt(a.match(/Факультет\s*№\s*(\d+)/i)?.[1] || 999)
    const numB = parseInt(b.match(/Факультет\s*№\s*(\d+)/i)?.[1] || 999)
    return numA - numB
  })
})

const departments = computed(() =>
  [...new Set(allTeachers.value.map(t => t.department))].sort()
)

const groups = computed(() => [...new Set(allGroups.value.map(g => g.group))])
const teachers = computed(() => [...new Set(allTeachers.value.map(t => t.teacher.trim()))])


const filteredGroups = computed(() =>
  allGroups.value.filter(g => g.subdivision === currentSelectFaculty.value)
)
const filteredTeachers = computed(() =>
  allTeachers.value.filter(t => t.department === currentSelectDepartment.value)
)

const hasExtramural = computed(() =>
  allGroups.value.some(g => g.subdivision === currentSelectFaculty.value && g.study_form === 'Заочная')
)


const matchSearch = (item) => {
  const query = currentSearchFinal.value.toLowerCase()
  return item.toLowerCase().includes(query)
}


const goToSchedule = (type, value) => {
  router.push({ path: '/schedule', query: { type, value } })
}


onMounted(() => {
  fetchIndex()
})


watch(currentSelect, (val) => {
  if (val === 'Combine') {
    window.location.href = '/psuti/schedule-open/combine'
  }
})
</script>