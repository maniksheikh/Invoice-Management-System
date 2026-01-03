<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink 
          to="/invoices" 
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group"
        >
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Invoices
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white">Create New Invoice</h1>
        <p class="text-gray-400 mt-1">Fill in the details below to generate a new invoice.</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Invoice Number -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Invoice Number</label>
              <div class="relative">
                <input 
                  v-model="form.number" 
                  type="text" 
                  required 
                  placeholder="INV-2024-001" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Issue Date</label>
              <div class="relative">
                <input 
                  v-model="form.date" 
                  type="text" 
                  required 
                  placeholder="Dec 31, 2024" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Client Name -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
            <input 
              v-model="form.client" 
              type="text" 
              required 
              placeholder="Enter client or company name" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Amount ($)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  v-model.number="form.amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  placeholder="0.00" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <div class="relative">
                <select 
                  v-model="form.status" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all"
                >
                  <option value="unpaid" class="bg-slate-900">Unpaid</option>
                  <option value="paid" class="bg-slate-900">Paid</option>
                  <option value="overdue" class="bg-slate-900">Overdue</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-white/10 pt-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                @click="navigateTo('/invoices')" 
                class="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-medium text-center"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="submitting" 
                class="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <svg v-if="submitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Creating Invoice...' : 'Create Invoice' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const submitting = ref(false)

const form = ref({
  number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  client: '',
  amount: null,
  status: 'unpaid',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // Validate amount
    if (form.value.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    const { error } = await useFetch(`${config.public.apiBase}/invoice/v1`, {
      method: 'POST',
      body: form.value
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to create invoice')
    }

    // Success - redirect back
    navigateTo('/invoices')
  } catch (err) {
    console.error('Error creating invoice:', err)
    alert('Failed to create invoice: ' + err.message)
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'Create Invoice - InvoiceAI',
})
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
