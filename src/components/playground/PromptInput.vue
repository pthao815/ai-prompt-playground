<template>
  <div>
    <label
      for="prompt-input"
      class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider"
    >
      Your Prompt
    </label>
    <textarea
      id="prompt-input"
      :value="modelValue"
      rows="6"
      placeholder="Write a prompt and hit Generate to see the magic…"
      class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600
             bg-[#0d0d1a] border border-[#2a2a3e] hover:border-[#3a3a4e]
             focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
             outline-none transition-all duration-200 resize-none"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p class="mt-1 text-xs text-gray-600">
      {{ modelValue.length }} chars · ~{{ tokenCount }} tokens
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const tokenCount = computed(() => Math.ceil(props.modelValue.length / 4))
</script>
