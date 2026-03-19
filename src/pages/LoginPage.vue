<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">

    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
    </div>

    <div class="relative w-full max-w-md">

      <!-- Logo link -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-block text-white font-bold text-2xl tracking-tight">
          Prompt<span class="text-purple-400">Lab</span>
        </RouterLink>
        <p class="text-gray-500 text-sm mt-2">Welcome back. Let's build.</p>
      </div>

      <!-- Card -->
      <div class="bg-[#13131f] border border-[#2a2a3e] rounded-2xl p-8">

        <h1 class="text-2xl font-bold text-white mb-1">Sign in</h1>
        <p class="text-gray-400 text-sm mb-8">
          Don't have an account?
          <RouterLink to="/register" class="text-purple-400 hover:text-purple-300 transition-colors">
            Sign up free
          </RouterLink>
        </p>

        <!-- Error alert -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="errorMsg"
            class="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl
                   bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            role="alert"
          >
            <span class="mt-0.5 shrink-0">⚠</span>
            {{ errorMsg }}
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" novalidate class="space-y-5">

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
              class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600
                     bg-[#0d0d1a] border transition-all duration-200 outline-none
                     focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              :class="fieldError.email
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-[#2a2a3e] hover:border-[#3a3a4e]'"
            />
            <p v-if="fieldError.email" class="mt-1.5 text-xs text-red-400">{{ fieldError.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-300">
                Password
              </label>
              <a href="#" class="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-600
                       bg-[#0d0d1a] border transition-all duration-200 outline-none
                       focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                :class="fieldError.password
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-[#2a2a3e] hover:border-[#3a3a4e]'"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-500 hover:text-gray-300 transition-colors p-1"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                       a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                       M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29
                       M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
                       a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="fieldError.password" class="mt-1.5 text-xs text-red-400">{{ fieldError.password }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white
                   bg-gradient-to-r from-purple-600 to-violet-500
                   hover:from-purple-500 hover:to-violet-400
                   disabled:opacity-60 disabled:cursor-not-allowed
                   shadow-[0_0_20px_rgba(170,59,255,0.25)]
                   hover:shadow-[0_0_30px_rgba(170,59,255,0.4)]
                   transition-all duration-300 cursor-pointer
                   flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>

        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-[#2a2a3e]" />
          <span class="text-xs text-gray-600">or continue with</span>
          <div class="flex-1 h-px bg-[#2a2a3e]" />
        </div>

        <!-- OAuth stubs -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2
                   px-4 py-2.5 rounded-xl text-sm text-gray-300
                   border border-[#2a2a3e] hover:border-[#3a3a4e]
                   hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2
                   px-4 py-2.5 rounded-xl text-sm text-gray-300
                   border border-[#2a2a3e] hover:border-[#3a3a4e]
                   hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387
                       .599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416
                       -.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729
                       1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997
                       .107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931
                       0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0
                       1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138
                       3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118
                       3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                       .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                       C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const fieldError = reactive({ email: '', password: '' })

function validate(): boolean {
  fieldError.email = ''
  fieldError.password = ''
  let valid = true

  if (!form.email) {
    fieldError.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldError.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!form.password) {
    fieldError.password = 'Password is required.'
    valid = false
  }

  return valid
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await auth.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/dashboard'
    router.push(redirect)
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>
