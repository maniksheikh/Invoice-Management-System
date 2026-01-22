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
          class="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20">
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
        <button @click="refresh" class="ml-4 underline cursor-pointer">Retry</button>
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
            class="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <select 
            v-model="statusFilter"
            class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer min-w-[120px]">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
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
              <tr v-for="invoice in filteredInvoices" :key="invoice._id" class="hover:bg-white/5 transition-colors group">
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
                    :class="statusClasses[invoice.status]">
                    {{ invoice.status === 'unpaid' ? 'Unpaid' : invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <NuxtLink :to="`/invoices/${invoice._id}`" class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title="View">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                    <button @click="confirmDelete(invoice)" class="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer" title="Delete">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div class="relative">
                      <button 
                        @click="activeStatusMenu = activeStatusMenu === invoice._id ? null : invoice._id"
                        class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" 
                        title="Change Status">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <div v-if="activeStatusMenu === invoice._id" class="absolute right-0 top-full mt-1 z-50 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]">
                        <button v-for="s in ['paid', 'unpaid', 'overdue']" :key="s" 
                          @click="updateStatus(invoice._id, s); activeStatusMenu = null"
                          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
                          :class="s === invoice.status ? 'text-indigo-400' : 'text-gray-400'">
                          {{ s }}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Layout (Cards) -->
        <div class="md:hidden divide-y divide-white/5">
          <div v-for="invoice in filteredInvoices" :key="invoice._id" class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-white font-medium">#{{ invoice.number }}</span>
              <span 
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="statusClasses[invoice.status]">
                {{ invoice.status === 'unpaid' ? 'Unpaid' : invoice.status }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-300">
                {{ (invoice.client || 'C').split(' ').map(n => n[0]).join('') }}
              </div>
              <div>
                <p class="text-white font-medium">{{ invoice.client }}</p>
                <p class="text-gray-400 text-xs">{{ invoice.date }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-bold text-white">${{ invoice.amount.toLocaleString() }}</span>
              <div class="flex gap-2">
                <NuxtLink :to="`/invoices/${invoice._id}`" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all cursor-pointer">
                  View</NuxtLink>
                <button @click="confirmDelete(invoice)" class="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all cursor-pointer">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div class="relative">
                  <button 
                    @click="activeStatusMenu = activeStatusMenu === invoice._id ? null : invoice._id"
                    class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all cursor-pointer">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div v-if="activeStatusMenu === invoice._id" class="absolute right-0 bottom-full mb-1 z-50 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]">
                    <button v-for="s in ['paid', 'unpaid', 'overdue']" :key="s" 
                      @click="updateStatus(invoice._id, s); activeStatusMenu = null"
                      class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
                      :class="s === invoice.status ? 'text-indigo-400' : 'text-gray-400'">
                      {{ s }}
                    </button>
                  </div>
                </div>
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
          <p class="text-gray-500 text-sm mt-1 mb-8">Try adjusting your search or filters.</p>
          <NuxtLink 
            to="/invoices/create"
            class="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105">
            Create Your First Invoice
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteListModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showDeleteListModal = false"></div>
    <div class="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
      <div class="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-white mb-2 text-center">Delete Invoice?</h2>
      <p class="text-gray-400 text-center mb-6">Are you sure you want to delete invoice #{{ invoiceToDelete?.number }}? This action cannot be undone.</p>
      <div class="flex gap-3">
        <button @click="showDeleteListModal = false" class="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-medium cursor-pointer">
          Cancel
        </button>
        <button @click="handleDelete" :disabled="deletingInvoice" class="flex-1 cursor-pointer bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20">
          {{ deletingInvoice ? 'Deleting...' : 'Yes, Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

  useHead({
  title: 'Invoices - InvoiceAI',
})

definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const searchQuery = ref('')
const statusFilter = ref('all')
const showDeleteListModal = ref(false)
const invoiceToDelete = ref(null)
const updatingStatus = ref(false)
const deletingInvoice = ref(false)
const activeStatusMenu = ref(null)

// Fetch Invoices from Backend
const { data: invoices, pending, error, refresh } = await useFetch(`${config.public.apiBase}/invoice/v1`, {
  lazy: false,
  server: true
})

// Update Status Function
const updateStatus = async (id, status) => {
  try {
    updatingStatus.value = true
    await $fetch(`${config.public.apiBase}/invoice/v1/${id}/status`, {
      method: 'PATCH',
      body: { status }
    })
    await refresh()
  } catch (err) {
    alert('Failed to update status: ' + (err.data?.message || err.message))
  } finally {
    updatingStatus.value = false
  }
}

// Delete Functions
const confirmDelete = (invoice) => {
  invoiceToDelete.value = invoice
  showDeleteListModal.value = true
}

const handleDelete = async () => {
  if (!invoiceToDelete.value) return 
  try {
    deletingInvoice.value = true
    await $fetch(`${config.public.apiBase}/invoice/v1/${invoiceToDelete.value._id}`, {
      method: 'DELETE'
    })
    showDeleteListModal.value = false
    invoiceToDelete.value = null
    await refresh()
  } catch (err) {
    alert('Failed to delete invoice: ' + (err.data?.message || err.message))
  } finally {
    deletingInvoice.value = false
  }
}

// Dynamic Statistics
const stats = computed(() => {
  if (!invoices.value) return []
  const total = invoices.value.reduce((sum, inv) => sum + inv.amount, 0)
  const paidCount = invoices.value.filter(inv => inv.status === 'paid').length
  const pendingAmount = invoices.value
    .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)
  return [
    { label: 'Total Revenue', value: `$${total.toLocaleString()}`, trend: 'Total volume', trendUp: true },
    { label: 'Paid Invoices', value: paidCount.toString(), trend: `${Math.round((paidCount / (invoices.value.length || 1)) * 100)}% collection rate`, trendUp: true },
    { label: 'Outstanding Amount', value: `$${pendingAmount.toLocaleString()}`, trend: 'Requires attention', trendUp: false },
  ]
})

const statusClasses = {
  paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  unpaid: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
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

</script>

<style scoped>

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
