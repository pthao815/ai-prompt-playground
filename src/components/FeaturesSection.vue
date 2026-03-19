<template>
  <section class="px-6 py-24 max-w-7xl mx-auto">

    <!-- Section header -->
    <div class="text-center mb-16">
      <p class="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
        Core Features
      </p>
      <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
        Everything You Need to Go From
        <span class="text-purple-400">Guessing</span> to
        <span class="text-purple-400">Mastering</span>
      </h2>
    </div>

    <!-- Feature cards grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="group relative p-8 rounded-2xl border border-[#2a2a3e]
               bg-[#13131f] hover:border-purple-500/40
               hover:bg-[#16162a]
               transition-all duration-300
               hover:shadow-[0_0_40px_rgba(170,59,255,0.08)]"
      >
        <!-- Icon wrapper -->
        <div
          class="w-12 h-12 mb-6 rounded-xl flex items-center justify-center
                 bg-purple-500/10 border border-purple-500/20
                 group-hover:bg-purple-500/20 transition-colors duration-300"
        >
          <span class="text-2xl" :aria-label="feature.iconLabel">{{ feature.icon }}</span>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-white mb-3 tracking-tight">
          {{ feature.title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-400 text-sm leading-relaxed mb-4">
          {{ feature.description }}
        </p>

        <!-- Benefit callout -->
        <div class="pt-4 border-t border-[#2a2a3e]">
          <p class="text-sm text-purple-300 font-medium leading-relaxed">
            ⚡ {{ feature.benefit }}
          </p>
        </div>

        <!-- Corner accent -->
        <div
          class="absolute top-0 right-0 w-20 h-20 rounded-2xl overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            class="absolute top-0 right-0 w-full h-full
                   bg-gradient-to-bl from-purple-500/5 to-transparent
                   group-hover:from-purple-500/10 transition-all duration-300"
          />
        </div>

      </article>
    </div>

  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: '⚡',
    iconLabel: 'lightning bolt',
    title: 'Instant Prompt Testing',
    description:
      'Fire any prompt across multiple AI models simultaneously — GPT, Claude, Gemini — and see exactly what works, side by side.',
    benefit:
      'Stop wasting hours iterating in the dark. Get crystal-clear results instantly so you can ship with confidence, not guesswork.',
  },
  {
    icon: '📚',
    iconLabel: 'books',
    title: 'Smart Prompt Library',
    description:
      'Save, organize, and version every prompt you build. Access a curated library of battle-tested templates engineered for real-world use cases.',
    benefit:
      'Your best prompts, always one click away. Never rebuild from scratch — unlock a compounding advantage with every session.',
  },
  {
    icon: '📊',
    iconLabel: 'bar chart',
    title: 'Performance Analytics',
    description:
      'Score, compare, and visualize prompt performance with built-in metrics. Understand output quality, token efficiency, and consistency at a glance.',
    benefit:
      'Gut feelings don\'t scale. Data does. Turn prompt engineering into a repeatable superpower with evidence-backed decisions.',
  },
]
</script>
