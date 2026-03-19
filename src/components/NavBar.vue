<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-[#0d0d1a]/90 backdrop-blur-md border-b border-[#2a2a3e] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
      : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/" class="text-white font-bold text-xl tracking-tight">
        Prompt<span class="text-purple-400">Lab</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Right: auth-aware actions -->
      <div class="flex items-center gap-3">

        <!-- Logged OUT state -->
        <template v-if="!auth.isAuthenticated">
          <RouterLink
            to="/login"
            class="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </RouterLink>
          <RouterLink
            to="/register"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-white
                   bg-purple-600 hover:bg-purple-500
                   transition-colors duration-200"
          >
            Start Free
          </RouterLink>
        </template>

        <!-- Logged IN state -->
        <template v-else>
          <RouterLink
            to="/dashboard"
            class="hidden sm:flex items-center gap-2 text-sm text-gray-300
                   hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z
                   M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z
                   M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z
                   M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </RouterLink>

          <!-- Avatar dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              type="button"
              class="w-8 h-8 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-purple-600 to-violet-400
                     text-white font-bold text-xs cursor-pointer
                     hover:ring-2 hover:ring-purple-500/50 transition-all"
              :aria-label="`${auth.user?.name} — account menu`"
              @click="dropdownOpen = !dropdownOpen"
            >
              {{ auth.user?.avatarInitials }}
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-10 w-52 bg-[#13131f] border border-[#2a2a3e]
                       rounded-xl shadow-xl overflow-hidden origin-top-right"
                role="menu"
              >
                <!-- User info -->
                <div class="px-4 py-3 border-b border-[#2a2a3e]">
                  <p class="text-sm font-medium text-white truncate">{{ auth.user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
                </div>

                <div class="py-1">
                  <RouterLink
                    to="/dashboard"
                    class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300
                           hover:bg-white/5 hover:text-white transition-colors"
                    role="menuitem"
                    @click="dropdownOpen = false"
                  >
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </RouterLink>
                  <a
                    href="#"
                    class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300
                           hover:bg-white/5 hover:text-white transition-colors"
                    role="menuitem"
                  >
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </div>

                <div class="border-t border-[#2a2a3e] py-1">
                  <button
                    type="button"
                    class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400
                           hover:bg-red-500/10 transition-colors cursor-pointer"
                    role="menuitem"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Mobile menu toggle -->
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-gray-400 hover:text-white
                 hover:bg-white/5 transition-colors cursor-pointer"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-[#2a2a3e] bg-[#0d0d1a]/95 backdrop-blur-md"
      >
        <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="px-3 py-2.5 rounded-lg text-gray-300 hover:text-white
                   hover:bg-white/5 text-sm transition-colors"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </a>

          <div class="border-t border-[#2a2a3e] mt-2 pt-2 flex flex-col gap-1">
            <template v-if="!auth.isAuthenticated">
              <RouterLink
                to="/login"
                class="px-3 py-2.5 rounded-lg text-gray-300 hover:text-white
                       hover:bg-white/5 text-sm transition-colors"
                @click="mobileOpen = false"
              >
                Log in
              </RouterLink>
              <RouterLink
                to="/register"
                class="px-3 py-2.5 rounded-lg text-sm font-semibold text-white
                       bg-purple-600 hover:bg-purple-500 transition-colors text-center"
                @click="mobileOpen = false"
              >
                Start Free
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink
                to="/dashboard"
                class="px-3 py-2.5 rounded-lg text-gray-300 hover:text-white
                       hover:bg-white/5 text-sm transition-colors"
                @click="mobileOpen = false"
              >
                Dashboard
              </RouterLink>
              <button
                type="button"
                class="px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10
                       text-sm transition-colors text-left cursor-pointer"
                @click="handleLogout"
              >
                Sign out
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { onClickOutside } from '../composables/onClickOutside'

const router = useRouter()
const auth = useAuthStore()

const scrolled = ref(false)
const mobileOpen = ref(false)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

onClickOutside(dropdownRef, () => { dropdownOpen.value = false })

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function handleLogout() {
  dropdownOpen.value = false
  mobileOpen.value = false
  auth.logout()
  router.push('/')
}

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Social Proof', href: '/#social-proof' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Pricing', href: '/#pricing' },
]
</script>
