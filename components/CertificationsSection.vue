<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: certifications } = await useAsyncData('certifications', async () => {
  const { data } = await supabase
    .from('certifications')
    .select('*')
    .order('code', { ascending: true })
  return data
})
</script>

<template>
  <section class="py-24 bg-navy-900 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
      <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      <div class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="flex items-center gap-4 mb-16">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-orange/50"></div>
        <h2 class="text-3xl md:text-4xl font-bold text-white tracking-wider uppercase text-center">
          <span class="text-orange">///</span> Qualificações & Certificados
        </h2>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-orange/50"></div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="cert in certifications" 
          :key="cert.id"
          class="group relative bg-navy-800 border border-white/10 hover:border-orange/50 transition-all duration-300 p-6 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)]"
        >
          <!-- Corner Accents -->
          <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <!-- Content -->
          <div class="flex flex-col h-full">
            <div class="flex justify-between items-start mb-4">
              <span class="text-2xl font-bold font-mono text-orange tracking-widest">{{ cert.code }}</span>
              <div class="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
            </div>
            
            <h3 class="text-gray-300 font-medium leading-tight mb-2 group-hover:text-white transition-colors">
              {{ cert.description_pt }}
            </h3>
            
            <p v-if="cert.description_en" class="text-xs text-gray-500 mt-auto font-mono uppercase tracking-wider">
              {{ cert.description_en }}
            </p>
          </div>

          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>
    </div>
  </section>
</template>
