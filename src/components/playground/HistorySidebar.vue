<template>
  <div class="bg-[#13131f] border border-[#2a2a3e] rounded-2xl overflow-hidden flex flex-col h-full">
    <div class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a3e] shrink-0">
      <h2 class="text-white font-semibold text-sm">History</h2>
      <button
        v-if="history.length > 0"
        type="button"
        class="text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
        @click="$emit('clear')"
      >
        Clear all
      </button>
    </div>

    <div v-if="history.length === 0" class="flex-1 flex items-center justify-center p-6">
      <p class="text-xs text-gray-600 text-center">
        No history yet.<br />Run a prompt to get started.
      </p>
    </div>

    <ul v-else class="flex-1 overflow-y-auto divide-y divide-[#2a2a3e]">
      <li
        v-for="item in history"
        :key="item.id"
        class="px-5 py-3 hover:bg-[#1a1a2e] transition-colors cursor-pointer group"
        @click="$emit('load', item)"
      >
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
            :class="roleBadgeClass(item.role)"
          >
            {{ item.role }}
          </span>
          <span class="text-[10px] text-gray-600 truncate flex-1">{{ modelLabel(item.model) }}</span>
          <span class="text-[10px] text-gray-700 shrink-0">{{ formatTime(item.timestamp) }}</span>
        </div>
        <p class="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
          {{ item.prompt }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { MODELS } from '../../stores/playground'
import type { HistoryItem, Role } from '../../stores/playground'

defineProps<{ history: HistoryItem[] }>()
defineEmits<{ load: [item: HistoryItem]; clear: [] }>()

function roleBadgeClass(role: Role): string {
  switch (role) {
    case 'system': return 'bg-amber-500/20 text-amber-400'
    case 'assistant': return 'bg-blue-500/20 text-blue-400'
    default: return 'bg-purple-500/20 text-purple-400'
  }
}

function modelLabel(value: string): string {
  return MODELS.find((m) => m.value === value)?.label ?? value
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
