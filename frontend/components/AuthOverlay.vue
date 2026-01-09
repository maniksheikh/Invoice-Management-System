<template>
  <Transition name="overlay">
    <div v-if="!isLoggedIn" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <!-- Animated Background Mesh -->
      <div class="absolute inset-0 bg-slate-950">
        <div class="absolute top-0 -left-1/4 w-[100%] h-[100%] bg-indigo-600/30 rounded-full blur-[120px] animate-mesh-1"></div>
        <div class="absolute bottom-0 -right-1/4 w-[100%] h-[100%] bg-purple-600/30 rounded-full blur-[120px] animate-mesh-2"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>
      
      <!-- Content Card -->
      <div class="max-w-md w-full relative z-10 bg-white/5 border border-white/10 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] text-center group border-t-white/20">
        <!-- Floating Logo Section -->
        <div class="relative mb-12 animate-float">
          <div class="absolute inset-0 bg-indigo-500/40 blur-3xl rounded-full scale-150 group-hover:bg-indigo-500/50 transition-colors duration-700"></div>
          <div class="relative w-28 h-28 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/40 ring-4 ring-white/10">
            <svg class="w-16 h-16 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.675 3.068 1.701M15.312 12.89l-.16.16m.16-4.032l.16.16m-4.032 4.032l.16.16m-4.032-4.032l.16.16" />
            </svg>
          </div>
        </div>

        <div class="space-y-6 mb-12">
          <h2 class="text-5xl font-black text-white tracking-tighter leading-none">
            Welcome to <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">InvoiceAI</span>
          </h2>
          <p class="text-xl text-gray-400/90 font-medium cursor-pointer hover:text-gray-400 transition-colors leading-relaxed">
            Ready to streamline your business? <br/>
            Sign in to access your dashboard.
          </p>
        </div>

        <!-- Google Sign In Button -->
        <button 
          @click="handleGoogleSignIn"
          :disabled="signingIn || isLoading"
          class="w-full relative overflow-hidden group/btn flex items-center justify-center gap-4 bg-white text-gray-950 font-black py-3 px-8 rounded-2xl transition-all hover:bg-indigo-50 hover:shadow-[0_0_50px_10px_rgba(99,102,241,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <template v-if="signingIn || isLoading">
            <svg class="animate-spin h-7 w-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xl tracking-tight">Setting up workspace...</span>
          </template>
          <template v-else>
            <svg class="w-8 h-8" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span class="text-xl tracking-tight cursor-pointer italic font-serif">Sign in with Google</span>
          </template>
        </button>

        <div class="mt-10 flex items-center justify-center gap-2 text-gray-500">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm font-semibold tracking-wide uppercase">Secure Enterprise Login</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { signInWithGoogle, isLoggedIn } = useAuth()
const { $toast } = useNuxtApp()
const store = useMainStore()
const signingIn = ref(false)

const isLoading = computed(() => store.loading)

watch(isLoggedIn, (newVal) => {
  if (newVal) {
    console.log('Auth state changed: isLoggedIn = true, redirecting...')
    setTimeout(() => {
      navigateTo('/')
    }, 100)
  }
})

const handleGoogleSignIn = async () => {
  if (signingIn.value) return
  signingIn.value = true
  console.log('Initiating Google Sign-In...')
  
  try {
    const result = await signInWithGoogle()
    if (result.success) {
      console.log('Sign-in successful, awaiting redirection...')
      if ($toast) $toast('Welcome back!')
      await navigateTo('/')
    }
  } catch (error) {
    console.error('Sign-in failed error:', error)
    if ($toast) $toast('Authentication failed. Please try again.')
  } finally {
    signingIn.value = false
  }
}

</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-enter-from {
  opacity: 0;
  scale: 0.95;
  filter: blur(20px);
}

.overlay-leave-to {
  opacity: 0;
  scale: 1.05;
  filter: blur(40px);
}

@keyframes mesh-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10%, 10%) scale(1.1); }
  66% { transform: translate(-10%, 5%) scale(0.9); }
}

@keyframes mesh-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-15%, -10%) scale(1.2); }
  66% { transform: translate(15%, -5%) scale(0.8); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-mesh-1 { animation: mesh-1 10s infinite alternate ease-in-out; }
.animate-mesh-2 { animation: mesh-2 15s infinite alternate ease-in-out; }
.animate-float { animation: float 6s infinite ease-in-out; }
.animate-gradient-x { background-size: 200% 200%; animation: gradient-x 5s infinite ease; }
</style>
