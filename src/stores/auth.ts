import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin, apiRegister, apiLogout, apiGetMe } from '../api/auth.api'

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
  avatarInitials: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('promptlab_user') ?? 'null'),
  )

  const isAuthenticated = computed(() => user.value !== null)

  async function login(email: string, password: string): Promise<void> {
    const { user: u } = await apiLogin(email, password)
    user.value = u
    localStorage.setItem('promptlab_user', JSON.stringify(u))
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const { user: u } = await apiRegister(name, email, password)
    user.value = u
    localStorage.setItem('promptlab_user', JSON.stringify(u))
  }

  function logout(): void {
    apiLogout().catch(() => {}) // fire-and-forget
    user.value = null
    localStorage.removeItem('promptlab_user')
  }

  async function initializeFromServer(): Promise<void> {
    if (!user.value) return
    try {
      const { user: u } = await apiGetMe()
      user.value = u
      localStorage.setItem('promptlab_user', JSON.stringify(u))
    } catch {
      user.value = null
      localStorage.removeItem('promptlab_user')
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('auth:expired', () => {
      user.value = null
      localStorage.removeItem('promptlab_user')
    })
  }

  return { user, isAuthenticated, login, register, logout, initializeFromServer }
})
