<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2 group">
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
              <div class="flex items-center gap-3 pl-4 border-l border-white/10">
                <span class="text-sm text-gray-300 font-medium">{{ user?.name }}</span>
                <button @click="logout" class="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </template>
          </div>

          <!-- Mobile menu button -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
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
      leave-to-class="transform -translate-y-4 opacity-0"
    >
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
            <div class="px-3 py-2 border-t border-white/10 mt-2">
              <div class="flex items-center justify-between">
                <span class="text-base font-medium text-gray-300">{{ user?.name }}</span>
                <button @click="logout(); isMobileMenuOpen = false" class="text-red-400 hover:text-red-300 text-sm font-medium">Logout</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
const navLinks = [
  { label: 'Dashboards', to: '/dashboard' },
  { label: 'Invoices', to: '/invoices' },
  { label: 'Statistics', to: '/stats' },
]

const { isLoggedIn, user, logout } = useAuth()
const isMobileMenuOpen = ref(false)
</script>
