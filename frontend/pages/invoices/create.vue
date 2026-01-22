<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <!-- Loading State -->
      <div v-if="!isAuthReady" class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
      <div v-else-if="isLoggedIn">
        <!-- Header -->
      <div class="mb-8">
        <NuxtLink 
          to="/invoices" 
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group">
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
        <div v-if="createdInvoice" class="space-y-6">
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Invoice Created Successfully!</h2>
            <p class="text-gray-400">Would you like to upload an image for this invoice?</p>
          </div>
          <div class="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload" 
              class="hidden" 
              id="invoice-image"
              :disabled="submitting">
            <label for="invoice-image" class="cursor-pointer block">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <p class="text-sm text-gray-400 mb-2">Click to upload invoice image</p>
              <p class="text-xs text-gray-500">SVG, PNG, JPG, WEBP allowed</p>
            </label>
          </div>
          <div class="flex justify-end gap-4">
            <NuxtLink 
              to="/invoices" 
              class="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-all font-bold shadow-lg shadow-indigo-500/20 cursor-pointer">
              View Invoices
            </NuxtLink>
            <button 
              @click="navigateTo('/invoices')" 
              class="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-medium cursor-pointer">
              Skip upload
            </button>
          </div>
        </div>
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
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
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
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
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
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
                  class="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"/>
              </div>
            </div>
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <div class="relative">
                <select 
                  v-model="form.status" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all">
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
                class="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-medium text-center cursor-pointer">
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="submitting" 
                class="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
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
  </div>
</template>

<script setup>
  useHead({
  title: 'Create Invoice - InvoiceAI',
})

definePageMeta({
  middleware: ['auth']
})

const { isAuthReady, isLoggedIn } = useAuth()
const config = useRuntimeConfig()
const createdInvoice = ref(null)
const submitting = ref(false)

const form = ref({
  number: '',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  client: '',
  amount: 0,
  status: 'unpaid'
})

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    submitting.value = true
    await $fetch(`${config.public.apiBase}/invoice/v1/${createdInvoice.value._id}/upload`, {
      method: 'POST',
      body: formData
    })
    navigateTo('/invoices')
  } catch (err) {
    console.error('Error uploading image:', err)
    alert('Failed to upload image: ' + (err.data?.message || err.message))
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
      if (form.value.amount <= 0) {
      alert('Please enter a valid amount')
      submitting.value = false
      return
    }
    const { invoice } = await $fetch(`${config.public.apiBase}/invoice/v1`, {
      method: 'POST',
      body: form.value
    })
    createdInvoice.value = invoice
  } catch (err) {
    console.error('Error creating invoice:', err)
    const errorMsg = err.data?.message || err.message
    alert('Failed to create invoice: ' + errorMsg)
  } finally {
    submitting.value = false
  }
}

</script>

<style scoped>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
