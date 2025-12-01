<script setup lang="ts">
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Stars, Precipitation } from '@tresjs/cientos'

const gl = {
  clearColor: '#020c1b',
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}
</script>

<template>
  <div class="fixed inset-0 w-full h-full -z-50 pointer-events-none">
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera :position="[0, 5, 15]" :look-at="[0, 0, 0]" />
      
      <!-- Fog for depth and mystery -->
      <TresFog :args="['#020c1b', 5, 30]" attach="fog" />
      
      <!-- Stormy Environment -->
      <Stars :radius="100" :depth="50" :count="3000" :size="0.1" :size-attenuation="true" />
      <Precipitation 
        :speed="1.5" 
        :count="2000" 
        :size="0.05" 
        color="#64ffda" 
        :opacity="0.4"
      />
      
      <!-- Lighting -->
      <TresAmbientLight :intensity="0.2" />
      <TresDirectionalLight :position="[10, 10, 5]" :intensity="0.5" color="#0a192f" />
      <TresPointLight :position="[-5, 2, 5]" :intensity="2" color="#64ffda" :distance="20" />
      <TresPointLight :position="[5, 2, -5]" :intensity="2" color="#ff4d00" :distance="20" />

      <!-- Ocean Surface Placeholder (In a real app, use a shader material) -->
      <TresMesh :position="[0, -2, 0]" :rotation="[-Math.PI / 2, 0, 0]">
        <TresPlaneGeometry :args="[100, 100, 32, 32]" />
        <TresMeshStandardMaterial 
          color="#0a192f" 
          :roughness="0.1" 
          :metalness="0.8"
          wireframe
        />
      </TresMesh>

    </TresCanvas>
    
    <!-- Vignette & Noise Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-navy-950 via-transparent to-navy-950 opacity-80 pointer-events-none"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
  </div>
</template>
