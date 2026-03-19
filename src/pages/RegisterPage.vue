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
        <p class="text-gray-500 text-sm mt-2">Start mastering prompts — for free.</p>
      </div>

      <!-- Card -->
      <div class="bg-[#13131f] border border-[#2a2a3e] rounded-2xl p-8">

        <h1 class="text-2xl font-bold text-white mb-1">Create your account</h1>
        <p class="text-gray-400 text-sm mb-8">
          Already have an account?
          <RouterLink to="/login" class="text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
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

        <form @submit.prevent="handleRegister" novalidate class="space-y-5">

          <!-- Full name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
              Full name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Alex Johnson"
              required
              class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600
                     bg-[#0d0d1a] border transition-all duration-200 outline-none
                     focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              :class="fieldError.name
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-[#2a2a3e] hover:border-[#3a3a4e]'"
            />
            <p v-if="fieldError.name" class="mt-1.5 text-xs text-red-400">{{ fieldError.name }}</p>
          </div>

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
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Min. 8 characters"
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

            <!-- Password strength bar -->
            <div v-if="form.password" class="mt-2 space-y-1">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-all duration-300"
                  :class="i <= passwordStrength.score
                    ? passwordStrength.color
                    : 'bg-[#2a2a3e]'"
                />
              </div>
              <p class="text-xs" :class="passwordStrength.textColor">
                {{ passwordStrength.label }}
              </p>
            </div>
            <p v-if="fieldError.password" class="mt-1.5 text-xs text-red-400">{{ fieldError.password }}</p>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              class="mt-0.5 w-4 h-4 rounded border-[#2a2a3e] bg-[#0d0d1a]
                     accent-purple-500 cursor-pointer"
            />
            <label for="terms" class="text-xs text-gray-400 leading-relaxed cursor-pointer">
              I agree to the
              <a href="#" class="text-purple-400 hover:text-purple-300">Terms of Service</a>
              and
              <a href="#" class="text-purple-400 hover:text-purple-300">Privacy Policy</a>
            </label>
          </div>
          <p v-if="fieldError.terms" class="text-xs text-red-400 -mt-3">{{ fieldError.terms }}</p>

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
            {{ loading ? 'Creating account…' : 'Create free account' }}
          </button>

        </form>
      </div>

      <p class="text-center text-xs text-gray-600 mt-6">
        No credit card required. Free plan, forever.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  acceptTerms: false,
})

const fieldError = reactive({
  name: '',
  email: '',
  password: '',
  terms: '',
})

const passwordStrength = computed(() => {
  const p = form.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const map = [
    { label: 'Too weak', color: 'bg-red-500', textColor: 'text-red-400' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400' },
    { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400' },
    { label: 'Very strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  ]
  return { score, ...map[score] }
})

function validate(): boolean {
  fieldError.name = ''
  fieldError.email = ''
  fieldError.password = ''
  fieldError.terms = ''
  let valid = true

  if (!form.name.trim()) {
    fieldError.name = 'Full name is required.'
    valid = false
  }

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
  } else if (form.password.length < 8) {
    fieldError.password = 'Password must be at least 8 characters.'
    valid = false
  }

  if (!form.acceptTerms) {
    fieldError.terms = 'You must accept the terms to continue.'
    valid = false
  }

  return valid
}

async function handleRegister() {
  errorMsg.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await auth.register(form.name.trim(), form.email, form.password)
    router.push('/dashboard')
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>
