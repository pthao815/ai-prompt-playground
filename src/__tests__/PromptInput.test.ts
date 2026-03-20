import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptInput from '../components/playground/PromptInput.vue'

describe('PromptInput', () => {
  it('renders a textarea', () => {
    const wrapper = mount(PromptInput, { props: { modelValue: '' } })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('displays the current value in the textarea', () => {
    const wrapper = mount(PromptInput, { props: { modelValue: 'Hello world' } })
    expect(wrapper.find('textarea').element.value).toBe('Hello world')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(PromptInput, { props: { modelValue: '' } })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('New prompt text')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New prompt text'])
  })

  it('shows character count', () => {
    const wrapper = mount(PromptInput, { props: { modelValue: 'Hello' } })
    expect(wrapper.text()).toContain('5 chars')
  })

  it('shows token count as ceil(length / 4)', () => {
    const wrapper = mount(PromptInput, { props: { modelValue: 'Hello world!' } }) // 12 chars → 3 tokens
    expect(wrapper.text()).toContain('3 tokens')
  })

  it('shows 0 chars and 0 tokens for empty prompt', () => {
    const wrapper = mount(PromptInput, { props: { modelValue: '' } })
    expect(wrapper.text()).toContain('0 chars')
    expect(wrapper.text()).toContain('0 tokens')
  })
})
