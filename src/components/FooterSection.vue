<template>
  <footer class="border-t border-[#2a2a3e] bg-[#0a0a14]">

    <!-- CTA band -->
    <div class="px-6 py-20 text-center border-b border-[#2a2a3e]">
      <div class="max-w-2xl mx-auto">
        <p class="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">
          Don't Wait
        </p>
        <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
          Your next breakthrough prompt is one session away.
        </h2>
        <p class="text-gray-400 mb-8">
          Join 12,500+ builders who already have an unfair advantage.
        </p>
        <button
          type="button"
          class="group inline-flex items-center gap-2
                 px-8 py-4 rounded-xl font-semibold text-base text-white
                 bg-gradient-to-r from-purple-600 to-violet-500
                 hover:from-purple-500 hover:to-violet-400
                 shadow-[0_0_30px_rgba(170,59,255,0.3)]
                 hover:shadow-[0_0_45px_rgba(170,59,255,0.5)]
                 transition-all duration-300 cursor-pointer"
        >
          Try PromptLab Free — No Card Required
          <span class="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>

    <!-- Footer body -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        <!-- Brand -->
        <div class="max-w-xs">
          <p class="text-white font-bold text-xl mb-2">
            Prompt<span class="text-purple-400">Lab</span>
          </p>
          <p class="text-gray-500 text-sm leading-relaxed">
            Built for the builders who believe the future belongs to those
            who know how to speak to AI.
          </p>
        </div>

        <!-- Nav links -->
        <nav class="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer navigation">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-gray-400 hover:text-purple-300 text-sm transition-colors duration-200"
          >
            {{ link.label }}
          </a>
        </nav>

      </div>

      <!-- Bottom bar -->
      <div
        class="mt-12 pt-6 border-t border-[#2a2a3e]
               flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-gray-600 text-xs">
          © 2026 PromptLab, Inc. All rights reserved.
        </p>
        <p class="text-gray-600 text-xs">
          Crafted with precision. Powered by curiosity.
        </p>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Blog', href: '#blog' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
  { label: 'Contact', href: '#contact' },
]
</script>
