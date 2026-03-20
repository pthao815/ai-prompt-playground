<template>
  <div class="min-h-screen pt-16">

    <!-- Top bar -->
    <div class="border-b border-[#2a2a3e] bg-[#0f0f1c]">
      <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-white">Prompt Playground</h1>
          <p class="text-gray-500 text-sm mt-0.5">Experiment with prompts and roles</p>
        </div>

        <!-- Model selector -->
        <select
          v-model="store.selectedModel"
          class="text-xs text-gray-300 bg-[#0d0d1a] border border-[#2a2a3e]
                 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500/50 cursor-pointer"
        >
          <option v-for="m in MODELS" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Main panel -->
        <div class="lg:col-span-2 bg-[#13131f] border border-[#2a2a3e] rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-[#2a2a3e]">
            <h2 class="text-white font-semibold">Compose</h2>
          </div>

          <div class="p-6 space-y-5">
            <RoleSelector v-model="store.selectedRole" />

            <PromptInput v-model="store.prompt" />

            <div class="flex justify-end">
              <button
                type="button"
                :disabled="!store.canGenerate"
                class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                       text-white bg-purple-600 hover:bg-purple-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 cursor-pointer"
                @click="store.generate()"
              >
                <svg
                  v-if="store.isRunning"
                  class="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ store.isRunning ? 'Generating…' : '✦ Generate' }}
              </button>
            </div>

            <OutputPanel :output="store.output" />
          </div>
        </div>

        <!-- History sidebar -->
        <div class="lg:min-h-[600px]">
          <HistorySidebar
            :history="store.history"
            @load="store.loadFromHistory($event)"
            @clear="store.clearHistory()"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlaygroundStore, MODELS } from '../stores/playground'
import RoleSelector from '../components/playground/RoleSelector.vue'
import PromptInput from '../components/playground/PromptInput.vue'
import OutputPanel from '../components/playground/OutputPanel.vue'
import HistorySidebar from '../components/playground/HistorySidebar.vue'

const store = usePlaygroundStore()
</script>
