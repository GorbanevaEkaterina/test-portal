<template>
  <div class="schedule-body">
    <div
      v-for="(dayLessons, dayName) in schedule.items"
      :key="dayName"
      class="day-container"
    >
      <h4 class="day-name">{{ dayName }}</h4>
      <div class="table-responsive">
        <table class="table table-schedule">
          <thead>
            <tr>
              <th class="table-schedule-hours">Часы</th>
              <th class="table-schedule-discipline">Дисциплина</th>
              <th class="table-schedule-classroom">Аудитория</th>
              <th class="table-schedule-group">Группа</th>
              <th class="table-schedule-teacher">Преподаватель</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(lesson, time) in dayLessons"
              :key="time"
              :class="{
                warning:
                  !lesson.classroom?.length &&
                  lesson.discipline?.length &&
                  !isPhysicalCulture(lesson),
              }"
            >
              <td class="table-schedule-hours">
                {{ lesson.time_start }}–{{ lesson.time_end }}
              </td>
              <td class="table-schedule-discipline">
                <div v-if="lesson.discipline?.length">
                  <div v-for="(d, idx) in lesson.discipline" :key="idx">
                    {{ d }}
                    <span v-if="idx < lesson.discipline.length - 1">,</span>
                  </div>
                  <div v-if="lesson.load" class="lesson-type">
                    {{ lesson.load }}
                  </div>
                </div>
                <div v-else>—</div>
              </td>
              <td class="table-schedule-classroom">
                <template v-if="lesson.classroom?.length">
                  <a
                    v-for="(room, idx) in lesson.classroom"
                    :key="idx"
                    :href="buildLink('classroom', room)"
                  >
                    {{ room }}
                    <span v-if="idx < lesson.classroom.length - 1">,</span>
                  </a>
                </template>
                <span
                  v-else-if="
                    lesson.discipline?.length && !isPhysicalCulture(lesson)
                  "
                  class="remote-warning"
                >
                  Дистанционно
                </span>
                <span v-else>—</span>
              </td>
              <td class="table-schedule-group">
                <span v-if="lesson.course">{{ lesson.course }} курс <br></span>
                <a
                  v-for="(group, idx) in lesson.group"
                  :key="idx"
                  :href="buildLink('group', group)"
                >
                  {{ group }}
                  <span v-if="idx < lesson.group.length - 1">,<br></span>
                </a>
              </td>
              <td class="table-schedule-teacher">
                <a
                  v-for="(teacher, idx) in lesson.teacher"
                  :key="idx"
                  :href="buildLink('teacher', teacher)"
                >
                  {{ teacher }}
                </a>
                <span v-if="!lesson.teacher?.length">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  schedule: { type: Object, required: true },
});

const isPhysicalCulture = (lesson) => {
  return lesson.discipline?.some?.(
    (d) =>
      d.includes("Физическая культура") ||
      d.includes("Элективные дисциплины по физической культуре")
  );
};

const buildLink = (type, value) => {
  return `/psuti/schedule-open/list?type=${type}&value=${encodeURIComponent(
    value
  )}&dateStart=${props.schedule.week_start}&dateEnd=${props.schedule.week_end}`;
};
</script>

<style scoped>
.schedule-body {
  margin-top: 20px;
}
.day-container {
  margin-bottom: 30px;
}
.day-name {
  margin-bottom: 10px;
  font-weight: bold;
}
.table-schedule {
  border-collapse: collapse;
}
.table-schedule th,
.table-schedule td {
  vertical-align: top;
  padding: 8px;
  border: 1px solid #dee2e6;
}
.table-schedule-hours {
  width: 120px;
  white-space: nowrap;
}
.warning {
  background-color: #fff3cd;
}
.remote-warning {
  color: #856404;
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
}
.lesson-type {
  font-size: 0.85rem;
  color: #666;
  margin-top: 4px;
}
a {
  color: #007bff;
  text-decoration: underline;
}
</style>
