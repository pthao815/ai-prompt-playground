<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
  >
    <div v-if="output">
      <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
        Output
      </label>
      <div class="relative px-4 py-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a3e]">
        <p class="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pr-12">{{ output }}</p>
        <button
          type="button"
          class="absolute top-3 right-3 text-xs text-gray-600 hover:text-gray-400
                 transition-colors cursor-pointer"
          @click="handleCopy"
        >
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ output: string }>()

const copied = ref(false)

async function handleCopy() {
  await navigator.clipboard.writeText(props.output)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>
