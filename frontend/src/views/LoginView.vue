<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 flex items-center justify-center p-4 relative overflow-hidden">

    <!-- Decorative circles -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    <div class="absolute top-1/2 left-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
    <div class="absolute top-1/4 right-16 w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <!-- Logo SMALA -->
        <div class="flex justify-center mb-4">
          <img
            :src="`/images/logo-smala.png.PNG`"
            alt="Logo SMALA"
            class="h-20 w-20 object-contain"
            @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
          />
          <!-- Fallback -->
          <div
            class="h-20 w-20 bg-primary-500 rounded-2xl items-center justify-center hidden"
            style="display:none"
          >
            <span class="text-4xl">🎓</span>
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h1>
        <p class="text-sm text-gray-500">Sistem Dispensasi</p>
        <p class="text-sm font-semibold text-primary-600">SMA Negeri 5 Mataram</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        <div class="flex items-start gap-2">
          <span>⚠️</span>
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">

        <!-- Email -->
        <div>
          <label for="email" class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Email
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span class="text-gray-400 text-sm">📧</span>
            </div>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
              placeholder="email@sma.com"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span class="text-gray-400 text-sm">🔒</span>
            </div>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg mt-2"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-5 text-center">
        <p class="text-sm text-gray-500">
          Belum punya akun?
          <router-link to="/register" class="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition">
            Daftar di sini
          </router-link>
        </p>
      </div>

      <!-- Divider -->
      <div class="my-5 flex items-center gap-3">
        <div class="flex-1 border-t border-gray-200"></div>
        <span class="text-xs text-gray-400 font-medium">Akun Demo</span>
        <div class="flex-1 border-t border-gray-200"></div>
      </div>

      <!-- Test Accounts -->
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Akun untuk testing</p>
        <div class="space-y-2">
          <div
            class="bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition"
            @click="form.email = 'admin@sma.com'; form.password = 'password'"
          >
            <p class="text-xs font-semibold text-gray-700">👨‍💼 Admin</p>
            <p class="text-xs text-gray-400">admin@sma.com / password</p>
          </div>
          <div
            class="bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition"
            @click="form.email = 'budi@sma.com'; form.password = 'password'"
          >
            <p class="text-xs font-semibold text-gray-700">👨‍🏫 Guru</p>
            <p class="text-xs text-gray-400">budi@sma.com / password</p>
          </div>
          <div
            class="bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition"
            @click="form.email = 'siswa@sma.com'; form.password = 'password'"
          >
            <p class="text-xs font-semibold text-gray-700">👨‍🎓 Siswa</p>
            <p class="text-xs text-gray-400">siswa@sma.com / password</p>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 mt-2 text-center">Klik akun untuk mengisi form otomatis</p>
      </div>

    </div>
  </div>
</template>