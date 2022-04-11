<script setup lang="ts">
// https://github.com/vueuse/head
useHead({
  title: "Interactive Lessons",
  meta: [
    {
      name: "description",
      content: "Interactive 3d lessons spanning across STEM subjects",
    },
  ],
});
</script>

<template>
  <RouterView />
</template>
