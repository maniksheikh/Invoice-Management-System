<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2 group" @click.native.prevent="router.push('/')">
            <div class="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">InvoiceAI</span>
          </NuxtLink>
        </div>
        
        <!-- Centered Navigation -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" 
            class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <!-- Desktop menu -->
          <div class="hidden md:flex items-center gap-4">
            <template v-if="!isLoggedIn">
              <NuxtLink to="/login" class="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign in</NuxtLink>
              <NuxtLink to="/register" class="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-all transform hover:scale-105">
                Get Started
              </NuxtLink>
            </template>
            <template v-else>
              <!-- Profile Dropdown Container -->
              <div class="relative pl-6 border-l border-white/10" ref="profileDropdownRef">
                <button 
                  @click="isProfileMenuOpen = !isProfileMenuOpen"
                  class="flex items-center gap-3 group cursor-pointer focus:outline-none">
                  <!-- Avatar -->
                  <div class="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all">
                    <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || user.name" class="h-full w-full object-cover" />
                    <span v-else class="text-sm font-bold text-indigo-400">{{ (user?.displayName || user?.name || 'U')?.charAt(0)?.toUpperCase() }}</span>
                  </div>
                </button>
                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <div v-if="isProfileMenuOpen" class="absolute right-0 mt-3 w-56 bg-slate-800 border border-white/10 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                    <div class="px-4 py-3 border-b border-white/5">
                      <p class="text-sm text-white font-medium truncate">{{ user?.email }}</p>
                    </div>
                    <div class="py-1">
                      <NuxtLink to="/profile" @click="isProfileMenuOpen = false" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </NuxtLink>
                      <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </a>
                    </div>
                    <div class="border-t border-white/5 pt-1 mt-1">
                      <button @click="logout(); isProfileMenuOpen = false" class="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </div>
          <!-- Mobile menu button -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-show="isMobileMenuOpen" class="md:hidden bg-slate-900 border-b border-white/5">
        <div class="space-y-1 px-4 pb-3 pt-2">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" 
            @click="isMobileMenuOpen = false"
            class="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            {{ link.label }}
          </NuxtLink>
          <template v-if="!isLoggedIn">
            <NuxtLink to="/login" @click="isMobileMenuOpen = false" class="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">Sign in</NuxtLink>
            <NuxtLink to="/register" @click="isMobileMenuOpen = false" class="block px-3 py-2 text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-all">Get Started</NuxtLink>
          </template>
          <template v-else>
            <div class="px-3 py-3 border-t border-white/10 mt-2 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                    <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || user.name" class="h-full w-full object-cover" />
                    <span v-else class="text-sm font-bold text-indigo-400">{{ (user?.displayName || user?.name || 'U')?.charAt(0)?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ user?.displayName || user?.name }}</p>
                    <p class="text-xs text-gray-500">Free Plan</p>
                  </div>
                </div>
              </div>
              <button @click="logout(); isMobileMenuOpen = false" class="flex items-center gap-2 w-full px-3 py-2 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded-lg transition-colors text-sm font-medium">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
const navLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Invoices', to: '/invoices' },
]

const { isLoggedIn, user, logout } = useAuth()
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

// Close profile dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
      isProfileMenuOpen.value = false
    }
  })
})

import { useRouter } from 'vue-router'
const router = useRouter()

</script>
