<template>
  <div class="schedule-widget" style="display: block !important;">
    <div class="schedule-body" style="display: block !important;">
      <div class="week-schedule schedule-container week-container active" style="padding: 5px">
        <div class="row local-row-2">
          <div class="col local-col-1-2" style="flex: 0 0 8%; max-width: 8%; overflow: hidden; border: #dedede solid 1px;">День</div>
          <div class="col print-full" style="flex: 0 0 88%; max-width: 88%;">
            <div class="row table-schedule">
              <div class="col l-od-cont" style="flex: 0 0 14%; max-width: 14%;">Время</div>
              <div :class="{ 'local-act': props.schedule.odd === 1 }" class="col l-od-1"
                style="flex: 0 0 43%; max-width: 43%;">
                Нечётная ({{ props.schedule.weekNumber }})
              </div>
              <div :class="{ 'local-act': props.schedule.odd === 2 }" class="col l-od-2"
                style="flex: 0 0 43%; max-width: 43%;">
                Чётная ({{ weekNumberSecond }})
              </div>
            </div>
          </div>
          <div class="col local-col-1-2 no-print" style="flex: 0 0 4%; max-width: 4%; border: #dedede solid 1px;"></div>
        </div>


        <div v-for="(dayData, dayName) in props.schedule.items" :key="dayName" class="row local-row">
          <div class="col local-col-1 pr-0 bl-vanish" style="flex: 0 0 4%; max-width: 4%; line-height: 1">
            {{ getDayName(dayName) }}
          </div>
          <div class="col local-col-1 pr-0 br-vanish" style="flex: 0 0 4%; max-width: 4%;">
            <span class="no-print">{{ getDateFromItemValue(dayName, 0) }}</span>
          </div>
          <div class="col-10 print-full" style="flex: 0 0 88%; max-width: 88%;">
            <div class="row" v-for="(timeKey, idx) in timeKeys" :key="idx">
              <div class="col local-col-2" style="flex: 0 0 14%; max-width: 14%;">
                {{ timeSlots[idx] }}
              </div>
              <div class="col l-od-3 table-schedule">
                <p v-if="dayData[0] && dayData[0][timeKey]" class="m-0" v-html="renderLesson(dayData[0][timeKey])"></p>
                <p v-else class="m-0"><br /></p>
              </div>
              <div class="col l-od-3 table-schedule">
                <p v-if="dayData[1] && dayData[1][timeKey]" class="m-0" v-html="renderLesson(dayData[1][timeKey])"></p>
                <p v-else class="m-0"><br /></p>
              </div>
            </div>
          </div>
          <div class="col local-col-1 local-col-1-reverse pr-0 no-print" style="flex: 0 0 4%; max-width: 4%;">
            <span class="no-print">{{ getDateFromItemValue(dayName, 1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  schedule: { type: Object, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true }
})

const router = useRouter()

const weekNumberSecond = computed(() => props.schedule.weekNumberSecond || props.schedule.weekNumber + 1)

const timeSlots = [
  '08:10–09:45',
  '09:55–11:30',
  '11:40–13:15',
  '13:35–15:10',
  '15:20–16:55',
  '17:05–18:40'
]
const timeKeys = ['08:10', '09:55', '11:40', '13:35', '15:20', '17:05']

const getDayName = (value) => {
  if (!value || typeof value !== 'string') return ''
  return value.split(' ')[0] || ''
}

const getDateFromItemValue = (value, offset = 0) => {
  if (!value || typeof value !== 'string') return ''
  const match = value.match(/(\d{4})-(\d{2})-(\d{2})\/(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''
  const idx = 3 + offset * 3
  return `${match[idx]}.${match[idx - 1]}.${match[idx - 2]}`
}

const renderLesson = (lesson) => {
  if (!lesson || !lesson.discipline?.length) return '—'

  let html = lesson.discipline.join(', ')
  if (lesson.load) html += ` <small>${lesson.load}</small>`

  if (lesson.teacher?.length) {
    const links = lesson.teacher.map(t =>
      `<a href="${buildLink('teacher', t)}">${t}</a>`
    ).join(', ')
    html += `<br>${links}`
  }

  if (lesson.classroom?.length) {
    const links = lesson.classroom.map(c =>
      `<a href="${buildLink('classroom', c)}">${c}</a>`
    ).join(', ')
    html += `<br>${links}`
  }

  return html
}

const buildLink = (type, value) => {
  return `/psuti/schedule-open/list?type=${type}&value=${encodeURIComponent(value)}&dateStart=${props.schedule.week_start}&dateEnd=${props.schedule.week_end}`
}

const setScheduleType = (view) => {
  router.push({
    name: view === 'compact' ? 'ScheduleCompact' : 'ScheduleFull',
    query: {
      type: props.type,
      value: props.value,
      dateStart: props.schedule.week_start,
      dateEnd: props.schedule.week_end
    }
  })
}

const switchWeek = (next) => {
  const [d, m, y] = props.schedule.week_start.split('.').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + (next ? 14 : -14))

  const newStart = date.toLocaleDateString('ru-RU').replace(/\./g, '.')
  date.setDate(date.getDate() + 6)
  const newEnd = date.toLocaleDateString('ru-RU').replace(/\./g, '.')

  router.push({
    name: 'ScheduleCompact',
    query: {
      type: props.type,
      value: props.value,
      dateStart: newStart,
      dateEnd: newEnd
    }
  })
}
</script>

<style scoped>
.schedule-widget {
  margin-top: 20px;
}

.local-row {
  text-align: center;
  font-size: 12px;
  border: #afafaf solid 1px;
  padding: 0;
}

.local-col-1 {
  border: #dedede solid 1px;
  padding: 0 5px 0 0;
  writing-mode: tb-rl;
  transform: rotate(180deg);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.local-col-2 {
  border: #dedede solid 1px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
}

.local-act {
  background-color: rgba(51, 122, 183, 0.15) !important;
  border: #8ab4f8 dashed 1px !important;
  font-weight: bolder !important;
}

.l-btn-arrow {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
  padding: 6px 0;
  justify-content: center;
}

.input-group.date {
  width: 100%;
}

.input-group.date input,
.input-group.date .input-group-text {
  border-radius: 0;
}

.table-schedule {
  border: 1px solid #dee2e6;
}
</style>