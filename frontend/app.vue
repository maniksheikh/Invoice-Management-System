<template>
  <div :class="[
    'min-h-screen transition-colors duration-500 selection:bg-indigo-500/30',
    store.theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
  ]">
    <Navbar />
    <div class="pt-16">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
const store = useMainStore()

if (process.client) {
  store.initTheme()
}
</script>


