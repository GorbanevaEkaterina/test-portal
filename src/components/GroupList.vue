<template>
  <div class="row">
    <h4>Очная форма обучения:</h4>
    <div v-for="group in dayGroups" :key="group.group" class="col-6 col-md-4 col-lg-3 col-xl-3">
      <a :href="`/psuti/schedule-open/list?type=group&value=${encodeURIComponent(
        group.group
      )}`" class="local-list-item-a">
        <span class="list-group-item node-tree_stage local-list-item">
          {{ group.group }}
        </span>
      </a>
    </div>
  </div>

  <div v-if="hasExtramural" class="row mt-4" style="padding: 0 15px 15px">
    <h4>Заочная форма обучения:</h4>
    <div v-for="group in extramuralGroups" :key="group.group" class="col-6 col-md-4 col-lg-3 col-xl-3">
      <a :href="`/psuti/schedule-open/list?type=group&value=${encodeURIComponent(
        group.group
      )}`" class="local-list-item-a">
        <span class="list-group-item node-tree_stage local-list-item">
          {{ group.group }}
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  groups: { type: Array, required: true, default: () => [] },
  hasExtramural: { type: Boolean, required: true },
});

const dayGroups = computed(() =>
  props.groups.filter((g) => g.study_form !== "Заочная")
);

const extramuralGroups = computed(() =>
  props.groups.filter((g) => g.study_form === "Заочная")
);
</script>
