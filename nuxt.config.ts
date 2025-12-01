// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@tresjs/nuxt',
    '@nuxt/image',
  ],
  image: {
    domains: ['jogjaqgkavunnohezyxt.supabase.co'],
  },
  supabase: {
    redirect: false,
  },
  tres: {
    devtools: true,
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    }
  },
  app: {
    head: {
      title: 'José Josenildo da Silva - Mestre de Cabotagem',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfolio of Senior Bosun José Josenildo da Silva' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Configuração correta do Vite dentro do Nuxt 
  // comando para liberar hosts no Vite (para usar o ngrok, por exemplo) sem isso o ngrok nao funciona
  vite: {
    server: {
      allowedHosts: true,
    },
  },

})
