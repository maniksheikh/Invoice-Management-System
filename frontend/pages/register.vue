<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Gradients -->
    <div class="absolute inset-0 -z-10 bg-slate-950">
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-8 text-center text-3xl font-extrabold text-white tracking-tight">
          Create account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Start automating your invoices today
        </p>
      </div>

      <!-- Messages -->
      <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
        <p class="text-center text-sm text-rose-400 font-medium">{{ error }}</p>
      </div>
      <div v-if="success" class="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">
        <p class="text-center text-sm text-emerald-400 font-medium">{{ success }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="full-name" class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              v-model="form.name"
              id="full-name" 
              name="name" 
              type="text" 
              required 
              class="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-500 text-white rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all sm:text-sm" 
              placeholder="John Doe" 
            />
          </div>
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
            <label for="password" class="block text-sm font-medium text-gray-400 mb-1">Password</label>
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
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
            <span v-if="loading">Creating account...</span>
            <span v-else>Get started</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-400">
            Already have an account? 
            <NuxtLink to="/login" class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in instead
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { signUpWithEmail } = useAuth()
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleRegister = async () => {
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    await signUpWithEmail(form.name, form.email, form.password)
    success.value = 'Account created successfully! Redirecting to login...'
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Register - InvoiceAI',
})
</script>
