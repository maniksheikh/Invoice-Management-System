<template>
  <div :class="['relative isolate overflow-hidden min-h-screen transition-colors duration-500', store.theme === 'dark' ? 'text-white' : 'text-slate-900']">
    <!-- Background Gradients -->
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
    </div>
    <!-- Loading State -->
    <div v-if="!isAuthReady" class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    <!-- Authenticated Dashboard -->
    <div v-else-if="isLoggedIn" class="mx-auto max-w-7xl px-6 pt-32 pb-24">
      <div class="mb-12">
        <h1 class="text-4xl font-bold tracking-tight">Welcome back, {{ user?.name }}!</h1>
        <p :class="['mt-2 transition-colors', store.theme === 'dark' ? 'text-gray-400' : 'text-slate-500']">Here's what's happening with your business today.</p>
      </div>
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="stat in dashboardStats" :key="stat.label" :class="['border rounded-3xl p-8 backdrop-blur-xl relative group transition-all', store.theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-indigo-500/30 shadow-sm']">
          <div :class="`absolute top-6 right-6 p-3 rounded-2xl ${stat.color} bg-opacity-10 text-opacity-100`">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <p :class="['text-sm font-medium mb-2 transition-colors', store.theme === 'dark' ? 'text-gray-400' : 'text-slate-500']">{{ stat.label }}</p>
          <p class="text-4xl font-bold mb-2">{{ stat.value }}</p>
          <p :class="['text-xs transition-colors', store.theme === 'dark' ? 'text-gray-500' : 'text-slate-400']">{{ stat.description }}</p>
        </div>
      </div>
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink 
          to="/invoices/create"
          class="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </NuxtLink>
        <NuxtLink to="/invoices" :class="['flex items-center gap-4 border p-6 rounded-3xl transition-all group', store.theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-indigo-500/30 shadow-sm']">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', store.theme === 'dark' ? 'bg-white/10' : 'bg-slate-100']">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">All Invoices</p>
            <p :class="['text-xs transition-colors', store.theme === 'dark' ? 'text-gray-400' : 'text-slate-500']">Manage all records</p>
          </div>
        </NuxtLink>
        <div class="flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl opacity-50 cursor-not-allowed">
          <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Clients</p>
            <p class="text-xs text-gray-400">Coming Soon</p>
          </div>
        </div>
        <NuxtLink to="/settings" :class="['flex items-center gap-4 border p-6 rounded-3xl transition-all group', store.theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-indigo-500/30 shadow-sm']">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', store.theme === 'dark' ? 'bg-white/10' : 'bg-slate-100']">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Settings</p>
            <p :class="['text-xs transition-colors', store.theme === 'dark' ? 'text-gray-400' : 'text-slate-500']">Account preferences</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Recent Invoices Section -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white tracking-tight">Recent Invoices</h2>
          <NuxtLink to="/invoices" class="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            View all invoices &rarr;
          </NuxtLink>
        </div>        
        <div class="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
          <div v-if="!invoices?.length" class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-400 font-medium">No invoices found. Start by creating one!</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/5 bg-white/5">
                  <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="invoice in invoices.slice(0, 5)" :key="invoice._id" class="hover:bg-white/5 transition-colors group">
                  <td class="px-6 py-4">
                    <span class="text-white font-medium">#{{ invoice.number }}</span>
                    <p class="text-[10px] text-gray-500 mt-0.5">{{ invoice.date }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-300">{{ invoice.client }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-white font-bold">${{ invoice.amount.toLocaleString() }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                      :class="statusClasses[invoice.status]">
                      {{ invoice.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <NuxtLink :to="`/invoices/${invoice._id}`" class="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                      Details
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Landing Page -->
    <div v-else class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-40">
      <div class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
        <div class="mt-24 sm:mt-32 lg:mt-16">
          <div class="inline-flex space-x-6">
            <span class="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">What's new</span>
            <span class="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
              <span>Automated Billing v1.0</span>
            </span>
          </div>
        </div>
        <h1 class="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          AI-Powered Invoice Management
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Streamline your billing process with intelligent automation. Manage invoices, track payments, and grow your business with InvoiceAI.
        </p>
        <div class="mt-10 flex items-center gap-x-6">
          <NuxtLink to="/register" class="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all transform hover:scale-105">
            Get started for free
          </NuxtLink>
          <NuxtLink to="/login" class="text-sm font-semibold leading-6 text-white group">Sign in to account <span aria-hidden="true" class="inline-block transition-transform group-hover:translate-x-1">→</span></NuxtLink>
        </div>
      </div>   
      <!-- Preview Image -->
      <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
        <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <div class="-m-2 rounded-3xl bg-gray-900/50 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-3xl lg:p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div class="w-[20rem] h-[12rem] sm:w-[57rem] sm:h-[32rem] lg:w-[45rem] lg:h-[25rem] xl:w-[57rem] xl:h-[32rem] rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex flex-col items-center justify-center p-12">
              <div class="w-full h-full border border-white/5 rounded-xl bg-slate-950/40 p-6 flex flex-col gap-6">
                <div class="h-8 w-48 bg-white/10 rounded-lg"></div>
                <div class="grid grid-cols-3 gap-6">
                  <div v-for="i in 3" :key="i" class="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                <div class="flex-1 bg-white/5 rounded-xl border border-white/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const store = useMainStore()
const { user, isLoggedIn, isAuthReady } = useAuth()

useHead({
  title: isLoggedIn.value ? 'Dashboard - InvoiceAI' : 'AI Invoice Management - Smart Billing',
  meta: [
    { name: 'description', content: 'The next generation of invoice management powered by AI.' }
  ]
})

const config = useRuntimeConfig()

watch(isLoggedIn, (val) => {
  console.log('Index.vue: isLoggedIn changed to', val)
}, { immediate: true })

const RevenueIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
})

const PendingIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
})

const CollectionIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
})

const { $axios } = useNuxtApp()
const { data: invoices, refresh: refreshInvoices } = await useAsyncData('dashboard-invoices', async () => {
  if (!isLoggedIn.value) return []
  try {
    const response = await $axios.get('/invoice/v1')
    return response.data
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return []
  }
},

{
  immediate: isLoggedIn.value,
  watch: [isLoggedIn]
})

const dashboardStats = computed(() => {
  if (!invoices.value) return [
    { label: 'Total Revenue', value: '$0', description: 'No data available', icon: RevenueIcon, color: 'bg-emerald-500 text-emerald-500' },
    { label: 'Pending Invoices', value: '0', description: 'Requires attention', icon: PendingIcon, color: 'bg-amber-500 text-amber-500' },
    { label: 'Collection Rate', value: '0%', description: 'Efficiency score', icon: CollectionIcon, color: 'bg-indigo-500 text-indigo-500' }
  ]
  
  const total = invoices.value.reduce((sum, inv) => sum + inv.amount, 0)
  const pendingCount = invoices.value.filter(inv => inv.status !== 'paid').length
  const paidCount = invoices.value.filter(inv => inv.status === 'paid').length
  const rate = Math.round((paidCount / (invoices.value.length || 1)) * 100)

  return [
    { label: 'Total Revenue', value: `$${total.toLocaleString()}`, description: 'Lifetime volume', icon: RevenueIcon, color: 'bg-emerald-400 text-emerald-400' },
    { label: 'Pending Invoices', value: pendingCount.toString(), description: 'Active billable items', icon: PendingIcon, color: 'bg-amber-400 text-amber-400' },
    { label: 'Collection Rate', value: `${rate}%`, description: 'Overall efficiency', icon: CollectionIcon, color: 'bg-indigo-400 text-indigo-400' }
  ]
})

const statusClasses = {
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  unpaid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
}

</script>
