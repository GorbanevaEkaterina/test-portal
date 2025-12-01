<template>
  <div class="schedule-wrapper">
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-2">Загрузка расписания...</p>
    </div>
    <div
      v-else-if="
        !schedule || !schedule.items || Object.keys(schedule.items).length === 0
      "
      class="alert alert-info"
    >
      Нет данных для отображения
    </div>
    <div v-else>
      <div class="schedule-header mb-4 p-3 border rounded bg-light">
        <h3>
          Расписание
          <span v-if="type === 'group'">группы</span>
          <span v-else-if="type === 'teacher'">преподавателя</span>
          <span v-else-if="type === 'classroom'">аудитории</span>
          <b>{{ value }}</b>
        </h3>
        <p class="mb-1">
          Неделя № <b>{{ schedule.weekNumber }}</b>
          <span v-if="schedule.odd === 1" class="text-info">(Нечётная)</span>
          <span v-if="schedule.odd === 2" class="text-success">(Чётная)</span>
        </p>
        <p class="mb-0">
          Период: {{ schedule.week_start }} – {{ schedule.week_end }}
        </p>
      </div>

      <WeekNavigator
        v-model:week-start="localWeekStart"
        v-model:week-end="localWeekEnd"
        :week-number="schedule.weekNumber"
        :odd="schedule.odd"
      />
      <WeekSchedule v-if="schedule && schedule.items" :schedule="schedule" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import WeekNavigator from "./WeekNavigator.vue";
import WeekSchedule from "./WeekSchedule.vue";
import { useScheduleList } from "../composables/useScheduleApi";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ["group", "teacher", "classroom"].includes(v),
  },
  value: { type: String, required: true },
  dateStart: { type: String, default: "" },
  dateEnd: { type: String, default: "" },
});

const localWeekStart = ref(props.dateStart || "");
const localWeekEnd = ref(props.dateEnd || "");
const { fetchList, schedule, loading, error } = useScheduleList();

const loadSchedule = async () => {
  await fetchList({
    type: props.type,
    value: props.value,
    dateStart: localWeekStart.value || undefined,
    dateEnd: localWeekEnd.value || undefined,
  });
};

onMounted(() => {
  loadSchedule();
});

watch([localWeekStart, localWeekEnd], () => {
  loadSchedule();
});
</script>

<style scoped>
.schedule-wrapper {
  margin-top: 20px;
}
</style>
