<template>
  <div class="row" style="padding: 25px 15px 15px">
    <a
      v-for="teacher in filteredTeachers"
      :key="teacher.teacher"
      :href="`/psuti/schedule-open/list?type=teacher&value=${encodeURIComponent(
        teacher.teacher
      )}`"
      class="col-6 col-xl-3 col-lg-3 col-md-4 local-col-6-1"
    >
      <span class="list-group-item node-tree_stage local-list-item">
        {{ teacher.teacher }}
      </span>
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  teachers: {
    type: Array,
    required: true,
    default: () => [],
  },
  department: {
    type: String,
    required: true,
  },
});

const filteredTeachers = computed(() =>
  props.teachers.filter((t) => t.department === props.department)
);
</script>
