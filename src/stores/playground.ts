import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiGenerate, apiGetHistory, apiClearHistory } from '../api/playground.api'

export type Role = 'user' | 'assistant' | 'system'

export interface HistoryItem {
  id: string
  prompt: string
  role: Role
  model: string
  output: string
  timestamp: number
}

export const MODELS = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
  { label: 'Mistral Large', value: 'mistral-large' },
]

export const ROLES: { label: string; value: Role; description: string }[] = [
  { label: 'User', value: 'user', description: 'A human turn in the conversation' },
  { label: 'Assistant', value: 'assistant', description: 'Simulate an AI response turn' },
  { label: 'System', value: 'system', description: "Set the AI's behavior and context" },
]

const MAX_HISTORY = 50

export const usePlaygroundStore = defineStore('playground', () => {
  const prompt = ref('')
  const selectedRole = ref<Role>('user')
  const selectedModel = ref('gpt-4o')
  const isRunning = ref(false)
  const output = ref('')
  const history = ref<HistoryItem[]>([])

  const tokenCount = computed(() => Math.ceil(prompt.value.length / 4))
  const canGenerate = computed(() => prompt.value.trim().length > 0 && !isRunning.value)

  async function generate(): Promise<void> {
    if (!canGenerate.value) return
    isRunning.value = true
    output.value = ''
    try {
      const result = await apiGenerate(prompt.value, selectedRole.value, selectedModel.value)
      output.value = result.output
      history.value.unshift(result.historyItem)
      if (history.value.length > MAX_HISTORY) history.value.length = MAX_HISTORY
    } finally {
      isRunning.value = false
    }
  }

  async function fetchHistory(): Promise<void> {
    const { items } = await apiGetHistory(MAX_HISTORY)
    history.value = items
  }

  function loadFromHistory(item: HistoryItem): void {
    prompt.value = item.prompt
    selectedRole.value = item.role
    selectedModel.value = item.model
    output.value = item.output
  }

  async function clearHistory(): Promise<void> {
    await apiClearHistory()
    history.value = []
  }

  return {
    prompt,
    selectedRole,
    selectedModel,
    isRunning,
    output,
    history,
    tokenCount,
    canGenerate,
    generate,
    fetchHistory,
    loadFromHistory,
    clearHistory,
  }
})
