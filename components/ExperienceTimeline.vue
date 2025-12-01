<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  experiences: any[]
}>()

onMounted(() => {
  // Animate cards on scroll
  gsap.utils.toArray('.experience-card').forEach((card: any, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1
    })
  })

  // Animate the central line
  gsap.from('.timeline-line', {
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    },
    height: 0,
    ease: 'none'
  })
})
</script>

<template>
  <div class="timeline-container relative container mx-auto px-4">
    <!-- Central Glowing Line -->
    <div class="timeline-line absolute left-4 md:left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-cyan via-cyan to-transparent shadow-[0_0_15px_#64ffda] z-0 hidden md:block"></div>
    <div class="absolute left-4 top-0 w-[2px] h-full bg-white/10 md:hidden"></div>

    <div class="space-y-24">
      <div v-for="(exp, index) in experiences" :key="exp.id" class="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center">
        
        <!-- Timeline Dot -->
        <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-950 border-2 border-cyan rounded-full z-10 shadow-[0_0_10px_#64ffda]">
          <div class="absolute inset-0 bg-cyan animate-ping opacity-75 rounded-full"></div>
        </div>

        <!-- Left Side (Date for Even, Content for Odd) -->
        <div class="w-full md:w-1/2 md:pr-12 md:text-right" v-if="index % 2 === 0">
          <div class="experience-card group relative p-6 rounded-xl bg-navy-900/40 backdrop-blur-md border border-white/5 hover:border-cyan/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-neon">
            <span class="text-cyan font-mono text-xs tracking-widest mb-2 block">{{ exp.start_date }} — {{ exp.end_date || 'ATUAL' }}</span>
            <h3 class="text-2xl font-display font-bold text-white mb-1 group-hover:text-cyan transition-colors">{{ exp.role }}</h3>
            <h4 class="text-lg text-slate-400 mb-4">{{ exp.company }}</h4>
            
            <div class="flex flex-col gap-6 items-start">
              <NuxtImg 
                v-if="exp.image_url" 
                :src="exp.image_url" 
                class="w-full h-48 md:h-64 rounded-lg object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg"
              />
              <p class="text-orange text-base leading-relaxed font-medium">{{ exp.description }}</p>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:pr-12 md:text-right hidden md:block" v-else>
          <!-- Empty space for layout balance -->
        </div>

        <!-- Right Side (Content for Even, Date for Odd) -->
        <div class="w-full md:w-1/2 md:pl-12" v-if="index % 2 !== 0">
          <div class="experience-card group relative p-6 rounded-xl bg-navy-900/40 backdrop-blur-md border border-white/5 hover:border-cyan/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-neon">
            <span class="text-cyan font-mono text-xs tracking-widest mb-2 block">{{ exp.start_date }} — {{ exp.end_date || 'ATUAL' }}</span>
            <h3 class="text-2xl font-display font-bold text-white mb-1 group-hover:text-cyan transition-colors">{{ exp.role }}</h3>
            <h4 class="text-lg text-slate-400 mb-4">{{ exp.company }}</h4>
            
            <div class="flex flex-col gap-6 items-start">
              <NuxtImg 
                v-if="exp.image_url" 
                :src="exp.image_url" 
                class="w-full h-48 md:h-64 rounded-lg object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg"
              />
              <p class="text-orange text-base leading-relaxed font-medium">{{ exp.description }}</p>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:pl-12 hidden md:block" v-else>
           <!-- Empty space for layout balance -->
        </div>

      </div>
    </div>
  </div>
</template>
