<script setup lang="ts">
const props = defineProps<{
  albums: any[]
}>()
</script>

<template>
  <div class="space-y-24">
    <div v-for="album in albums" :key="album.id">
      <!-- Album Header -->
      <div class="mb-8 border-l-4 border-orange pl-6">
        <h3 class="text-3xl md:text-4xl font-display font-bold text-white mb-2 uppercase tracking-wider">
          {{ album.title }}
        </h3>
        <p class="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
          {{ album.description }}
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="vessel in album.vessels_gallery" 
          :key="vessel.id" 
          class="group relative overflow-hidden rounded-xl bg-navy-900 border border-white/5 hover:border-orange/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
        >
          <!-- Image Container -->
          <div class="h-96 md:h-[500px] overflow-hidden relative">
            <div class="absolute inset-0 bg-navy-950/30 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
            <NuxtImg 
              :src="vessel.image_url" 
              :alt="vessel.vessel_name"
              format="webp"
              width="600"
              fit="cover"
              loading="lazy"
              placeholder
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />
            
            <!-- Overlay Content -->
            <div class="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-y-4 md:translate-y-8 group-hover:translate-y-0">
              <div class="border-l-2 border-orange pl-4 mb-2">
                <h3 class="text-2xl font-display font-bold text-white uppercase">{{ vessel.vessel_name }}</h3>
              </div>
              <p class="text-slate-400 text-sm line-clamp-3 font-light">{{ vessel.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
