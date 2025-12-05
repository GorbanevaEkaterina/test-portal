<template>
  <div class="row" style="padding: 25px 15px 15px">
    <h4 v-if="!hasExtramural">Очная форма обучения:</h4>
    <div v-for="group in dayGroups" :key="group.group" class="col-6 col-md-4 col-lg-3 col-xl-3"
      @click="goToSchedule('group', group.group)" style="cursor: pointer">
      <span class="list-group-item node-tree_stage local-list-item">
        {{ group.group }}
      </span>
    </div>
  </div>

  <div v-if="hasExtramural" class="row mt-4" style="padding: 0 15px 15px">
    <h4>Заочная форма обучения:</h4>
    <div v-for="group in extramuralGroups" :key="group.group" class="col-6 col-md-4 col-lg-3 col-xl-3"
      @click="goToSchedule('group', group.group)" style="cursor: pointer">
      <span class="list-group-item node-tree_stage local-list-item">
        {{ group.group }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  groups: { type: Array, required: true, default: () => [] },
  hasExtramural: { type: Boolean, required: true }
})

const router = useRouter()

const dayGroups = computed(() =>
  props.groups.filter(g => g.study_form !== 'Заочная')
)

const extramuralGroups = computed(() =>
  props.groups.filter(g => g.study_form === 'Заочная')
)

const goToSchedule = (type, value) => {
  router.push({ path: '/schedule', query: { type, value } })
}
</script>