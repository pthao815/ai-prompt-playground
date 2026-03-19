<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-[#0d0d1a]/90 backdrop-blur-md border-b border-[#2a2a3e] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
      : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <a href="#" class="text-white font-bold text-xl tracking-tight">
        Prompt<span class="text-purple-400">Lab</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- CTA -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Log in
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white
                 bg-purple-600 hover:bg-purple-500
                 transition-colors duration-200 cursor-pointer"
        >
          Start Free
        </button>

        <!-- Mobile menu toggle -->
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-gray-400 hover:text-white
                 hover:bg-white/5 transition-colors cursor-pointer"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Mobile menu drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-[#2a2a3e] bg-[#0d0d1a]/95 backdrop-blur-md"
      >
        <nav class="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="px-3 py-2.5 rounded-lg text-gray-300 hover:text-white
                   hover:bg-white/5 text-sm transition-colors"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </Transition>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Social Proof', href: '#social-proof' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Pricing', href: '#pricing' },
]
</script>
