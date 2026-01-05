<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Gradients -->
    <div class="absolute inset-0 -z-10 bg-slate-950">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-8 text-center text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Sign in to manage your invoices
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
        <p class="text-center text-sm text-rose-400 font-medium">{{ error }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-400 mb-1">Email address</label>
            <input 
              v-model="form.email"
              id="email-address" 
              name="email" 
              type="email" 
              required 
              class="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-500 text-white rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all sm:text-sm" 
              placeholder="name@company.com" 
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-sm font-medium text-gray-400">Password</label>
              <a href="#" class="text-xs font-medium text-indigo-400 hover:text-indigo-300">Forgot password?</a>
            </div>
            <input 
              v-model="form.password"
              id="password" 
              name="password" 
              type="password" 
              required 
              class="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-500 text-white rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all sm:text-sm" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-400">
            Don't have an account? 
            <NuxtLink to="/register" class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Create one for free
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { signInWithEmail } = useAuth()
const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  
  try {
    await signInWithEmail({ email: form.email, password: form.password })
    navigateTo('/invoices')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login - InvoiceAI',
})
</script>
