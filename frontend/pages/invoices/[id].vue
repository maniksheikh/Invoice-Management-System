<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <!-- Header / Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <NuxtLink 
            to="/invoices" 
            class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors group"
          >
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Invoices
          </NuxtLink>
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-white">Invoice #{{ invoice?.number }}</h1>
            <div class="relative group/status">
              <span 
                v-if="invoice"
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-all border border-white/10"
                :class="statusClasses[invoice.status]"
              >
                {{ invoice.status === 'unpaid' ? 'Unpaid' : invoice.status }}
              </span>
              <div class="absolute left-0 top-full mt-1 hidden group-hover/status:block z-50 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]">
                <button v-for="s in ['paid', 'unpaid', 'overdue']" :key="s" 
                  @click="updateStatus(s)"
                  class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
                  :class="s === invoice?.status ? 'text-indigo-400' : 'text-gray-400'"
                >
                  {{ s }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="openEditModal"
            class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-semibold border border-white/10 transition-all"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button 
            @click="handlePrint"
            class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-semibold border border-white/10 transition-all"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-6 py-2.5 rounded-xl font-semibold border border-rose-500/20 transition-all"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Main Content / Invoice Card -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>

      <div v-else-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-8 rounded-2xl text-center">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-xl font-bold mb-2">Invoice Not Found</h2>
        <p class="mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/invoices" class="inline-flex bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold">
          Back to Invoices
        </NuxtLink>
      </div>

      <div v-else-if="invoice" id="invoice-printable" class="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <!-- Card Header / Brand -->
        <div class="p-8 sm:p-12 border-b border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
          <div class="flex flex-col sm:flex-row justify-between gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-2xl font-black text-white tracking-tight">InvoiceAI</span>
              </div>
              <div class="text-gray-400 space-y-1 text-sm">
                <p>123 Business Avenue</p>
                <p>Tech City, TC 54321</p>
                <p>support@invoiceai.com</p>
              </div>
            </div>
            
            <div class="text-left sm:text-right space-y-2">
              <p class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Invoice Date</p>
              <p class="text-xl font-bold text-white">{{ invoice.date }}</p>
              <div class="pt-4">
                <p class="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Status</p>
                <p class="text-lg font-bold text-white capitalize">{{ invoice.status === 'unpaid' ? 'Unpaid' : invoice.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill To / Details -->
        <div class="p-8 sm:p-12">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
            <div>
              <p class="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Bill To</p>
              <div class="space-y-2">
                <p class="text-2xl font-bold text-white">{{ invoice.client }}</p>
                <p class="text-gray-400">client@example.com</p>
                <p class="text-gray-400">Client Address Placeholder</p>
              </div>
            </div>
          </div>

          <!-- Items Table (Mock for now as schema is simple) -->
          <div class="overflow-x-auto mb-12">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr>
                  <td class="py-6">
                    <p class="text-white font-medium mb-1">General Services / Products</p>
                    <p class="text-sm text-gray-500">Standard billing for services provided as per agreement.</p>
                  </td>
                  <td class="py-6 text-right">
                    <span class="text-white font-bold">${{ invoice.amount.toLocaleString() }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="flex justify-end">
            <div class="w-full sm:w-80 space-y-4">
              <div class="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${{ invoice.amount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div class="pt-4 border-t border-white/10 flex justify-between items-center">
                <span class="text-xl font-bold text-white">Total Amount</span>
                <span class="text-3xl font-black text-indigo-400">${{ invoice.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 sm:p-12 bg-white/5 border-t border-white/10 text-center">
          <p class="text-gray-500 text-sm">Thank you for your business! Please settle the payment by the due date.</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div class="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2 text-center">Delete Invoice?</h2>
        <p class="text-gray-400 text-center mb-6">Are you sure you want to delete this invoice? This action cannot be undone.</p>
        
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-medium">
            Cancel
          </button>
          <button @click="handleDelete" :disabled="deleting" class="flex-1 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20">
            {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Edit Invoice Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showEditModal = false"></div>
      <div class="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-6">Edit Invoice</h2>
        
        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Invoice Number</label>
            <input v-model="editForm.number" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
            <input v-model="editForm.client" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
              <input v-model.number="editForm.amount" type="number" step="0.01" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select v-model="editForm.status" class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer">
                <option value="unpaid" class="bg-slate-900">Unpaid</option>
                <option value="paid" class="bg-slate-900">Paid</option>
                <option value="overdue" class="bg-slate-900">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <input v-model="editForm.date" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showEditModal = false" class="flex-1 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" :disabled="updating" class="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
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

const route = useRoute()
const config = useRuntimeConfig()
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const deleting = ref(false)
const updating = ref(false)
const updatingStatus = ref(false)

const { data: invoice, pending, error, refresh } = await useFetch(`${config.public.apiBase}/invoice/v1/${route.params.id}`)

const editForm = ref({
  number: '',
  client: '',
  amount: 0,
  status: '',
  date: ''
})

const openEditModal = () => {
  if (invoice.value) {
    editForm.value = {
      number: invoice.value.number,
      client: invoice.value.client,
      amount: invoice.value.amount,
      status: invoice.value.status,
      date: invoice.value.date
    }
    showEditModal.value = true
  }
}

const handleUpdate = async () => {
  try {
    updating.value = true
    const { error: patchError } = await useFetch(`${config.public.apiBase}/invoice/v1/${route.params.id}`, {
      method: 'PUT',
      body: editForm.value
    })

    if (patchError.value) throw patchError.value
    
    showEditModal.value = false
    await refresh()
  } catch (err) {
    alert('Failed to update invoice: ' + (err.data?.message || err.message))
  } finally {
    updating.value = false
  }
}

const statusClasses = {
  paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  unpaid: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
}

const handlePrint = () => {
  window.print()
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    const { error: delError } = await useFetch(`${config.public.apiBase}/invoice/v1/${route.params.id}`, {
      method: 'DELETE'
    })

    if (delError.value) throw delError.value

    showDeleteModal.value = false
    navigateTo('/invoices')
  } catch (err) {
    alert('Failed to delete invoice: ' + err.message)
  } finally {
    deleting.value = false
  }
}

const updateStatus = async (status) => {
  try {
    updatingStatus.value = true
    const { error: patchError } = await useFetch(`${config.public.apiBase}/invoice/v1/${route.params.id}/status`, {
      method: 'PATCH',
      body: { status }
    })

    if (patchError.value) throw patchError.value
    await refresh()
  } catch (err) {
    alert('Failed to update status: ' + (err.data?.message || err.message))
  } finally {
    updatingStatus.value = false
  }
}

useHead({
  title: `Invoice Details - InvoiceAI`,
})
</script>

<style scoped>
@media print {
  .min-h-screen {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  nav, .flex.flex-col.md\:flex-row.md\:items-center.md\:justify-between.mb-8.gap-4, .NuxtLink, button {
    display: none !important;
  }
  #invoice-printable {
    background: white !important;
    color: black !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .text-white { color: black !important; }
  .text-gray-400, .text-gray-500 { color: #4b5563 !important; }
  .text-indigo-400 { color: #4338ca !important; }
  .bg-white\/5, .bg-gradient-to-br { background: transparent !important; }
  .border { border-color: #e5e7eb !important; }
}
</style>
