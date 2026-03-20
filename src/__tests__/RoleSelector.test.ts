import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoleSelector from '../components/playground/RoleSelector.vue'
import { ROLES } from '../stores/playground'

describe('RoleSelector', () => {
  it('renders a button for each role', () => {
    const wrapper = mount(RoleSelector, { props: { modelValue: 'user' } })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(ROLES.length)
  })

  it('marks the active role button with aria-pressed="true"', () => {
    const wrapper = mount(RoleSelector, { props: { modelValue: 'assistant' } })
    const activeBtn = wrapper.findAll('button').find((b) => b.attributes('aria-pressed') === 'true')
    expect(activeBtn?.text()).toContain('Assistant')
  })

  it('emits update:modelValue with the clicked role value', async () => {
    const wrapper = mount(RoleSelector, { props: { modelValue: 'user' } })
    const systemBtn = wrapper.findAll('button').find((b) => b.text().includes('System'))
    await systemBtn?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['system'])
  })

  it('shows description of the active role', () => {
    const wrapper = mount(RoleSelector, { props: { modelValue: 'system' } })
    const systemRole = ROLES.find((r) => r.value === 'system')!
    expect(wrapper.text()).toContain(systemRole.description)
  })

  it('all role labels are visible', () => {
    const wrapper = mount(RoleSelector, { props: { modelValue: 'user' } })
    ROLES.forEach((role) => {
      expect(wrapper.text()).toContain(role.label)
    })
  })
})
