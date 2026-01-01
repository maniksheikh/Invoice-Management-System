<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white">Invoices</h1>
          <p class="text-gray-400 mt-1">Manage and track your business billing</p>
        </div>
        <NuxtLink 
          to="/invoices/create"
          class="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-8">
        Error loading invoices: {{ error.message }}
        <button @click="refresh" class="ml-4 underline">Retry</button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <p class="text-sm text-gray-400 mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
          <div class="mt-2 flex items-center text-xs" :class="stat.trendUp ? 'text-emerald-400' : 'text-gray-500'">
            <svg v-if="stat.trendUp" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {{ stat.trend }}
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-96">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search invoice or client..." 
            class="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <select 
            v-model="statusFilter"
            class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <!-- Invoices List (Desktop Table / Mobile Cards) -->
      <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-white/5 transition-colors group">
                <td class="px-6 py-4">
                  <span class="text-white font-medium">#{{ invoice.number }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {{ invoice.client.split(' ').map(n => n[0]).join('') }}
                    </div>
                    <span class="text-gray-300">{{ invoice.client }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-gray-400 text-sm">{{ invoice.date }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-white font-semibold">${{ invoice.amount.toLocaleString() }}</span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="statusClasses[invoice.status]"
                  >
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <NuxtLink :to="`/invoices/${invoice._id}`" class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="View">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                    <button class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Download">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Layout (Cards) -->
        <div class="md:hidden divide-y divide-white/5">
          <div v-for="invoice in filteredInvoices" :key="invoice.id" class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-white font-medium">#{{ invoice.number }}</span>
              <span 
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="statusClasses[invoice.status]"
              >
                {{ invoice.status }}
              </span>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-300">
                {{ invoice.client.split(' ').map(n => n[0]).join('') }}
              </div>
              <div>
                <p class="text-white font-medium">{{ invoice.client }}</p>
                <p class="text-gray-400 text-xs">{{ invoice.date }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-bold text-white">${{ invoice.amount.toLocaleString() }}</span>
              <div class="flex gap-2">
                <NuxtLink :to="`/invoices/${invoice._id}`" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all">
                  View
                </NuxtLink>
                <button class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredInvoices.length === 0" class="py-20 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-white font-medium">No invoices found</h3>
          <p class="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showCreateModal = false"></div>
      <div class="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-6">Create New Invoice</h2>
        
        <form @submit.prevent="createInvoice" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Invoice Number</label>
            <input v-model="newInvoice.number" type="text" required placeholder="INV-2024-001" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
            <input v-model="newInvoice.client" type="text" required placeholder="Acme Corp" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
              <input v-model.number="newInvoice.amount" type="number" step="0.01" required placeholder="0.00" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select v-model="newInvoice.status" class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer">
                <option value="pending" class="bg-slate-900">Pending</option>
                <option value="paid" class="bg-slate-900">Paid</option>
                <option value="overdue" class="bg-slate-900">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <input v-model="newInvoice.date" type="text" required placeholder="Dec 31, 2024" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="flex-1 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" :disabled="creating" class="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
              {{ creating ? 'Creating...' : 'Create Invoice' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const searchQuery = ref('')
const statusFilter = ref('all')
const showCreateModal = ref(false)
const creating = ref(false)

const newInvoice = ref({
  number: '',
  client: '',
  amount: 0,
  status: 'pending',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

// Fetch Invoices from Backend
const { data: invoices, pending, error, refresh } = await useFetch(`${config.public.apiBase}/invoice/v1`, {
  lazy: false,
  server: true
})

// Create Invoice Function
const createInvoice = async () => {
  try {
    creating.value = true
    const { error: postError } = await useFetch(`${config.public.apiBase}/invoice/v1`, {
      method: 'POST',
      body: newInvoice.value
    })

    if (postError.value) throw postError.value

    // Success
    showCreateModal.value = false
    newInvoice.value = {
      number: '',
      client: '',
      amount: 0,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    await refresh()
  } catch (err) {
    alert('Failed to create invoice: ' + err.message)
  } finally {
    creating.value = false
  }
}

// Dynamic Statistics
const stats = computed(() => {
  if (!invoices.value) return []
  
  const total = invoices.value.reduce((sum, inv) => sum + inv.amount, 0)
  const paidCount = invoices.value.filter(inv => inv.status === 'paid').length
  const pendingAmount = invoices.value
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return [
    { label: 'Total Revenue', value: `$${total.toLocaleString()}`, trend: 'Total volume', trendUp: true },
    { label: 'Paid Invoices', value: paidCount.toString(), trend: `${Math.round((paidCount / (invoices.value.length || 1)) * 100)}% collection rate`, trendUp: true },
    { label: 'Outstanding Amount', value: `$${pendingAmount.toLocaleString()}`, trend: 'Requires attention', trendUp: false },
  ]
})

const statusClasses = {
  paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
}

const filteredInvoices = computed(() => {
  if (!invoices.value) return []
  return invoices.value.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         invoice.client.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || invoice.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

useHead({
  title: 'Invoices - InvoiceAI',
})
</script>

<style scoped>
/* Custom select styling for consistent look across browsers */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
