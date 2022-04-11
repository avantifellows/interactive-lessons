<script setup>
import useAssets from '~/composables/assets';

const assets = useAssets();
const router = useRouter();
const lessons = [
  {
    title: "Motion",
    description: "Learn about motion",
    thumbnail: "",
    subject: "physics",
    name: "motion",
  },
  {
    title: "Dummy",
    description: "some dummy text",
    thumbnail: "",
    subject: "physics",
    name: "motion",
  },
]

const redirectToLesson = (lesson) => {
  let routeData = router.resolve(`/lessons/${lesson.subject}/${encodeURIComponent(lesson.name)}`)
  window.open(routeData.href, "_blank");
}
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p text-2xl>
        Interactive Lessons
    </p>

    <div py-4 />

    <p>
      <div text opacity-75>What do you want to learn today?</div>
    </p>

    <div class="flex flex-col px-20 pt-10">
      <div class="flex lg:flex-row lg:space-x-2 flex-col px-40">
        <div v-for="lesson in lessons" :key="lesson.title" class="w-full flex">
          <button 
            class="h-full mx-auto hover:shadow-2xl p-2 hover:border-2 hover:border-violet-500 rounded-xl" @click="redirectToLesson(lesson)"
            :id='`button-${lesson.name}`'
          >
            <img
              class="object-scale-down h-64"
              :src="assets[lesson.name]"
            />
            <div id="text" class="bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col">
              <p class="text-2xl font-bold font-serif subpixel-antialiased my-4"> {{ lesson.title }} </p>
              <p class="w-2/3 mx-auto my-4"> {{ lesson.description }} </p>
            </div>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
