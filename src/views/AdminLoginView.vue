<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const email = ref('')
const password = ref('')
const errorState = ref('')
const totp = ref('')
const qrcode = ref('')
const loading = ref(false)
const errorMsg = ref('')
const isVerifyTOTP = ref(false)
const isAdminLogin = ref(true)
const setup_token = ref('')
const temp_token = ref('')
const router = useRouter()

const handleSubmit = async () => {
  loading.value = true
  const loginObj = {
    email: email.value,
    password: password.value,
  }
  try {
    const resp = await axios.post(
      'https://eduvision.live/api/admin/login',
      JSON.stringify(loginObj),
    )
    if (resp.data.success) {
      if (!resp.data.data.is_multi_factor) {
        setup_token.value = resp.data.data.setup_token
        const verification = await axios.post(
          'https://eduvision.live/api/admin/enable-2fa',
          {},
          {
            headers: {
              Authorization: `Bearer ${setup_token.value}`,
            },
          },
        )
        errorMsg.value = ''
        qrcode.value = verification.data.data.qr_code_url
        loading.value = false
        isAdminLogin.value = false
      }
      if (resp.data.data.is_multi_factor) {
        temp_token.value = resp.data.data.temp_token
        isVerifyTOTP.value = true
        isAdminLogin.value = false
        loading.value = false
        errorMsg.value = ''
      }
      // if (resp.data.data.next == '/admin/verify-otp') {
      //   isVerifyTOTP.value = true
      //   isAdminLogin.value = false
      // } else if (resp.data.data.next == '/admin/enable-2fa') {
      //   isAdminLogin.value = false
      //   authToken = resp.data.data.setup_token
      //   const verification = await axios.post(
      //     'https://eduvision.live/api/admin/enable-2fa',
      //     {},
      //     {
      //       headers: {
      //         Authorization: `Bearer ${authToken}`,
      //       },
      //     },
      //   )
      //   qrcode.value = verification.data.data.qr_code_url
      //   console.log(qrcode.value)
      //   loading.value = false
      // }
    }
  } catch (err) {
    console.log('Error registering admin', err)
    errorMsg.value = 'Something Went Wrong. Plase try again.'
    loading.value = false
  }
}
const handleBeforeUnload = (e) => {
  e.preventDefault()
  e.returnValue = ''
}
const handleVerify2FA = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const resp = await axios.post(
      'https://eduvision.live/api/admin/verify-otp',
      { otp: totp.value },
      {
        headers: {
          Authorization: `Bearer ${temp_token.value}`,
        },
      },
    )
    if (resp.data.success) {
      localStorage.setItem('token', resp.data.data.token)
      router.push({ name: 'AdminDashboard' })
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Something Went Wrong. Please Try Again.'
    console.log('Error verification', err)
  }
}
const handleVerification = async () => {
  try {
    loading.value = true
    console.log(totp.value)
    const resp = await axios.post(
      'https://eduvision.live/api/admin/verify-2fa',
      { otp: totp.value },
      {
        headers: {
          Authorization: `Bearer ${setup_token.value}`,
        },
      },
    )
    console.log(resp.data)
    if (resp.data.success) {
      router.push({ name: 'AdminLogin' })
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Something Went Wrong. Please Try Again.'
    console.log('Error verification', err)
  }
}
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>
<template>
  <div class="w-full h-screen">
    <div class="border-1 p-10 w-fit rounded-md rgbBlock bg-base-100 mx-auto mt-30">
      <div v-if="errorMsg" role="alert" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ errorMsg }}</span>
      </div>
      <div v-if="isVerifyTOTP">
        <form @submit.prevent="handleVerify2FA">
          <input type="text" v-model="totp" placeholder="XXX-XXX" />
          <button class="button" type="submit"><span>Verify</span></button>
        </form>
      </div>
      <div class="flex flex-col items-center justify-center gap-5" v-if="qrcode">
        <p class="text-center text-xl/relaxed mb-3">
          Please open your authenticator app and scan this QR code to enable 2 Factor Authentication
        </p>
        <img :src="qrcode" alt="" class="col-start-2" v-if="qrcode" />
        <form @submit.prevent="handleVerification" class="flex flex-col mt-4 items-center gap-4">
          <input
            type="text"
            placeholder="Please enter 6 digits from your authenticator app."
            class="input input-primary"
            v-model="totp"
          />
          <div v-if="loading" class="flex items-center gap-4">
            <p>Please wait for a moment</p>
            <span class="loading loading-dots loading-lg"></span>
          </div>
          <button class="button"><span>Verify</span></button>
        </form>
      </div>
      <div class="" v-if="isAdminLogin">
        <h1 class="text-center text-2xl font-bold">Admin Login</h1>
        <p class="text-center mt-3">Welcome back Admin!!</p>
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
              id="password"
              name="password"
              class="input input-primary"
              required
              placeholder="password"
            />
          </label>
          <div v-if="loading" class="flex items-center gap-4">
            <p>Please wait for a moment</p>
            <span class="loading loading-dots loading-lg"></span>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>
