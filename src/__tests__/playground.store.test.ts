import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlaygroundStore, MODELS, ROLES } from '../stores/playground'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseHistoryItem = {
  id: 'test-id',
  prompt: '',
  role: 'user' as const,
  model: 'gpt-4o',
  output: 'Mock AI response',
  timestamp: Date.now(),
}

function stubFetchGenerate(output = 'Mock AI response', prompt = '') {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output,
        historyItem: { ...baseHistoryItem, prompt, output },
      }),
    }),
  )
}

function stubFetch204() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => undefined }),
  )
}

// ─── MODELS ──────────────────────────────────────────────────────────────────

describe('MODELS constant', () => {
  it('contains expected model entries', () => {
    expect(MODELS.find((m) => m.value === 'gpt-4o')?.label).toBe('GPT-4o')
    expect(MODELS.find((m) => m.value === 'claude-3-5-sonnet')?.label).toBe('Claude 3.5 Sonnet')
    expect(MODELS.length).toBeGreaterThanOrEqual(4)
  })
})

// ─── ROLES ───────────────────────────────────────────────────────────────────

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

// ─── usePlaygroundStore ───────────────────────────────────────────────────────

describe('usePlaygroundStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    stubFetchGenerate()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('canGenerate is false while a request is in flight', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Tell me about Mars'

    let resolveFetch!: (value: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValue(new Promise((r) => { resolveFetch = r })),
    )

    const genPromise = store.generate()
    expect(store.canGenerate).toBe(false)

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({ output: 'done', historyItem: { ...baseHistoryItem } }),
    })
    await genPromise
  })

  it('generate sets isRunning true then false', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning in simple terms'

    let resolveFetch!: (value: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValue(new Promise((r) => { resolveFetch = r })),
    )

    const genPromise = store.generate()
    expect(store.isRunning).toBe(true)

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({ output: 'done', historyItem: { ...baseHistoryItem } }),
    })
    await genPromise
    expect(store.isRunning).toBe(false)
  })

  it('generate populates output after completion', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning in simple terms'
    stubFetchGenerate('AI generated response', store.prompt)

    await store.generate()

    expect(store.output).toBe('AI generated response')
  })

  it('generate adds entry to history', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Explain machine learning in simple terms'
    stubFetchGenerate('response', store.prompt)

    await store.generate()

    expect(store.history.length).toBe(1)
    expect(store.history[0].prompt).toBe('Explain machine learning in simple terms')
  })

  it('generate does not run when prompt is empty', async () => {
    const store = usePlaygroundStore()
    store.prompt = ''
    await store.generate()
    expect(store.history.length).toBe(0)
    expect(store.output).toBe('')
  })

  it('history entry records role, model, and timestamp from server response', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Describe the theory of relativity'
    store.selectedRole = 'system'
    store.selectedModel = 'claude-3-5-sonnet'

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          output: 'response',
          historyItem: {
            id: 'srv-id',
            prompt: store.prompt,
            role: 'system',
            model: 'claude-3-5-sonnet',
            output: 'response',
            timestamp: 1234567890,
          },
        }),
      }),
    )

    await store.generate()

    const item = store.history[0]
    expect(item.role).toBe('system')
    expect(item.model).toBe('claude-3-5-sonnet')
    expect(item.timestamp).toBe(1234567890)
  })

  it('loadFromHistory restores prompt, role, model, and output', () => {
    const store = usePlaygroundStore()
    store.loadFromHistory({
      id: 'test-1',
      prompt: 'A test prompt',
      role: 'assistant',
      model: 'gemini-1.5-pro',
      output: 'A test output',
      timestamp: Date.now(),
    })
    expect(store.prompt).toBe('A test prompt')
    expect(store.selectedRole).toBe('assistant')
    expect(store.selectedModel).toBe('gemini-1.5-pro')
    expect(store.output).toBe('A test output')
  })

  it('clearHistory empties history array', async () => {
    const store = usePlaygroundStore()
    store.prompt = 'Some prompt'
    stubFetchGenerate('response', store.prompt)
    await store.generate()
    expect(store.history.length).toBe(1)

    stubFetch204()
    await store.clearHistory()
    expect(store.history.length).toBe(0)
  })

  it('history is prepended — newest entry first', async () => {
    const store = usePlaygroundStore()

    store.prompt = 'First prompt about artificial intelligence'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          output: 'r1',
          historyItem: { ...baseHistoryItem, id: 'id-1', prompt: store.prompt },
        }),
      }),
    )
    await store.generate()

    store.prompt = 'Second prompt about machine learning models'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          output: 'r2',
          historyItem: { ...baseHistoryItem, id: 'id-2', prompt: store.prompt },
        }),
      }),
    )
    await store.generate()

    expect(store.history[0].prompt).toBe('Second prompt about machine learning models')
    expect(store.history[1].prompt).toBe('First prompt about artificial intelligence')
  })
})
