<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// State
const activeTab = ref('profile') // 'profile', 'gallery', 'experience'
const loading = ref(false)
const message = ref('')

// Data
const profile = ref<any>({
  contact_info: { phone: '', email: '', linkedin: '', address: '' }
})
const albums = ref<any[]>([])
const vessels = ref<any[]>([])
const experiences = ref<any[]>([])

// Fetch Data
const fetchData = async () => {
  loading.value = true
  
  // Profile
  if (user.value?.id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    
    if (profileData) {
      profile.value = profileData
      if (!profile.value.contact_info) {
        profile.value.contact_info = { phone: '', email: '', linkedin: '', address: '' }
      }
    }
  } else {
    // Initialize empty if no user (though auth middleware should catch this)
    profile.value = { contact_info: { phone: '', email: '', linkedin: '', address: '' } }
  }
  
  // Albums
  const { data: albumData } = await supabase.from('albums').select('*').order('created_at', { ascending: false })
  if (albumData) albums.value = albumData

  // Vessels (Photos) - Fetch with album info
  const { data: vesselData } = await supabase.from('vessels_gallery').select('*, albums(title)').order('created_at', { ascending: false })
  if (vesselData) vessels.value = vesselData
  
  // Experience
  const { data: expData } = await supabase.from('experience_logs').select('*').order('start_date', { ascending: false })
  if (expData) experiences.value = expData
  
  loading.value = false
}

