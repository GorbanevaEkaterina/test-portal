<template>
  <select
    id="faculty-select"
    v-model="localFaculty"
    class="form-control local-t"
  >
    <option value="">Выберите факультет</option>
    <option
      v-for="item in sortedFaculties"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  faculties: {
    type: [Array, null],
    required: true,
    default: () => [],
  },
  faculty: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:faculty"]);

const localFaculty = computed({
  get() {
    return props.faculty;
  },
  set(value) {
    emit("update:faculty", value);
  },
});

const sortedFaculties = computed(() => {
  const faculties = props.faculties || [];

  const list = faculties.map((f) => {
    const label = f.charAt(0).toUpperCase() + f.slice(1);
    const match = f.match(/факультет\s*№\s*(\d+)/i);
    const order = match ? parseInt(match[1], 10) : 999;
    return { value: f, label, order };
  });

  return list.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.value.localeCompare(b.value, "ru");
  });
});
</script>
