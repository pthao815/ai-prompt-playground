<template>
  <section class="px-6 py-24 max-w-3xl mx-auto">

    <!-- Section header -->
    <div class="text-center mb-16">
      <p class="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
        FAQ
      </p>
      <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        Questions? We've Got Straight Answers.
      </h2>
    </div>

    <!-- Accordion list -->
    <div class="space-y-3">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="rounded-xl border overflow-hidden transition-all duration-300"
        :class="openIndex === index
          ? 'border-purple-500/40 bg-[#13131f]'
          : 'border-[#2a2a3e] bg-[#13131f] hover:border-purple-500/20'"
      >
        <!-- Question trigger -->
        <button
          type="button"
          class="w-full flex items-center justify-between gap-4
                 px-6 py-5 text-left cursor-pointer
                 focus-visible:outline-2 focus-visible:outline-purple-500
                 focus-visible:outline-offset-2"
          :aria-expanded="openIndex === index"
          :aria-controls="`faq-answer-${index}`"
          @click="toggle(index)"
        >
          <h3 class="text-white font-semibold text-base sm:text-lg leading-snug">
            {{ item.question }}
          </h3>
          <span
            class="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center
                   text-purple-400 border-purple-500/30
                   transition-transform duration-300"
            :class="openIndex === index ? 'rotate-45 bg-purple-500/20' : ''"
            aria-hidden="true"
          >
            +
          </span>
        </button>

        <!-- Answer panel -->
        <div
          :id="`faq-answer-${index}`"
          class="grid transition-all duration-300 ease-in-out"
          :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          role="region"
        >
          <div class="overflow-hidden">
            <p class="px-6 pb-6 text-gray-400 text-sm sm:text-base leading-relaxed">
              {{ item.answer }}
            </p>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: 'Do I need experience with AI or prompt engineering to get started?',
    answer:
      'Zero experience required. PromptLab is built for everyone from complete beginners to seasoned AI engineers. Our guided templates and visual feedback make the learning curve feel effortless — most users write their first effective prompt within five minutes of signing up.',
  },
  {
    question: 'Which AI models does PromptLab support?',
    answer:
      'We currently support OpenAI GPT-4o, Anthropic Claude, Google Gemini, and Mistral — with new models added regularly. You bring your own API keys, so you stay in control of your usage and costs at all times.',
  },
  {
    question: 'Is there a free plan? What are the limits?',
    answer:
      'Yes. The free plan gives you full access to the core playground, up to 50 prompt runs per month, and 10 saved prompts. No credit card needed to start. Upgrade only when you\'re ready to unlock unlimited power.',
  },
  {
    question: 'How is this different from just using ChatGPT directly?',
    answer:
      'ChatGPT is a consumer chat interface. PromptLab is an engineering environment. You get multi-model comparison, version control, performance scoring, and a structured library — everything a builder needs to craft prompts that are reliable, repeatable, and production-ready.',
  },
  {
    question: 'Is my data and prompt library private?',
    answer:
      'Absolutely. Your prompts are private by default and encrypted at rest. We never train on your data, we never share it, and you can export or delete everything at any time. Your intellectual property stays yours.',
  },
  {
    question: 'Can I use PromptLab for my team or company?',
    answer:
      'Yes. Our Pro and Team plans support collaborative workspaces, shared prompt libraries, role-based access, and usage dashboards. Whether you\'re a solo hacker or a 50-person AI team, PromptLab scales with you.',
  },
  {
    question: 'How quickly can I see real results?',
    answer:
      'Most users notice a dramatic improvement in their prompt quality within the first session. The analytics dashboard surfaces exactly what\'s working and what isn\'t — no interpretation required. Progress you can see instantly, not someday.',
  },
  {
    question: 'What if I decide PromptLab isn\'t right for me?',
    answer:
      'Cancel any paid plan within 14 days for a full, no-questions-asked refund. We\'re confident you\'ll stay — but we\'d rather earn your trust than trap you. That\'s a promise, not a policy.',
  },
]
</script>
