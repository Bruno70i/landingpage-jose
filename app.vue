<template>
  <div class="min-h-screen bg-navy-950 text-slate-300 font-sans selection:bg-cyan selection:text-navy-950 overflow-x-hidden">
    <!-- Global 3D Background -->
    <ClientOnly>
      <TheOceanScene />
    </ClientOnly>
    
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@300;500;700&family=Fira+Code&display=swap');

/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.98);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020c1b;
}
::-webkit-scrollbar-thumb {
  background: #112240;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #64ffda;
}
</style>
