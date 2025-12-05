<template>
  <select id="department-select" v-model="localDepartment" class="form-control local-t">
    <option value="">Выберите кафедру</option>
    <option v-for="dept in departments" :key="dept" :value="dept">
      {{ dept }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  departments: {
    type: Array,
    required: true,
    default: () => [],
  },
  department: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:department"]);

const localDepartment = computed({
  get() {
    return props.department;
  },
  set(value) {
    emit("update:department", value);
  },
});
</script>
