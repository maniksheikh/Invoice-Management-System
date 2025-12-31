<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white">Invoices</h1>
          <p class="text-gray-400 mt-1">Manage and track your business billing</p>
        </div>
        <button class="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </button>
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

      <!-- Invoices Table -->
      <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div class="overflow-x-auto">
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
                    <button class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="View">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
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
  </div>
</template>

<script setup>
const searchQuery = ref('')
const statusFilter = ref('all')

const stats = [
  { label: 'Total Revenue', value: '$45,280.00', trend: '+12.5% vs last month', trendUp: true },
  { label: 'Paid Invoices', value: '24', trend: '85% collection rate', trendUp: true },
  { label: 'Pending Amount', value: '$12,450.00', trend: 'Requires attention', trendUp: false },
]

const statusClasses = {
  paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
}

const mockInvoices = [
  { id: 1, number: 'INV-2024-001', client: 'Acme Corp', date: 'Dec 28, 2024', amount: 3500.00, status: 'paid' },
  { id: 2, number: 'INV-2024-002', client: 'Global Tech', date: 'Dec 25, 2024', amount: 1200.50, status: 'pending' },
  { id: 3, number: 'INV-2024-003', client: 'Design Studio', date: 'Dec 20, 2024', amount: 850.00, status: 'overdue' },
  { id: 4, number: 'INV-2024-004', client: 'Nova Soft', date: 'Dec 15, 2024', amount: 5600.00, status: 'paid' },
  { id: 5, number: 'INV-2024-005', client: 'Pixel Perfect', date: 'Dec 10, 2024', amount: 2100.00, status: 'pending' },
]

const filteredInvoices = computed(() => {
  return mockInvoices.filter(invoice => {
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
