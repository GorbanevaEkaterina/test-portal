<template>
  <div class="input-group">
    <input v-model="localQuery" type="text" class="form-control" placeholder="Введите строку поиска..." />
    <button @click="onSearch" class="btn btn-outline-secondary">Найти</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  query: { type: String, default: "" },
});
const emit = defineEmits(["update:query", "search"]);

const localQuery = ref(props.query);

watch(localQuery, (val) => emit("update:query", val));

const onSearch = () => {
  emit("search", localQuery.value);
};
</script>
