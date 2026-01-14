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
              placeholder="name@company.com" />
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
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white/5 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleSignIn"
              class="w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-bold rounded-xl text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
              <svg class="w-5 h-5 mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z
                "></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Sign in with Google
            </button>
          </div>
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

useHead({
  title: 'Login - InvoiceAI',
})

const { signInWithEmail, signInWithGoogle } = useAuth()
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

const handleGoogleSignIn = async () => {
  loading.value = true
  error.value = null
  try {
    await signInWithGoogle()
    navigateTo('/invoices')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

</script>
