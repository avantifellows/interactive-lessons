<script setup>
import Application from "../physics/motion/Application.js";
const props = defineProps({
  name: String,
});
const canvasName = `canvas-${props.name}`;
onMounted(() => {
  console.log(document.getElementById(canvasName));
  const app = new Application({
    canvas: document.getElementById(canvasName),
  });
  console.log(app);
});
</script>

<template>
  <canvas :id="canvasName" class="fixed top-0 left-0 outline-0"></canvas>
</template>

<route lang="yaml">
meta:
  layout: experience
</route>
