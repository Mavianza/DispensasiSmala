<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const user = computed(() => authStore.user)
const roleDisplayNames = computed(() => {
  if (user.value?.role === 'siswa') return 'Siswa'
  return authStore.getRoleDisplayNames.join(', ') || 'User'
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo & Brand -->
        <div class="flex items-center space-x-3">
          <router-link to="/dashboard" class="flex items-center space-x-3 group">
            <!-- Logo SMALA -->
            <div class="flex-shrink-0">
              <img
                :src="`/images/logo-smala.png.PNG`"
                alt="Logo SMALA"
                class="h-10 w-10 object-contain"
                @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
              />
              <!-- Fallback jika logo tidak ada -->
              <div
                class="h-10 w-10 bg-primary-500 rounded-lg items-center justify-center group-hover:bg-primary-600 transition hidden"
                style="display:none"
              >
                <span class="text-xl">🎓</span>
              </div>
            </div>

            <!-- Nama Sekolah -->
            <div class="hidden sm:block leading-tight">
              <h1 class="text-xs font-bold text-gray-800 group-hover:text-primary-600 transition leading-none whitespace-nowrap">
                SMA Negeri 5 Mataram
              </h1>
              <p class="text-[11px] text-primary-500 font-medium mt-0.5 whitespace-nowrap">Sistem Dispensasi</p>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            to="/dashboard"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            📊 Dashboard
          </router-link>

          <router-link
            to="/dispensasi"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            📄 Dispensasi
          </router-link>

          <router-link
            v-if="authStore.canApprove"
            to="/analytics"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            📊 Analytics
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/users"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            👥 Users
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/audit-logs"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            📜 Audit Log
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/backups"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
            active-class="bg-primary-50 text-primary-600"
          >
            💾 Backup
          </router-link>
        </div>

        <!-- User Info & Actions (Desktop) -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Avatar + Info -->
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 text-sm font-bold">
                {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800 leading-none">{{ user?.name }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ roleDisplayNames }}</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="bg-danger-500 hover:bg-danger-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-3 mt-1">

        <!-- User info mobile -->
        <div class="px-4 py-3 bg-primary-50 rounded-xl flex items-center space-x-3 mb-3">
          <div class="h-9 w-9 rounded-full bg-primary-200 flex items-center justify-center flex-shrink-0">
            <span class="text-primary-700 text-sm font-bold">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">{{ roleDisplayNames }}</p>
          </div>
        </div>

        <router-link
          to="/dashboard"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          📊 Dashboard
        </router-link>

        <router-link
          to="/dispensasi"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          📄 Dispensasi
        </router-link>

        <router-link
          v-if="authStore.canApprove"
          to="/analytics"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          📊 Analytics
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/users"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          👥 Users
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/audit-logs"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          📜 Audit Log
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/backups"
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
          active-class="bg-primary-50 text-primary-600"
        >
          💾 Backup
        </router-link>

        <button
          @click="handleLogout"
          class="w-full bg-danger-500 hover:bg-danger-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 mt-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  </nav>
</template>