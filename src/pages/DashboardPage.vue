<template>
  <div class="min-h-screen pt-16">

    <!-- Top bar -->
    <div class="border-b border-[#2a2a3e] bg-[#0f0f1c]">
      <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-white">
            Welcome back, {{ auth.user?.name.split(' ')[0] }} 👋
          </h1>
          <p class="text-gray-500 text-sm mt-0.5">
            Ready to craft something powerful today?
          </p>
        </div>

        <!-- Plan badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                 border"
          :class="auth.user?.plan === 'pro'
            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            : 'bg-[#1a1a2e] border-[#2a2a3e] text-gray-400'"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="auth.user?.plan === 'pro' ? 'bg-purple-400' : 'bg-gray-500'"
          />
          {{ auth.user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan' }}
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Stats row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div
          v-for="stat in dashboardStats"
          :key="stat.label"
          class="bg-[#13131f] border border-[#2a2a3e] rounded-xl p-5
                 hover:border-purple-500/20 transition-colors duration-200"
        >
          <p class="text-2xl font-bold text-white mb-1">{{ stat.value }}</p>
          <p class="text-xs text-gray-500">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Prompt playground panel -->
        <div class="lg:col-span-2 bg-[#13131f] border border-[#2a2a3e] rounded-2xl overflow-hidden">

          <div class="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3e]">
            <h2 class="text-white font-semibold">Prompt Playground</h2>
            <div class="flex items-center gap-2">
              <select
                v-model="playground.selectedModel"
                class="text-xs text-gray-300 bg-[#0d0d1a] border border-[#2a2a3e]
                       rounded-lg px-3 py-1.5 outline-none focus:border-purple-500/50
                       cursor-pointer"
              >
                <option v-for="m in models" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Your Prompt
              </label>
              <textarea
                v-model="playground.prompt"
                rows="5"
                placeholder="Write a prompt and hit Run to see the magic…"
                class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600
                       bg-[#0d0d1a] border border-[#2a2a3e] hover:border-[#3a3a4e]
                       focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                       outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600">
                {{ playground.prompt.length }} chars
                · ~{{ playground.tokenCount }} tokens
              </p>
              <button
                type="button"
                :disabled="!playground.canGenerate"
                class="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold
                       text-white bg-purple-600 hover:bg-purple-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 cursor-pointer"
                @click="playground.generate"
              >
                <svg v-if="playground.isRunning" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ playground.isRunning ? 'Running…' : '▶ Run' }}
              </button>
            </div>

            <!-- Output -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="playground.output" class="mt-2">
                <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Output
                </label>
                <div class="relative px-4 py-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a3e]">
                  <p class="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{{ playground.output }}</p>
                  <button
                    type="button"
                    class="absolute top-3 right-3 text-xs text-gray-600 hover:text-gray-400
                           transition-colors cursor-pointer"
                    @click="copyOutput"
                  >
                    {{ copied ? '✓ Copied' : 'Copy' }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Sidebar: saved prompts + quick actions -->
        <div class="space-y-6">

          <!-- Quick actions -->
          <div class="bg-[#13131f] border border-[#2a2a3e] rounded-2xl p-6">
            <h2 class="text-white font-semibold mb-4">Quick Start</h2>
            <div class="space-y-2">
              <button
                v-for="template in promptTemplates"
                :key="template.label"
                type="button"
                class="w-full text-left px-4 py-3 rounded-xl text-sm
                       border border-[#2a2a3e] hover:border-purple-500/30
                       hover:bg-purple-500/5 text-gray-300 hover:text-white
                       transition-all duration-200 cursor-pointer group"
                @click="playground.prompt = template.prompt"
              >
                <span class="mr-2">{{ template.icon }}</span>
                {{ template.label }}
                <span class="ml-auto opacity-0 group-hover:opacity-100 text-purple-400 text-xs
                             transition-opacity float-right mt-0.5">Use →</span>
              </button>
            </div>
          </div>

          <!-- Account summary -->
          <div class="bg-[#13131f] border border-[#2a2a3e] rounded-2xl p-6">
            <h2 class="text-white font-semibold mb-4">Your Account</h2>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          bg-gradient-to-br from-purple-600 to-violet-400
                          text-white font-bold text-sm">
                {{ auth.user?.avatarInitials }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ auth.user?.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
              </div>
            </div>

            <div v-if="auth.user?.plan === 'free'"
                 class="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p class="text-xs text-purple-300 font-medium mb-1">Free Plan</p>
              <div class="w-full bg-[#2a2a3e] rounded-full h-1.5 mb-1">
                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 30%" />
              </div>
              <p class="text-xs text-gray-500">15 / 50 runs used this month</p>
            </div>

            <button
              type="button"
              class="w-full py-2 px-4 rounded-xl text-sm font-medium
                     text-red-400 border border-red-500/20 hover:bg-red-500/10
                     hover:border-red-500/40 transition-all duration-200 cursor-pointer"
              @click="handleLogout"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlaygroundStore, MODELS } from '../stores/playground'

const router = useRouter()
const auth = useAuthStore()
const playground = usePlaygroundStore()

const models = MODELS
const copied = ref(false)

const dashboardStats = [
  { label: 'Prompts run this month', value: '15' },
  { label: 'Prompts saved', value: '4' },
  { label: 'Avg. quality score', value: '8.2' },
  { label: 'Models tested', value: '2' },
]

const promptTemplates = [
  {
    icon: '✍️',
    label: 'Blog post outline',
    prompt: 'Create a detailed blog post outline about [topic]. Include an engaging hook, 5 main sections with subpoints, and a call-to-action conclusion.',
  },
  {
    icon: '🐛',
    label: 'Debug my code',
    prompt: 'Review the following code and identify any bugs, performance issues, or best-practice violations. Explain each issue and provide a corrected version:\n\n[paste your code here]',
  },
  {
    icon: '📧',
    label: 'Cold email',
    prompt: 'Write a personalized cold email to [name] at [company] about [offer]. Keep it under 100 words. Focus on their pain point, your unique value, and one clear CTA.',
  },
  {
    icon: '🧠',
    label: "Explain like I'm 5",
    prompt: 'Explain [complex topic] to a 5-year-old using a simple analogy, short sentences, and no jargon. Make it memorable and fun.',
  },
]

async function copyOutput() {
  await navigator.clipboard.writeText(playground.output)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
