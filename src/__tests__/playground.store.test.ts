import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlaygroundStore, generateFakeResponse, MODELS, ROLES } from '../stores/playground'

describe('generateFakeResponse', () => {
  it('returns brief-prompt message when prompt is too short', () => {
    const result = generateFakeResponse('hi', 'user', 'GPT-4o')
    expect(result).toContain('more detail')
  })

  it('generates code response for code-related prompts', () => {
    const result = generateFakeResponse('Write a typescript function to reverse a string', 'user', 'GPT-4o')
    expect(result).toContain('```typescript')
  })

  it('generates writing response for writing-related prompts', () => {
    const result = generateFakeResponse('Write a blog post about AI tools for developers', 'user', 'GPT-4o')
    expect(result).toContain('Introduction')
  })

  it('includes model label in prefix', () => {
    const result = generateFakeResponse('Tell me something interesting about space exploration', 'user', 'Claude 3.5 Sonnet')
    expect(result).toContain('[Claude 3.5 Sonnet]')
  })

  it('prefixes system role responses with system context message', () => {
    const result = generateFakeResponse('You are a helpful assistant that only speaks in rhymes', 'system', 'GPT-4o')
    expect(result).toContain('System context acknowledged')
  })

  it('prefixes assistant role responses appropriately', () => {
    const result = generateFakeResponse('Respond to the previous message about quantum computing', 'assistant', 'GPT-4o')
    expect(result).toContain('Responding as assistant')
  })
})

describe('MODELS constant', () => {
  it('contains expected model entries', () => {
    expect(MODELS.find((m) => m.value === 'gpt-4o')?.label).toBe('GPT-4o')
    expect(MODELS.find((m) => m.value === 'claude-3-5-sonnet')?.label).toBe('Claude 3.5 Sonnet')
    expect(MODELS.length).toBeGreaterThanOrEqual(4)
  })
})

describe('ROLES constant', () => {
  it('contains user, assistant, and system roles', () => {
    const values = ROLES.map((r) => r.value)
    expect(values).toContain('user')
    expect(values).toContain('assistant')
    expect(values).toContain('system')
  })

  it('each role has a description', () => {
    ROLES.forEach((r) => {
      expect(r.description.length).toBeGreaterThan(0)
    })
  })
})

describe('usePlaygroundStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with empty prompt and default model/role', () => {
    const store = usePlaygroundStore()
    expect(store.prompt).toBe('')
    expect(store.selectedRole).toBe('user')
    expect(store.selectedModel).toBe('gpt-4o')
    expect(store.output).toBe('')
    expect(store.isRunning).toBe(false)
    expect(store.history).toEqual([])
  })

  it('computes tokenCount from prompt length', () => {
    const store = usePlaygroundStore()
    store.prompt = 'Hello world' // 11 chars → ceil(11/4) = 3
    expect(store.tokenCount).toBe(3)
  })

  it('canGenerate is false when prompt is empty', () => {
    const store = usePlaygroundStore()
    store.prompt = ''
    expect(store.canGenerate).toBe(false)
  })

  it('canGenerate is false when prompt is whitespace-only', () => {
    const store = usePlaygroundStore()
    store.prompt = '   '
    expect(store.canGenerate).toBe(false)
  })

  it('canGenerate is true when prompt has content', () => {
    const store = usePlaygroundStore()
    store.prompt = 'Tell me about Mars'
    expect(store.canGenerate).toBe(true)
  })

  it('canGenerate is false while running', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Tell me about Mars'
    vi.useFakeTimers()
    const genPromise = store.generate()
    expect(store.canGenerate).toBe(false)
    vi.runAllTimersAsync()
    await genPromise
    vi.useRealTimers()
  })

  it('generate sets isRunning true then false', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning to me in simple terms'
    vi.useFakeTimers()
    const genPromise = store.generate()
    expect(store.isRunning).toBe(true)
    await vi.runAllTimersAsync()
    await genPromise
    expect(store.isRunning).toBe(false)
    vi.useRealTimers()
  })

  it('generate populates output after completion', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning to me in simple terms'
    vi.useFakeTimers()
    const genPromise = store.generate()
    await vi.runAllTimersAsync()
    await genPromise
    expect(store.output.length).toBeGreaterThan(0)
    vi.useRealTimers()
  })

  it('generate adds entry to history', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning to me in simple terms'
    vi.useFakeTimers()
    const genPromise = store.generate()
    await vi.runAllTimersAsync()
    await genPromise
    expect(store.history.length).toBe(1)
    expect(store.history[0].prompt).toBe('Explain machine learning to me in simple terms')
    vi.useRealTimers()
  })

  it('generate does not run when prompt is empty', async () => {
    const store = usePlaygroundStore()
    store.prompt = ''
    await store.generate()
    expect(store.history.length).toBe(0)
    expect(store.output).toBe('')
  })

  it('history entry records role, model, and timestamp', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Describe the theory of relativity in simple terms'
    store.selectedRole = 'system'
    store.selectedModel = 'claude-3-5-sonnet'
    vi.useFakeTimers()
    const genPromise = store.generate()
    await vi.runAllTimersAsync()
    await genPromise
    const item = store.history[0]
    expect(item.role).toBe('system')
    expect(item.model).toBe('claude-3-5-sonnet')
    expect(item.timestamp).toBeGreaterThan(0)
    vi.useRealTimers()
  })

  it('persists history to localStorage after generate', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Describe the history of the Roman Empire'
    vi.useFakeTimers()
    const genPromise = store.generate()
    await vi.runAllTimersAsync()
    await genPromise
    const saved = JSON.parse(localStorage.getItem('promptlab_history') ?? '[]')
    expect(saved.length).toBe(1)
    vi.useRealTimers()
  })

  it('loadFromHistory restores prompt, role, model, and output', () => {
    const store = usePlaygroundStore()
    const item = {
      id: 'test-1',
      prompt: 'A test prompt',
      role: 'assistant' as const,
      model: 'gemini-1.5-pro',
      output: 'A test output',
      timestamp: Date.now(),
    }
    store.loadFromHistory(item)
    expect(store.prompt).toBe('A test prompt')
    expect(store.selectedRole).toBe('assistant')
    expect(store.selectedModel).toBe('gemini-1.5-pro')
    expect(store.output).toBe('A test output')
  })

  it('clearHistory empties history and removes localStorage key', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Some prompt to generate content from'
    vi.useFakeTimers()
    const genPromise = store.generate()
    await vi.runAllTimersAsync()
    await genPromise
    vi.useRealTimers()

    expect(store.history.length).toBe(1)
    store.clearHistory()
    expect(store.history.length).toBe(0)
    expect(localStorage.getItem('promptlab_history')).toBeNull()
  })

  it('history is prepended (newest first)', async () => {
    const store = usePlaygroundStore()
    vi.useFakeTimers()

    store.prompt = 'First prompt about artificial intelligence'
    const p1 = store.generate()
    await vi.runAllTimersAsync()
    await p1

    store.prompt = 'Second prompt about machine learning models'
    const p2 = store.generate()
    await vi.runAllTimersAsync()
    await p2

    expect(store.history[0].prompt).toBe('Second prompt about machine learning models')
    expect(store.history[1].prompt).toBe('First prompt about artificial intelligence')
    vi.useRealTimers()
  })
})
