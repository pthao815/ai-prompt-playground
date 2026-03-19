<template>
  <section class="px-6 py-24 bg-[#0f0f1c] border-y border-[#2a2a3e]">
    <div class="max-w-7xl mx-auto">

      <!-- Section header -->
      <div class="text-center mb-16">
        <p class="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
          Social Proof
        </p>
        <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Trusted by Builders Who Ship
        </h2>
      </div>

      <!-- Testimonials grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <blockquote
          v-for="t in testimonials"
          :key="t.name"
          class="relative p-8 rounded-2xl border border-[#2a2a3e] bg-[#13131f]
                 flex flex-col"
        >
          <!-- Stars -->
          <div class="flex gap-1 mb-5" aria-label="5 out of 5 stars">
            <span
              v-for="i in 5"
              :key="i"
              class="text-yellow-400 text-sm"
            >★</span>
          </div>

          <!-- Quote -->
          <p class="text-gray-300 text-sm leading-relaxed flex-1 mb-6 italic">
            "{{ t.quote }}"
          </p>

          <!-- Author -->
          <footer class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-purple-600 to-violet-400
                     text-white font-bold text-sm shrink-0"
            >
              {{ t.initials }}
            </div>
            <div>
              <cite class="not-italic font-semibold text-white text-sm">{{ t.name }}</cite>
              <p class="text-gray-500 text-xs mt-0.5">{{ t.role }}</p>
            </div>
          </footer>

          <!-- Quote mark decoration -->
          <span
            class="absolute top-6 right-8 text-5xl text-purple-500/10 font-serif leading-none select-none"
            aria-hidden="true"
          >"</span>
        </blockquote>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2a2a3e] rounded-2xl overflow-hidden">
        <div
          v-for="stat in stats"
          :key="stat.number"
          class="bg-[#0d0d1a] px-8 py-10 text-center"
        >
          <p class="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            <span class="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              {{ stat.number }}
            </span>
          </p>
          <p class="text-gray-400 text-sm leading-relaxed max-w-[180px] mx-auto">
            {{ stat.label }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    quote:
      'I cut my prompt iteration time by 80%. This playground is the first tool that actually made me feel like I know what I\'m doing with AI.',
    name: 'Marcus Tran',
    role: 'Senior Full-Stack Developer, Y Combinator Alum',
    initials: 'MT',
  },
  {
    quote:
      'I launched my AI micro-SaaS in 3 weeks. PromptLab was the unfair advantage I didn\'t know I was missing. Absolutely essential for indie hackers.',
    name: 'Priya Nair',
    role: 'Indie Hacker & Founder, $12k MRR',
    initials: 'PN',
  },
  {
    quote:
      'As someone just learning AI, I was overwhelmed. PromptLab made prompt engineering feel approachable, logical, and — dare I say it — fun.',
    name: 'James Okafor',
    role: 'Junior Developer & AI Learner',
    initials: 'JO',
  },
]

const stats = [
  {
    number: '47,000+',
    label: 'Prompts tested every day on the platform',
  },
  {
    number: '3.2×',
    label: 'Average improvement in prompt output quality reported by active users',
  },
  {
    number: '12,500+',
    label: 'Developers, hackers, and AI learners already building with PromptLab',
  },
]
</script>
