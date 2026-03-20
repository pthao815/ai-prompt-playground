<template>
  <div>
    <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
      Role
    </label>
    <div class="flex gap-2" role="group" aria-label="Select role">
      <button
        v-for="role in ROLES"
        :key="role.value"
        type="button"
        :aria-pressed="modelValue === role.value"
        :title="role.description"
        class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer"
        :class="modelValue === role.value
          ? 'bg-purple-600/30 border-purple-500/60 text-purple-300'
          : 'bg-[#0d0d1a] border-[#2a2a3e] text-gray-500 hover:border-[#3a3a4e] hover:text-gray-300'"
        @click="$emit('update:modelValue', role.value)"
      >
        {{ role.label }}
      </button>
    </div>
    <p class="mt-1.5 text-xs text-gray-600">
      {{ activeRole?.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ROLES } from '../../stores/playground'
import type { Role } from '../../stores/playground'

const props = defineProps<{ modelValue: Role }>()
defineEmits<{ 'update:modelValue': [value: Role] }>()

const activeRole = computed(() => ROLES.find((r) => r.value === props.modelValue))
</script>
