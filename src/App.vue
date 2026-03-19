<template>
  <div class="min-h-screen bg-[#0d0d1a] text-gray-300 antialiased">
    <NavBar />
    <RouterView v-slot="{ Component }">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>