onMounted(() => {
  if (!user.value) {
    router.push('/login')
  } else {
    fetchData()
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

// Profile Actions
const uploadProfileImage = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  loading.value = true
  const fileExt = file.name.split('.').pop()
  const fileName = `avatar/${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    message.value = `Erro ao fazer upload: ${uploadError.message}`
    loading.value = false
    return
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  profile.value.avatar_url = publicUrl
  message.value = 'Foto de perfil carregada! Clique em Salvar Alterações.'
  loading.value = false
}

const updateProfile = async () => {
  loading.value = true
  const updates = {
    id: user.value?.id,
    ...profile.value,
    updated_at: new Date()
  }
  const { error } = await supabase.from('profiles').upsert(updates as any)
  
  if (error) {
    console.error('Error updating profile:', error)
    message.value = `Erro ao atualizar perfil: ${error.message} - ${error.details || ''}`
  }
  else message.value = 'Perfil atualizado com sucesso!'
  
  setTimeout(() => message.value = '', 3000)
  loading.value = false
}

// Album Actions
const newAlbum = ref({ title: '', description: '' })

const addAlbum = async () => {
  loading.value = true
  const { error } = await supabase.from('albums').insert(newAlbum.value as any)
  
  if (error) message.value = 'Erro ao adicionar álbum'
  else {
    message.value = 'Álbum adicionado!'
    newAlbum.value = { title: '', description: '' }
    fetchData()
  }
  
  setTimeout(() => message.value = '', 3000)
  loading.value = false
}

const deleteAlbum = async (id: number) => {
  if (!confirm('Tem certeza? Isso apagará todas as fotos deste álbum!')) return
  
  const { error } = await supabase.from('albums').delete().eq('id', id)
  if (!error) fetchData()
}

// Vessel (Photo) Actions
const newVessel = ref({ vessel_name: '', description: '', album_id: '', image_url: '' })

const uploadVesselImage = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  loading.value = true
  const fileExt = file.name.split('.').pop()
  const fileName = `gallery/${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    message.value = `Erro ao fazer upload: ${uploadError.message}`
    loading.value = false
    return
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  newVessel.value.image_url = publicUrl
  message.value = 'Foto carregada com sucesso!'
  loading.value = false
}

const addVessel = async () => {
  loading.value = true
  const { error } = await supabase.from('vessels_gallery').insert(newVessel.value as any)
  
  if (error) message.value = 'Erro ao adicionar foto'
  else {
    message.value = 'Foto adicionada!'
    // Keep album_id filled
    newVessel.value = { ...newVessel.value, vessel_name: '', description: '', image_url: '' }
    fetchData()
  }
  
  setTimeout(() => message.value = '', 3000)
  loading.value = false
}

const deleteVessel = async (id: number) => {
  if (!confirm('Tem certeza?')) return
  
  const { error } = await supabase.from('vessels_gallery').delete().eq('id', id)
  if (!error) fetchData()
}

// Experience Actions
const newExp = ref({ id: null, company: '', role: '', start_date: '', end_date: '', description: '', vessel_type: '', image_url: '' })
const isEditing = ref(false)

const uploadExperienceImage = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  loading.value = true
  const fileExt = file.name.split('.').pop()
  const fileName = `experience/${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    message.value = `Erro ao fazer upload: ${uploadError.message}`
    loading.value = false
    return
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  newExp.value.image_url = publicUrl
  message.value = 'Imagem carregada com sucesso!'
  setTimeout(() => message.value = '', 3000)
  loading.value = false
}

const addExperience = async () => {
  loading.value = true
  
  // Sanitize payload: convert empty strings to null for dates
  const payload = {
    ...newExp.value,
    start_date: newExp.value.start_date || null,
    end_date: newExp.value.end_date || null,
    // Ensure image_url is null if empty string
    image_url: newExp.value.image_url || null
  }

  // Remove id if null to allow auto-increment on insert, but keep it for update
  if (!payload.id) delete (payload as any).id

  const { error } = await supabase.from('experience_logs').upsert(payload as any)
  
  if (error) {
    console.error('Error saving experience:', error)
    message.value = `Erro ao salvar experiência: ${error.message}`
  } else {
    message.value = isEditing.value ? 'Experiência atualizada!' : 'Experiência adicionada!'
    cancelEdit()
    fetchData()
  }
  
  setTimeout(() => message.value = '', 3000)
  loading.value = false
}

const editExperience = (item: any) => {
  newExp.value = { ...item }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  newExp.value = { id: null, company: '', role: '', start_date: '', end_date: '', description: '', vessel_type: '', image_url: '' }
  isEditing.value = false
}

const deleteExperience = async (id: number) => {
  if (!confirm('Tem certeza?')) return
  
  const { error } = await supabase.from('experience_logs').delete().eq('id', id)
  if (!error) fetchData()
}
</script>

<template>
  <div class="min-h-screen bg-navy-900 text-white relative z-10">
    <!-- Header -->
    <header class="bg-navy-800 border-b border-navy-700 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-orange">Admin Dashboard</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-400">{{ user?.email }}</span>
          <button @click="handleLogout" class="text-sm text-red-400 hover:text-red-300">Sair</button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4 md:p-8">
      <!-- Tabs -->
      <div class="flex gap-4 mb-8 border-b border-navy-700 pb-4 overflow-x-auto">
        <button 
          v-for="tab in ['profile', 'gallery', 'experience']" 
          :key="tab"
          @click="activeTab = tab"
          :class="['px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors', activeTab === tab ? 'bg-orange text-white font-bold' : 'text-gray-400 hover:text-white bg-navy-800']"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Feedback Message -->
      <div v-if="message" class="mb-6 p-4 bg-green-500/20 text-green-400 rounded-lg border border-green-500/50">
        {{ message }}
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="max-w-2xl">
        <h2 class="text-2xl font-serif mb-6">Editar Perfil</h2>
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Foto de Perfil</label>
            <div class="flex flex-col gap-4 mb-2">
              <div class="flex items-center gap-4">
                <img 
                  v-if="profile.avatar_url" 
                  :src="profile.avatar_url" 
                  class="w-32 h-32 rounded-full object-cover border-2 border-orange transition-transform duration-300"
                  :style="{ transform: `rotate(${profile.avatar_rotation || 0}deg)` }"
                />
                <div class="flex flex-col gap-2">
                  <input type="file" @change="uploadProfileImage" accept="image/*" class="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:bg-orange/80 cursor-pointer" />
                  <div class="flex gap-2">
                    <button type="button" @click="profile.avatar_rotation = (profile.avatar_rotation || 0) - 90" class="px-3 py-1 bg-navy-700 text-white rounded hover:bg-navy-600">↺ Girar Esq</button>
                    <button type="button" @click="profile.avatar_rotation = (profile.avatar_rotation || 0) + 90" class="px-3 py-1 bg-navy-700 text-white rounded hover:bg-navy-600">↻ Girar Dir</button>
                  </div>
                  <p class="text-xs text-gray-500">Rotação atual: {{ profile.avatar_rotation || 0 }}°</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Nome Completo</label>
            <input v-model="profile.full_name" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Cargo / Título</label>
            <input v-model="profile.role" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea v-model="profile.bio" rows="4" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg"></textarea>
          </div>
          
          <!-- Contact Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Telefone</label>
              <input v-model="profile.contact_info.phone" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <input v-model="profile.contact_info.email" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-400 mb-1">LinkedIn (URL)</label>
              <input v-model="profile.contact_info.linkedin" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Endereço</label>
              <input v-model="profile.contact_info.address" class="w-full p-3 bg-navy-800 border border-navy-600 rounded-lg" />
            </div>
          </div>
          <button type="submit" class="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange/80 transition-colors">
            Salvar Alterações
          </button>
        </form>
      </div>

      <!-- Gallery Tab -->
      <div v-if="activeTab === 'gallery'">
        <h2 class="text-2xl font-serif mb-6">Gerenciar Galeria</h2>
        
        <!-- Albums Section -->
        <div class="mb-12 border-b border-navy-700 pb-12">
          <h3 class="text-xl font-bold text-orange mb-4">1. Álbuns / Viagens</h3>
          
          <!-- Add Album -->
          <div class="bg-navy-800 p-6 rounded-xl mb-6 border border-navy-700">
            <div class="grid grid-cols-1 gap-4 mb-4">
              <input v-model="newAlbum.title" placeholder="Título do Álbum (ex: Viagem Salvador 2023)" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
              <textarea v-model="newAlbum.description" placeholder="Descrição Geral da Viagem" class="p-3 bg-navy-900 border border-navy-600 rounded-lg"></textarea>
            </div>
            <button @click="addAlbum" class="px-6 py-2 bg-orange text-white font-bold rounded-lg hover:bg-orange/80">Criar Álbum</button>
          </div>

          <!-- List Albums -->
          <div class="space-y-4">
            <div v-for="album in albums" :key="album.id" class="bg-navy-800 p-4 rounded-xl border border-navy-700 flex justify-between items-center">
              <div>
                <h4 class="font-bold text-white">{{ album.title }}</h4>
                <p class="text-sm text-gray-400">{{ album.description }}</p>
              </div>
              <button @click="deleteAlbum(album.id)" class="text-red-400 hover:text-red-300">Excluir</button>
            </div>
          </div>
        </div>

        <!-- Photos Section -->
        <div>
          <h3 class="text-xl font-bold text-cyan mb-4">2. Fotos da Galeria</h3>
          
          <!-- Add Photo -->
          <div class="bg-navy-800 p-6 rounded-xl mb-8 border border-navy-700">
            <h4 class="text-lg font-bold mb-4">Adicionar Foto</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-400 mb-1">Selecione o Álbum</label>
                <select v-model="newVessel.album_id" class="w-full p-3 bg-navy-900 border border-navy-600 rounded-lg text-white">
                  <option value="" disabled>Escolha um álbum...</option>
                  <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.title }}</option>
                </select>
              </div>
              <input v-model="newVessel.vessel_name" placeholder="Título da Foto" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
              <input v-model="newVessel.image_url" placeholder="URL da Imagem" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" readonly />
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-400 mb-1">Upload da Imagem</label>
                <input type="file" @change="uploadVesselImage" accept="image/*" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:bg-orange/80 cursor-pointer" />
              </div>
              <textarea v-model="newVessel.description" placeholder="Descrição da Foto" class="p-3 bg-navy-900 border border-navy-600 rounded-lg md:col-span-2"></textarea>
            </div>
            <button @click="addVessel" class="px-6 py-2 bg-cyan text-navy-900 font-bold rounded-lg hover:bg-cyan/80">Adicionar Foto</button>
          </div>

          <!-- List Photos -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in vessels" :key="item.id" class="bg-navy-800 rounded-xl overflow-hidden border border-navy-700 group">
              <div class="aspect-video bg-navy-900 relative">
                <img :src="item.image_url" class="w-full h-full object-cover" />
                <button @click="deleteVessel(item.id)" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-white">{{ item.vessel_name }}</h4>
                <p class="text-xs text-orange uppercase tracking-wider mb-1">{{ item.albums?.title }}</p>
                <p class="text-sm text-gray-400 line-clamp-2">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Tab -->
      <div v-if="activeTab === 'experience'">
        <h2 class="text-2xl font-serif mb-6">Gerenciar Experiência</h2>
        
        <!-- Add/Edit Form -->
        <div class="bg-navy-800 p-6 rounded-xl mb-8 border border-navy-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">{{ isEditing ? 'Editar Experiência' : 'Adicionar Experiência' }}</h3>
            <button v-if="isEditing" @click="cancelEdit" class="text-sm text-gray-400 hover:text-white">Cancelar Edição</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input v-model="newExp.company" placeholder="Empresa" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
            <input v-model="newExp.role" placeholder="Cargo" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
            <input v-model="newExp.vessel_type" placeholder="Tipo de Embarcação" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newExp.start_date" type="date" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
              <input v-model="newExp.end_date" type="date" class="p-3 bg-navy-900 border border-navy-600 rounded-lg" />
            </div>
            <textarea v-model="newExp.description" placeholder="Descrição" class="p-3 bg-navy-900 border border-navy-600 rounded-lg md:col-span-2"></textarea>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Imagem / Logo (Opcional)</label>
              <input type="file" @change="uploadExperienceImage" accept="image/*" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:bg-orange/80 cursor-pointer" />
              <p v-if="newExp.image_url" class="text-xs text-green-400 mt-1">Imagem carregada: {{ newExp.image_url }}</p>
            </div>
          </div>
          <button @click="addExperience" class="px-6 py-2 bg-orange text-white font-bold rounded-lg hover:bg-orange/80 transition-colors">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
        </div>

        <!-- List -->
        <div class="space-y-4">
          <div v-for="item in experiences" :key="item.id" class="bg-navy-800 p-4 rounded-xl border border-navy-700 flex justify-between items-start">
            <div>
              <h4 class="font-bold text-white text-lg">{{ item.role }}</h4>
              <p class="text-orange">{{ item.company }}</p>
              <p class="text-sm text-gray-400">{{ item.start_date }} - {{ item.end_date || 'Presente' }}</p>
            </div>
            <div class="flex gap-4">
              <button @click="editExperience(item)" class="text-cyan hover:text-cyan-glow">
                Editar
              </button>
              <button @click="deleteExperience(item.id)" class="text-red-400 hover:text-red-300">
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
