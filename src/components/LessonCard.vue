<template>
  <div class="lesson-card">
    <div class="time">{{ time_start }}–{{ time_end }}</div>
    <div class="discipline">
      <div v-for="(d, idx) in discipline" :key="idx">
        {{ d }}<span v-if="idx < discipline.length - 1">,</span>
      </div>
      <span v-if="load" class="lesson-type">{{ load }}</span>
    </div>
    <div v-if="classroom.length > 0" class="classroom">
      <span
        v-for="(room, idx) in classroom"
        :key="idx"
        class="clickable-link"
        @click="goToSchedule('classroom', room)"
      >
        {{ room }}<span v-if="idx < classroom.length - 1">,</span>
      </span>
    </div>
    <div
      v-else-if="discipline.length > 0 && !isPhysicalCulture()"
      class="classroom warning"
    >
      Дистанционно
    </div>
    <div v-if="group.length > 0" class="group">
      <span v-if="course">{{ course }} курс </span>
      <span
        v-for="(g, idx) in group"
        :key="idx"
        class="clickable-link"
        @click="goToSchedule('group', g)"
      >
        {{ g }}<span v-if="idx < group.length - 1">,</span>
      </span>
    </div>
    <div v-if="teacher.length > 0" class="teacher">
      <span
        v-for="(t, idx) in teacher"
        :key="idx"
        class="clickable-link"
        @click="goToSchedule('teacher', t)"
      >
        {{ t }}<span v-if="idx < teacher.length - 1">,</span>
      </span>
    </div>
    <div v-if="statement_id" class="statement">
      <a
        :href="`/psuti/attendance/page?id=${statement_id}`"
        target="_blank"
        rel="noopener"
      >
        Перейти к ведомости
        <span v-if="statement_open === '1'">(Открыта)</span>
        <span v-else>(Закрыта)</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  time_start: { type: String, required: true },
  time_end: { type: String, required: true },
  discipline: { type: Array, default: () => [] },
  load: { type: String, default: "" },
  classroom: { type: Array, default: () => [] },
  group: { type: Array, default: () => [] },
  teacher: { type: Array, default: () => [] },
  department: { type: String, default: "" },
  course: { type: String, default: "" },
  statement_id: { type: String, default: "" },
  statement_open: { type: String, default: "" },
  weekStart: { type: String, required: true },
  weekEnd: { type: String, required: true },
});

const router = useRouter();

const goToSchedule = (type, value) => {
  router.push({
    path: "/schedule",
    query: { type, value, dateStart: props.weekStart, dateEnd: props.weekEnd },
  });
};

const isPhysicalCulture = () => {
  return props.discipline?.some?.(
    (d) =>
      d?.includes?.("Физическая культура и спорт") ||
      d?.includes?.("Элективные дисциплины по физической культуре и спорту")
  );
};
</script>

<style scoped>
.lesson-card {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.time {
  font-weight: bold;
  font-size: 0.9rem;
}
.lesson-type {
  display: block;
  font-size: 0.85rem;
  color: #666;
}
.warning {
  color: #856404;
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
}
.discipline,
.classroom,
.group,
.teacher,
.statement {
  margin-top: 4px;
  font-size: 0.875rem;
}
a {
  color: #007bff;
  text-decoration: underline;
}
</style>
