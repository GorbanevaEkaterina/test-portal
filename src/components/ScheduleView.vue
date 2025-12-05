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
    <div v-else-if="!schedule || !schedule.items || Object.keys(schedule.items).length === 0" class="alert alert-info">
      Нет данных для отображения
    </div>
    <div class="content" v-else>
      <div class="schedule-header mb-4 p-3 border rounded bg-light">
        <h3>Расписание
          <span v-if="type === 'group'">группы&nbsp; </span>
          <span v-else-if="type === 'teacher'">преподавателя&nbsp;</span>
          <span v-else-if="type === 'classroom'">аудитории&nbsp;</span>
          <b>{{ value }}</b>
        </h3>
        <p class="mb-1">
          Неделя № <b>{{ schedule.weekNumber }}&nbsp;</b>
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
          <a href="#" class="text-decoration-none" :class="{ 'text-muted': mode !== 'compact' }"
            @click.prevent="setView('compact')">
            Компактное
          </a>
          <span class="mx-1">/</span>
          <a href="#" class="text-decoration-none" :class="{ 'text-muted': mode !== 'full' }"
            @click.prevent="setView('full')">
            Полное
          </a>
        </div>
      </div>
      <WeekNavigator v-model:week-start="localWeekStart" v-model:week-end="localWeekEnd"
        :week-number="schedule.weekNumber" :odd="schedule.odd" :mode="mode" />
      <WeekSchedule v-if="mode === 'full'" :schedule="schedule" :type="type" :value="value" />
      <CompactSchedule v-else :schedule="schedule" :type="type" :value="value" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
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


const mode = ref(localStorage.getItem("scheduleType") || "full");

const localWeekStart = ref(props.dateStart || "");
const localWeekEnd = ref(props.dateEnd || "");

const { fetchList, schedule, loading, error } = useScheduleList();

const loadSchedule = async () => {
  const params = {
    type: props.type,
    value: props.value,
    mode: mode.value
  };


  if (localWeekStart.value) {
    params.dateStart = localWeekStart.value;
  }

  if (localWeekEnd.value) {
    params.dateEnd = localWeekEnd.value;
  }

  await fetchList(params);
};


onMounted(() => {
  loadSchedule();
});


watch([localWeekStart, localWeekEnd], () => {
  loadSchedule();
}, { deep: true });


watch(mode, (newMode, oldMode) => {
  localStorage.setItem("scheduleType", newMode);


  nextTick(() => {
    console.log('Mode change processed, waiting for date updates...');
  });
});


watch(() => schedule.value, (newSchedule) => {
  if (newSchedule && newSchedule.week_start && newSchedule.week_end) {

    if (localWeekStart.value !== newSchedule.week_start) {
      localWeekStart.value = newSchedule.week_start;
    }

    if (localWeekEnd.value !== newSchedule.week_end) {
      localWeekEnd.value = newSchedule.week_end;
    }
  }
}, { deep: true });

const setView = (view) => {
  mode.value = view;
};

const parseDate = (str) => {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
};
</script>

<style scoped>
.schedule-wrapper {
  margin-top: 20px;
}

.schedule-header {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.alert {
  margin: 20px 0;
}

.text-decoration-none:hover {
  text-decoration: underline !important;
}

.btn-outline-primary {
  border-color: #0d6efd;
  color: #0d6efd;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.text-info {
  color: #0dcaf0 !important;
}

.text-success {
  color: #198754 !important;
}

.text-muted {
  color: #6c757d !important;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>