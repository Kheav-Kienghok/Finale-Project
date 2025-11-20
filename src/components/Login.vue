<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import { token, setToken } from '@/lib/helper.js'
import { jwtDecode } from 'jwt-decode'
import { isAuthenticate } from '@/lib/helper.js'

const email = ref('')
const errorState = ref('')
const password = ref('')
const passwordInput = ref(null)
const showPassword = ref(null)
const isLoading = ref(false)

const remember = ref(false)
const router = useRouter()

const handleSubmit = async () => {
  const loginObj = {
    email: email.value,
    password: password.value,
  }
  try {
    isLoading.value = true
    const resp = await axios.post('https://eduvision.live/api/login', loginObj)
    if (resp.data.success) {
      const jwtToken = resp.data.data.token
      setToken(jwtToken)
      router.push({ name: 'home' })
    }
  } catch (err) {
    isLoading.value = false
    if (err.status === 401) {
      errorState.value = "Your credentials doesn't match our records."
    }
  }
}
onMounted(() => {
  showPassword.value.addEventListener('change', () => {
    passwordInput.value.type = showPassword.value.checked ? 'text' : 'password'
  })
})
</script>
<template>
  <div class="w-full h-screen">
    <div class="border-1 px-30 py-10 rounded-md rgbBlock bg-base-100 w-fit mx-auto mt-30">
      <div class="">
        <h1 class="text-center text-2xl font-bold">Login</h1>
        <p class="text-center mt-3">Welcome back!!</p>
        <form @submit.prevent="handleSubmit" class="flex flex-col mt-9 items-center gap-10">
          <label for="email">
            <input
              v-model="email"
              type="email"
              id="email"
              name="email"
              class="input input-primary"
              required
              placeholder="example@email.com"
            />
          </label>
          <span v-if="errorState" class="input input-error">
            {{ errorState }}
          </span>
          <label for="password">
            <input
              type="password"
              v-model="password"
              ref="passwordInput"
              id="password"
              name="password"
              class="input input-primary"
              required
              placeholder="........"
            />
          </label>
          <div class="flex gap-3 items-center">
            <input type="checkbox" ref="showPassword" />
            <label for="showPassword">Show Password</label>
          </div>
          <div class="flex gap-2 text-sm">
            <p>Don't have an account?</p>
            <RouterLink to="/register" class="underline text-blue-400">Register Here</RouterLink>
          </div>

          <div v-if="isLoading" class="flex gap-3 items-center">
            <div class="loading loading-dots"></div>
            <p>Please wait for a moment</p>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>
