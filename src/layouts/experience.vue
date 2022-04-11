<script setup></script>

<template>
  <main>
    <RouterView />
    <nav text-xl mt-2>
      <RouterLink class="icon-btn mx-2" to="/" title="Home">
        <div i-carbon-home />
      </RouterLink>
    </nav>
  </main>
</template>
