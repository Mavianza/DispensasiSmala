<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const stats = ref({})
const filters = ref({
  role: 'all',
  search: ''
})

const user = computed(() => authStore.user)

if (!authStore.isAdmin) {
  router.push('/dashboard')
}

async function fetchStats() {
  try {
    const response = await api.get('/users/statistics')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.role !== 'all') params.role = filters.value.role
    if (filters.value.search) params.search = filters.value.search
    const response = await api.get('/users', { params })
    users.value = response.data.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

async function handleDelete(userId, userName) {
  if (!confirm(`Apakah Anda yakin ingin menghapus user "${userName}"?`)) return
  try {
    await api.delete(`/users/${userId}`)
    alert('User berhasil dihapus')
    fetchUsers()
    fetchStats()
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus user')
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function getAvatarColor(role) {
  const colors = {
    siswa: 'bg-blue-100 text-blue-600',
    guru:  'bg-green-100 text-green-600',
    admin: 'bg-amber-100 text-amber-600'
  }
  return colors[role] || 'bg-gray-100 text-gray-600'
}

const hasActiveFilter = computed(() =>
  filters.value.role !== 'all' || filters.value.search !== ''
)

onMounted(() => {
  fetchStats()
  fetchUsers()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span> Manajemen User
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">Kelola data pengguna sistem</p>
        </div>
        <router-link
          to="/users/create"
          class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md self-start sm:self-auto"
        >
          <span>➕</span> Tambah User
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">👥</div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Total</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.total_users || 0 }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">👨‍🎓</div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Siswa</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.total_siswa || 0 }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">👨‍🏫</div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Guru</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.total_guru || 0 }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">👨‍💼</div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Admin</p>
            <p class="text-2xl font-bold text-amber-600">{{ stats.total_admin || 0 }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">🆕</div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Bulan Ini</p>
            <p class="text-2xl font-bold text-purple-600">{{ stats.users_this_month || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span>🔍</span>
            <h3 class="text-sm font-semibold text-gray-700">Filter & Pencarian</h3>
            <span
              v-if="hasActiveFilter"
              class="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full"
            >Aktif</span>
          </div>
          <button
            v-if="hasActiveFilter"
            @click="filters.role = 'all'; filters.search = ''; fetchUsers()"
            class="text-xs text-primary-600 hover:text-primary-800 font-semibold hover:underline transition"
          >Reset</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Pencarian</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                v-model="filters.search"
                @input="fetchUsers"
                type="text"
                placeholder="Cari nama, email, NISN, NIP..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Filter Role</label>
            <select
              v-model="filters.role"
              @change="fetchUsers"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition bg-white"
            >
              <option value="all">Semua Role</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <!-- Loading -->
        <div v-if="loading" class="py-16 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
          <p class="text-sm text-gray-400">Memuat data...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="users.length === 0" class="py-16 text-center">
          <div class="text-5xl mb-3">👤</div>
          <p class="text-gray-600 font-medium">Tidak ada user ditemukan</p>
          <p class="text-gray-400 text-sm mt-1">
            {{ hasActiveFilter ? 'Coba ubah filter pencarian' : 'Belum ada user yang terdaftar' }}
          </p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">No</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th class="hidden lg:table-cell px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in users"
                :key="item.id"
                class="hover:bg-gray-50/60 transition-colors"
              >
                <!-- No -->
                <td class="px-5 py-4 text-sm text-gray-400 font-medium">{{ index + 1 }}</td>

                <!-- Nama -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      :class="getAvatarColor(item.role)"
                      class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    >
                      {{ getInitials(item.name) }}
                    </div>
                    <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.email }}</td>

                <!-- Role — warna per role + display_name -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <!-- Badge role utama dengan warna -->
                    <span
                      class="px-2.5 py-1 text-xs font-semibold rounded-full border capitalize"
                      :class="{
                        'bg-blue-100 text-blue-800 border-blue-200':   item.role === 'siswa',
                        'bg-green-100 text-green-800 border-green-200': item.role === 'guru',
                        'bg-amber-100 text-amber-800 border-amber-200': item.role === 'admin'
                      }"
                    >
                      {{ item.role }}
                    </span>
                    <!-- Badge display_name roles tambahan -->
                    <span
                      v-for="role in item.roles"
                      :key="role.id"
                      class="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200"
                    >
                      {{ role.display_name }}
                    </span>
                  </div>
                </td>

                <!-- Info — gaya kalimat seperti aslinya -->
                <td class="hidden lg:table-cell px-5 py-4 text-sm text-gray-600">
                  <div v-if="item.role === 'siswa'" class="space-y-0.5">
                    <p class="text-xs">Kelas: {{ item.kelas?.nama_kelas || '-' }}</p>
                    <p class="text-xs">NISN: {{ item.nisn || '-' }}</p>
                  </div>
                  <div v-else class="space-y-0.5">
                    <p class="text-xs">NIP: {{ item.nip || '-' }}</p>
                    <p class="text-xs">Mapel: {{ item.mata_pelajaran || '-' }}</p>
                  </div>
                </td>

                <!-- Aksi -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <router-link
                      :to="`/users/${item.id}/edit`"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
                    >
                      ✏️ Edit
                    </router-link>
                    <button
                      @click="handleDelete(item.id, item.name)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Footer -->
          <div class="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
            <p class="text-xs text-gray-400">
              Menampilkan {{ users.length }} user
              <span v-if="hasActiveFilter"> (difilter)</span>
            </p>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>