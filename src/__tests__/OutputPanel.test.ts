import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OutputPanel from '../components/playground/OutputPanel.vue'

describe('OutputPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders nothing when output is empty', () => {
    const wrapper = mount(OutputPanel, {
      props: { output: '' },
      global: { stubs: { Transition: false } },
    })
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders output text when provided', () => {
    const wrapper = mount(OutputPanel, {
      props: { output: 'This is the AI response' },
      global: { stubs: { Transition: { template: '<slot />' } } },
    })
    expect(wrapper.text()).toContain('This is the AI response')
  })

  it('shows Copy button when output is present', () => {
    const wrapper = mount(OutputPanel, {
      props: { output: 'Some output text' },
      global: { stubs: { Transition: { template: '<slot />' } } },
    })
    expect(wrapper.find('button').text()).toBe('Copy')
  })

  it('calls clipboard.writeText with output on copy click', async () => {
    const wrapper = mount(OutputPanel, {
      props: { output: 'Copy this text' },
      global: { stubs: { Transition: { template: '<slot />' } } },
    })
    await wrapper.find('button').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy this text')
  })

  it('shows ✓ Copied feedback after copy', async () => {
    vi.useFakeTimers()
    const wrapper = mount(OutputPanel, {
      props: { output: 'Some output text' },
      global: { stubs: { Transition: { template: '<slot />' } } },
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').text()).toBe('✓ Copied')
    vi.runAllTimers()
    vi.useRealTimers()
  })
})
