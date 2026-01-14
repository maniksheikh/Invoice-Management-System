<template>
  <div class="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Gradients -->
    <div class="absolute inset-0 -z-10 bg-slate-950">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="relative flex flex-col md:flex-row items-center gap-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-slate-800 border-4 border-indigo-500/30 flex items-center justify-center overflow-hidden shadow-2xl">
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.name" class="w-full h-full object-cover" />
              <span v-else class="text-4xl font-bold text-indigo-400">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
            <div class="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
          </div>
          
          <div class="text-center md:text-left flex-1">
            <div v-if="!isEditing" class="space-y-1">
              <div class="flex items-center gap-3">
                <p class="text-xl text-white font-bold truncate">{{ userDetails?.displayName || user?.displayName || user?.name }}</p>
              </div>
              <p class="text-indigo-300 font-medium mb-4">{{ user?.email }}</p>
            </div>
            
            <div v-else class="space-y-4 mb-4">
              <div>
                <label class="text-xs text-gray-400 font-medium uppercase tracking-wider">Full Name</label>
                <input 
                  v-model="editedUser.displayName" 
                  type="text" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <span v-if="userDetails?.plan" class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/20">
                {{ userDetails.plan }}
              </span>
              <span v-else class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/20">
                Free Plan
              </span>
              <span v-if="userDetails?.isVerified" class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/20">
                Verified User
              </span>
              <span v-else class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium border border-amber-500/20">
                Unverified User
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-3 min-w-[140px]">
            <template v-if="!isEditing">
              <button @click="editProfile" class="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform">
                Edit Profile
              </button>
              <button @click="changePlan" class="px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer rounded-xl font-medium transition-all">
                Change Plan
              </button>
            </template>
            <template v-else>
              <button @click="saveProfile" :disabled="saving" class="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform disabled:opacity-50 disabled:cursor-not-allowed">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button @click="cancelEdit" :disabled="saving" class="px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer rounded-xl font-medium transition-all disabled:opacity-50">
                Cancel
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(stat, index) in profileStats" :key="index" class="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all">
          <p class="text-gray-400 text-sm font-medium mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Account Settings Section (Placeholder) -->
      <div class="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-xl font-bold text-white mb-6">Account Settings</h2>
        <div class="space-y-4">
           <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Notifications</p>
                  <p class="text-sm text-gray-400">Manage your email preferences</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
           </div>
           
           <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Security</p>
                  <p class="text-sm text-gray-400">Password and authentication</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Profile - InvoiceAI',
})

const { user, userDetails } = useAuth()
const store = useMainStore()

const isEditing = ref(false)
const saving = ref(false)
const editedUser = ref({
  displayName: ''
})

const editProfile = () => {
  editedUser.value = {
    displayName: userDetails.value?.displayName || user.value?.displayName || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  try {
    saving.value = true
    const payload = {
      email: user.value.email,
      displayName: editedUser.value.displayName
    }
    await store.postUserDetails(payload)
    const updatedDetails = await store.getUserDetails(user.value.email)
    store.setUserDetails(updatedDetails)
    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

const changePlan = () => {
  console.log('Change plan clicked')
}

const profileStats = ref([
  { label: 'Total Invoices', value: '12' },
  { label: 'Member Since', value: 'Jan 2024' },
  { label: 'Last Login', value: 'Today' }
])

</script>
