import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
  avatarInitials: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('promptlab_user') ?? 'null')
  )

  const isAuthenticated = computed(() => user.value !== null)

  // Simulated user database (localStorage-backed)
  function getRegisteredUsers(): Record<string, { password: string; user: User }> {
    return JSON.parse(localStorage.getItem('promptlab_users') ?? '{}')
  }

  function saveRegisteredUsers(db: Record<string, { password: string; user: User }>) {
    localStorage.setItem('promptlab_users', JSON.stringify(db))
  }

  async function login(email: string, password: string): Promise<void> {
    await simulateDelay()
    const db = getRegisteredUsers()
    const record = db[email.toLowerCase()]

    if (!record || record.password !== password) {
      throw new Error('Invalid email or password.')
    }

    user.value = record.user
    localStorage.setItem('promptlab_user', JSON.stringify(record.user))
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await simulateDelay()
    const db = getRegisteredUsers()
    const key = email.toLowerCase()

    if (db[key]) {
      throw new Error('An account with this email already exists.')
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: key,
      plan: 'free',
      avatarInitials: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    }

    db[key] = { password, user: newUser }
    saveRegisteredUsers(db)

    user.value = newUser
    localStorage.setItem('promptlab_user', JSON.stringify(newUser))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('promptlab_user')
  }

  function simulateDelay(ms = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  return { user, isAuthenticated, login, register, logout }
})
