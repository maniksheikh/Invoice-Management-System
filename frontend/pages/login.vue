<template>
  <div class="flex min-h-[calc(100vh-64px)] flex-col justify-center px-6 py-12 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-indigo-500/10 blur-[120px] rounded-full"></div>
    <div class="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-purple-500/10 blur-[120px] rounded-full"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
      <div class="flex justify-center">
        <div class="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0014 2.054V1h-.5a.5.5 0 00-.5.5v1.054a10.003 10.003 0 00-5.26 17.383l.053.091m7.374.245a.75.75 0 001.06-.02 10.003 10.003 0 00-5.26-17.383V1h.5a.5.5 0 00.5.5v1.054a10.003 10.003 0 00-2.753 9.571" />
          </svg>
        </div>
      </div>
      <h2 class="mt-8 text-center text-3xl font-bold tracking-tight text-white">Welcome back</h2>
      <p class="mt-2 text-center text-sm text-gray-400">
        Don't have an account? 
        <NuxtLink to="/register" class="font-semibold text-indigo-400 hover:text-indigo-300">Sign up for free</NuxtLink>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-300">Email address</label>
          <div class="mt-2">
            <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
              class="block w-full rounded-xl border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-500 transition-all px-4"
              placeholder="name@company.com" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-300">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required
              class="block w-full rounded-xl border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-500 transition-all px-4"
              placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="flex w-full justify-center rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]">
            <span v-if="loading" class="mr-2">Logging in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
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
    const response = await $fetch('http://localhost:3001/api/person/v1/login', {
      method: 'POST',
      body: form
    })

    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify(response.person))
    
    // Refresh page or navigate
    window.location.href = '/'
  } catch (err) {
    error.value = err.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
