import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HistorySidebar from '../components/playground/HistorySidebar.vue'
import type { HistoryItem } from '../stores/playground'

const makeItem = (overrides: Partial<HistoryItem> = {}): HistoryItem => ({
  id: '1',
  prompt: 'Test prompt',
  role: 'user',
  model: 'gpt-4o',
  output: 'Test output',
  timestamp: Date.now(),
  ...overrides,
})

describe('HistorySidebar', () => {
  it('shows empty state message when history is empty', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [] } })
    expect(wrapper.text()).toContain('No history yet')
  })

  it('does not show Clear all button when history is empty', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [] } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a list item for each history entry', () => {
    const history = [makeItem({ id: '1' }), makeItem({ id: '2', prompt: 'Another prompt' })]
    const wrapper = mount(HistorySidebar, { props: { history } })
    expect(wrapper.findAll('li').length).toBe(2)
  })

  it('shows truncated prompt in each list item', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [makeItem()] } })
    expect(wrapper.text()).toContain('Test prompt')
  })

  it('shows role badge for each item', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [makeItem({ role: 'system' })] } })
    expect(wrapper.text()).toContain('system')
  })

  it('emits load event with item when a history row is clicked', async () => {
    const item = makeItem()
    const wrapper = mount(HistorySidebar, { props: { history: [item] } })
    await wrapper.find('li').trigger('click')
    expect(wrapper.emitted('load')?.[0]).toEqual([item])
  })

  it('shows Clear all button when history has items', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [makeItem()] } })
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear all')
    expect(clearBtn).toBeTruthy()
  })

  it('emits clear event when Clear all is clicked', async () => {
    const wrapper = mount(HistorySidebar, { props: { history: [makeItem()] } })
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear all')
    await clearBtn?.trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('displays model label (not raw value) for each item', () => {
    const wrapper = mount(HistorySidebar, { props: { history: [makeItem({ model: 'gpt-4o' })] } })
    expect(wrapper.text()).toContain('GPT-4o')
  })

  it('assistant role badge has blue styling class', () => {
    const wrapper = mount(HistorySidebar, {
      props: { history: [makeItem({ role: 'assistant' })] },
    })
    const badge = wrapper.find('span.bg-blue-500\\/20')
    expect(badge.exists()).toBe(true)
  })
})
