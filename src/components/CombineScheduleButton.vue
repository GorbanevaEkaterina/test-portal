<template>
  <button @click="goToCombine" class="btn btn-outline-primary">
    Открыть совмещённое расписание
  </button>
</template>

<script setup>
const goToCombine = () => {
  window.location.href = "/psuti/schedule-open/combine";
};
</script>
