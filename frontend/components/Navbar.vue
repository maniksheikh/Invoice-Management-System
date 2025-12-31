<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">InvoiceAI</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-1">
            <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" 
              class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
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
      </div>
    </div>
  </nav>
</template>

<script setup>
const navLinks = [
  { label: 'Dashboards', to: '/dashboard' },
  { label: 'Invoices', to: '/invoices' },
  { label: 'Statistics', to: '/stats' },
]

// Mock Auth State for now - will integrate with local storage later
const isLoggedIn = ref(false)
const user = ref(null)

const logout = () => {
  // Simple logout logic
  isLoggedIn.value = false
  user.value = null
  navigateTo('/')
}

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    isLoggedIn.value = true
  }
})
</script>
