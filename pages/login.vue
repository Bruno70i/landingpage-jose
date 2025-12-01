<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/admin')
  }
})

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
  } catch (error: any) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-navy-900 px-4">
    <div class="w-full max-w-md bg-navy-800 p-8 rounded-xl border border-navy-700 shadow-2xl">
      <h1 class="text-3xl font-serif text-white mb-8 text-center">Admin Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input 
            v-model="email"
            type="email" 
            required
            class="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-600 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
          <input 
            v-model="password"
            type="password" 
            required
            class="w-full px-4 py-3 rounded-lg bg-navy-900 border border-navy-600 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          />
        </div>
        
        <div v-if="errorMsg" class="text-red-500 text-sm text-center">
          {{ errorMsg }}
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3 bg-gold text-navy-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>
