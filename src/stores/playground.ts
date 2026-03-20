import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

const STORAGE_KEY = 'promptlab_history'
const MAX_HISTORY = 50

export function generateFakeResponse(prompt: string, role: Role, modelLabel: string): string {
  const p = prompt.trim()
  const tokens = Math.ceil(p.length / 4)
  const prefix = `[${modelLabel}]`

  const isCode = /\b(code|function|debug|bug|class|implement|algorithm|typescript|javascript|python)\b/i.test(p)
  const isWrite = /\b(write|blog|email|essay|article|summary|outline|letter)\b/i.test(p)

  let body: string
  if (p.length < 20) {
    body = 'Could you provide more detail? Your prompt seems quite brief.'
  } else if (isCode) {
    body = `Here's a solution based on your request:\n\n\`\`\`typescript\n// Generated for: "${p.slice(0, 40)}"\nfunction solution() {\n  // implementation\n  return result\n}\n\`\`\`\n\nThis follows best practices and is optimized for readability.`
  } else if (isWrite) {
    body = `Here's the content you requested:\n\n**Introduction:** This piece addresses the core theme of your prompt with clarity.\n\n**Main Body:** Key insights explored in depth with actionable examples.\n\n**Conclusion:** A compelling call-to-action that drives meaningful results.`
  } else {
    body = `Based on your ${p.length}-character prompt (~${tokens} tokens), here is a detailed response:\n\nThis addresses the key aspects of what you've asked. The model has analyzed your input and generated relevant content for your use case.\n\nFeel free to refine your prompt for more specific results.`
  }

  switch (role) {
    case 'system':
      return `${prefix} System context acknowledged. Operating under:\n\n${body}\n\nAll subsequent responses will adhere to these guidelines.`
    case 'assistant':
      return `${prefix} Responding as assistant:\n\n${body}`
    default:
      return `${prefix} ${body}`
  }
}

export const usePlaygroundStore = defineStore('playground', () => {
  const prompt = ref('')
  const selectedRole = ref<Role>('user')
  const selectedModel = ref('gpt-4o')
  const isRunning = ref(false)
  const output = ref('')
  const history = ref<HistoryItem[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'),
  )

  const tokenCount = computed(() => Math.ceil(prompt.value.length / 4))
  const canGenerate = computed(() => prompt.value.trim().length > 0 && !isRunning.value)

  async function generate(): Promise<void> {
    if (!canGenerate.value) return
    isRunning.value = true
    output.value = ''

    await new Promise<void>((r) => setTimeout(r, 1200))

    const modelLabel = MODELS.find((m) => m.value === selectedModel.value)?.label ?? selectedModel.value
    output.value = generateFakeResponse(prompt.value, selectedRole.value, modelLabel)

    const item: HistoryItem = {
      id: crypto.randomUUID(),
      prompt: prompt.value,
      role: selectedRole.value,
      model: selectedModel.value,
      output: output.value,
      timestamp: Date.now(),
    }
    history.value.unshift(item)
    if (history.value.length > MAX_HISTORY) history.value.length = MAX_HISTORY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))

    isRunning.value = false
  }

  function loadFromHistory(item: HistoryItem): void {
    prompt.value = item.prompt
    selectedRole.value = item.role
    selectedModel.value = item.model
    output.value = item.output
  }

  function clearHistory(): void {
    history.value = []
    localStorage.removeItem(STORAGE_KEY)
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
    loadFromHistory,
    clearHistory,
  }
})
