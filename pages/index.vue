<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { fetchProfile, fetchAlbums, fetchExperience } = usePortfolio()

const { data: portfolioData } = await useAsyncData('portfolio', async () => {
  const [profile, albums, experiences] = await Promise.all([
    fetchProfile(),
    fetchAlbums(),
    fetchExperience()
  ])
  return { profile, albums, experiences }
})

// Fallback data
const fallbackProfile = {
  full_name: 'José Josenildo da Silva',
  role: 'Mestre de Cabotagem | Bosun',
  bio: 'Profissional experiente com mais de 30 anos de atuação no setor marítimo. Especialista em navegação de cabotagem, operações offshore e liderança de equipe.',
  contact_info: {
    phone: '+55 13 99727 4148',
    email: 'josenildopereque1971@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mestredecabotagemjosejosenildodasilva/',
    address: 'Rua Travessa Emilia, 123 lote 3, São João de Meriti, RJ'
  },
  avatar_url: null,
  avatar_rotation: 0
}

const displayProfile = computed(() => portfolioData.value?.profile || fallbackProfile)
const albums = computed(() => portfolioData.value?.albums || [])
const experiences = computed(() => portfolioData.value?.experiences || [])

onMounted(() => {
  // ... (animations remain same)
  gsap.from('.hero-text', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out'
  })

  gsap.from('.radar-scope', {
    scale: 0,
    rotation: -180,
    duration: 2,
    ease: 'elastic.out(1, 0.5)'
  })

  // Scroll Animations
  gsap.utils.toArray('.section-title').forEach((title: any) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      x: -50,
      opacity: 0,
      duration: 1
    })
  })
})
</script>

<template>
  <div class="relative">
    <!-- ... (Hero, Certifications, Experience, Gallery remain same) ... -->
    <!-- Hero Section -->
    <header class="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      
      <!-- Background Texture (Blueprint/Grid) -->
      <div class="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style="background-image: radial-gradient(circle, #64ffda 1px, transparent 1px); background-size: 50px 50px;">
      </div>
      <div class="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <!-- Radar Scope Profile (Bridge Instrumentation Style) -->
      <div class="radar-scope relative w-72 h-72 mb-12 rounded-full border-4 border-navy-800 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center group shadow-2xl">
        <!-- Compass Rose / Degree Markings -->
        <div class="absolute inset-0 rounded-full border border-white/10"></div>
        <div class="absolute inset-2 rounded-full border-2 border-dashed border-orange/30 animate-spin-slow"></div>
        <div class="absolute -inset-4 border border-cyan/20 rounded-full opacity-50"></div>
        
        <!-- Cardinal Points -->
        <div class="absolute top-2 text-xs font-mono text-orange font-bold">N</div>
        <div class="absolute bottom-2 text-xs font-mono text-orange font-bold">S</div>
        <div class="absolute left-2 text-xs font-mono text-orange font-bold">W</div>
        <div class="absolute right-2 text-xs font-mono text-orange font-bold">E</div>

        <!-- Scanner Line -->
        <div class="absolute inset-0 rounded-full border-t-2 border-cyan/50 shadow-[0_0_15px_#64ffda] animate-spin-slow opacity-30"></div>
        
        <NuxtImg 
          :src="displayProfile.avatar_url || '/images/profile-placeholder.png'" 
          alt="José Josenildo"
          class="relative w-64 h-64 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 z-10 border-2 border-white/5"
          :style="{ transform: `rotate(${displayProfile.avatar_rotation || 0}deg)` }"
          placeholder
        />
      </div>
      
      <div class="text-center z-10 max-w-5xl">
        <h1 class="hero-text text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-8 tracking-tighter uppercase leading-none drop-shadow-2xl">
          {{ displayProfile.full_name }}
        </h1>
        
        <div class="hero-text relative inline-block mb-12">
          <h2 class="text-2xl md:text-4xl text-orange font-sans font-bold uppercase tracking-widest px-6 py-3 border-y-2 border-orange/50 bg-navy-900/50 backdrop-blur-sm">
            {{ displayProfile.role }}
          </h2>
        </div>
        
        <p class="hero-text text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light text-center drop-shadow-md">
          {{ displayProfile.bio }}
        </p>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-pulse">
        <span class="text-xs font-mono text-orange tracking-widest">NAVEGAR</span>
        <div class="w-[1px] h-16 bg-gradient-to-b from-orange to-transparent"></div>
      </div>
    </header>

    <!-- Certifications Section -->
    <CertificationsSection />

    <!-- Experience Section -->
    <section id="experience" class="relative z-10 py-24">
      <div class="container mx-auto px-4">
        <h2 class="section-title text-4xl md:text-6xl font-display font-bold text-white mb-20 flex items-center gap-4">
          <span class="text-orange">01.</span> TRAJETÓRIA PROFISSIONAL
          <div class="h-[1px] flex-grow bg-white/10"></div>
        </h2>
        <ExperienceTimeline :experiences="experiences || []" />
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="relative z-10 py-24 bg-navy-900/30">
      <div class="container mx-auto px-4">
        <h2 class="section-title text-4xl md:text-6xl font-display font-bold text-white mb-20 flex items-center gap-4 flex-row-reverse">
          <span class="text-cyan">02.</span> VIAGENS & OPERAÇÕES
          <div class="h-[1px] flex-grow bg-white/10"></div>
        </h2>
        <VesselGallery :albums="albums || []" />
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-navy-950 py-16 border-t border-white/5 relative z-10">
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-center md:text-left">
          <h3 class="text-3xl font-display text-white mb-2">JOSÉ JOSENILDO</h3>
          <p class="text-slate-500 text-sm font-mono tracking-widest">SENIOR BOSUN // MESTRE DE CABOTAGEM</p>
        </div>
        
        <div class="flex flex-col md:flex-row gap-8 font-mono text-base">
          <a :href="`tel:${displayProfile.contact_info.phone}`" class="text-slate-300 hover:text-cyan transition-colors flex items-center gap-3 justify-center md:justify-start">
            <span class="w-2 h-2 bg-cyan rounded-full shadow-[0_0_10px_#64ffda]"></span>
            {{ displayProfile.contact_info.phone }}
          </a>
          <a :href="`mailto:${displayProfile.contact_info.email}`" class="text-slate-300 hover:text-orange transition-colors flex items-center gap-3 justify-center md:justify-start">
            <span class="w-2 h-2 bg-orange rounded-full shadow-[0_0_10px_#ff4d00]"></span>
            {{ displayProfile.contact_info.email }}
          </a>
          <a :href="displayProfile.contact_info.linkedin" target="_blank" class="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-3 justify-center md:justify-start">
            <span class="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>

    <WhatsAppButton />
  </div>
</template>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
.animate-spin-slow {
  animation: spin 4s linear infinite;
}
.animate-spin-reverse-slow {
  animation: spin 8s linear infinite reverse;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
