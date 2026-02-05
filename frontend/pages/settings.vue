<template>
  <div class="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
    <!-- Background Gradients -->
    <div class="absolute inset-0 -z-10 bg-slate-950">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- Loading State -->
    <div v-if="!isAuthReady" class="min-h-screen flex items-center justify-center relative z-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="isLoggedIn" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight">Settings</h1>
        <p class="mt-2 text-gray-400">Manage your account preferences and security.</p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- Profile Section (Simplified link to Profile) -->
        <NuxtLink to="/profile" class="block bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.name" class="w-full h-full object-cover" />
                <span v-else class="text-xl font-bold text-indigo-400">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
              </div>
              <div>
                <p class="font-bold text-lg">{{ userDetails?.displayName || user?.displayName || user?.name }}</p>
                <p class="text-sm text-gray-400">View and edit your public profile</p>
              </div>
            </div>
            <svg class="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </NuxtLink>

        <!-- General Settings -->
        <div class="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            General Preferences
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Theme</p>
                <p class="text-sm text-gray-400">Currently fixed to dark mode</p>
              </div>
              <div class="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl cursor-pointer text-sm font-bold border border-indigo-500/20">
                Dark Mode
              </div>
            </div>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Language</p>
                <p class="text-sm text-gray-400">Select your preferred language</p>
              </div>
              <select class="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                <option value="en">English (US)</option>
                <option value="bn">Bengali</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Currency</p>
                <p class="text-sm text-gray-400">Default currency for invoices</p>
              </div>
              <select class="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Notifications
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Email Notifications</p>
                <p class="text-sm text-gray-400">Get updates about your invoices via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Marketing Emails</p>
                <p class="text-sm text-gray-400">Receive news and special offers</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security
          </h2>
          <div class="space-y-4">
            <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all text-left">
              <div>
                <p class="font-medium">Change Password</p>
                <p class="text-sm text-gray-400">Update your account password</p>
              </div>
              <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="font-medium">Two-Factor Authentication</p>
                <p class="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <span class="text-xs font-bold text-amber-500 uppercase tracking-widest px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">Disabled</span>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 backdrop-blur-xl">
          <h2 class="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Danger Zone
          </h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-white">Delete Account</p>
              <p class="text-sm text-gray-400">Permanently remove your account and all data</p>
            </div>
            <button class="px-6 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 cursor-pointer">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, userDetails, isAuthReady, isLoggedIn } = useAuth()

useHead({
  title: 'Settings - InvoiceAI',
})
</script>
