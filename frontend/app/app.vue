<template>
  <div class="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
    <Navbar />
    <div class="pt-16">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </div>
</template>

<style>
@import "~/assets/css/main.css";

body {
  @apply bg-slate-950;
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
