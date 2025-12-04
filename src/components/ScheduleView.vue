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
      v-else-if="!schedule || !schedule.items || Object.keys(schedule.items).length === 0"
      class="alert alert-info"
    >
      Нет данных для отображения
    </div>
    <div v-else>
      <div class="schedule-header mb-4 p-3 border rounded bg-light">
        <h3>
          Расписание
          <span v-if="type === 'group'">группы </span>
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
        <div class="mt-2">
          <router-link to="/" class="text-decoration-none">
            Поиск расписания
          </router-link>
        </div>
      </div>

      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-outline-primary btn-sm">Скачать файл календаря</button>
        <div>
          <a
            href="#"
            class="text-decoration-none"
            :class="{ 'text-muted': mode !== 'compact' }"
            @click.prevent="setView('compact')"
          >
            Компактное
          </a>
          <span class="mx-1">/</span>
          <a
            href="#"
            class="text-decoration-none"
            :class="{ 'text-muted': mode !== 'full' }"
            @click.prevent="setView('full')"
          >
            Полное
          </a>
        </div>
      </div>
      <WeekNavigator
        v-if="mode"
        v-model:week-start="localWeekStart"
        v-model:week-end="localWeekEnd"
        :week-number="schedule.weekNumber"
        :odd="schedule.odd"
      />
      <WeekSchedule v-if="mode === 'full'" :schedule="schedule" />
      <CompactSchedule v-else :schedule="schedule" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import WeekNavigator from "./WeekNavigator.vue";
import WeekSchedule from "./WeekSchedule.vue";
import CompactSchedule from "./CompactSchedule.vue";
import { useScheduleList } from "../composables/useScheduleApi";

const props = defineProps({
  type: { type: String, required: true, validator: v => ["group", "teacher", "classroom"].includes(v) },
  value: { type: String, required: true },
  dateStart: { type: String, default: "" },
  dateEnd: { type: String, default: "" },
  mode: { type: String, default: "full", validator: v => ["full", "compact"].includes(v) }
});

const scheduleType =ref( localStorage.getItem("scheduleType") || "full");


const localWeekStart = ref(props.dateStart || "");
const localWeekEnd = ref(props.dateEnd || "");
const mode = ref(localStorage.getItem("scheduleType") || "full"); 

const { fetchList, schedule, loading, error } = useScheduleList();

const loadSchedule = async () => {
  await fetchList({
    type: props.type,
    value: props.value,
    dateStart: mode.value === "full" ? localWeekStart.value || undefined : props.dateStart || undefined,
    dateEnd: mode.value === "full" ? localWeekEnd.value || undefined : undefined,
    mode: mode.value
  });
};

onMounted(() => {
  loadSchedule();
});

watch([localWeekStart, localWeekEnd], () => {
  if (mode.value === "full") {
    loadSchedule();
  }
});

const setView = (view) => {
  localStorage.setItem("scheduleType", view);
  mode.value = view;
  loadSchedule();
};
</script>

<style scoped>
.schedule-wrapper {
  margin-top: 20px;
}
</style>

