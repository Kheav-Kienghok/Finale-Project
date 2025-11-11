<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const remember = ref(false)
const confirmPassword = ref('')
const needVerifyEmail = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const showPassword = ref(null)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const registerObj = {
      fullname: username.value,
      email: email.value,
      password: password.value,
    }
    const resp = await axios.post('https://eduvision.live/api/register', {
      fullname: username.value,
      email: email.value,
      password: password.value,
    })
    if (resp.data.status == 'Created') {
      needVerifyEmail.value = true
    }
  } catch (err) {
    isLoading.value = false
    errorMsg.value = err.response.data.message
    console.log('Erorr registering user: ', err)
  }
}

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
onMounted(async () => {
  const usernameInput = document.getElementById('username')

  usernameInput.addEventListener('input', () => {
    const name = usernameInput.value
    const isAllDigitsRegex = /^\d+$/ // Matches one or more digits from start (^) to end ($).
    const isValidFormat = usernameInput.checkValidity() // Uses the HTML5 `pattern` check.

    if (!isValidFormat) {
      usernameError.value = usernameInput.validationMessage
    } else if (isAllDigitsRegex.test(name)) {
      // If the format is valid but it's only numbers
      usernameError.value = 'Username cannot consist of only numbers.'
    } else {
      // Both checks pass
      usernameError.value = ''
    }
  })

  const emailInput = document.getElementById('email')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  emailInput.addEventListener('input', () => {
    const email = emailInput.value
    const parts = email.split('@')
    const localPart = parts[0]
    const firstChar = localPart[0]

    // A simple heuristic to detect a single, repeated character, e.g., 'aaaaa'
    const isSuspicious = localPart.length > 2 && [...localPart].every((char) => char === firstChar)

    if (!emailRegex.test(email)) {
      emailError.value = 'Please enter a valid email address.'
    } else if (isSuspicious) {
      // This is a technically valid format, so we provide a soft warning
      emailError.value = 'This email looks unusual. Please choose a different one'
    } else {
      emailError.value = ''
    }
  })

  const passwordInput = document.getElementById('password')
  const confirmpasswordInput = document.getElementById('confirmpassword')
  const passwordMeter = document.getElementById('password-meter')

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value
    const score = getPasswordStrength(password)
    updatePasswordMeter(score)

    // Provide instant feedback based on validity
    if (passwordInput.checkValidity()) {
      passwordError.value = ''
    } else {
      passwordError.value = passwordInput.title
    }
  })
  showPassword.value.addEventListener('change', () => {
    passwordInput.type = showPassword.value.checked ? 'text' : 'password'
    confirmpassword.type = showPassword.value.checked ? 'text' : 'password'
  })
  function getPasswordStrength(password) {
    let score = 0
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*]/.test(password)) score += 1 // Add special character check
    return score
  }
  function updatePasswordMeter(score) {
    const meter = passwordMeter
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green']
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

    meter.style.backgroundColor = colors[score] || 'transparent'
    meter.textContent = strengthText[score] || ''
  }
})
</script>
<template>
  <div class="w-full h-200">
    <div v-if="needVerifyEmail" class="h-full w-full flex items-center justify-center flex-col">
      <p class="text-4xl/relaxed text-center max-w-[70%]">
        We've sent a verification email to your inbox. Please check your email and follow the
        instructions to verify your account.
      </p>
      <router-link to="/" class="mx-auto mt-5 button"><span>Back To Home</span></router-link>
    </div>
    <div
      v-else
      class="mx-auto border-1 mt-17 my-auto p-10 w-300 rounded-md bg-base-100 grid grid-cols-2 rgbBlock"
    >
      <!-- add image here -->
      <div class="col-start-1">
        <h1 class="text-center text-4xl font-extrabold">Create Account</h1>
        <p v-if="errorMsg" class="bg-red-400 text-center mt-[16px] p-5 rounded-lg">
          {{ errorMsg }}
        </p>
        <p class="text-center front-normal text-gray-400 text-sm mt-4">Or signup with</p>
        <form @submit.prevent="handleSubmit" class="flex flex-col mt-9 items-center gap-10">
          <label for="username">
            <span
              v-if="usernameError"
              id="username-error"
              class="absolute top-50 z-10 bg-red-400 max-w-50 text-center min-w-100 rounded-lg right-[55%] p-4"
              >{{ usernameError }}</span
            >
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              id="username"
              name="username"
              minlength="3"
              maxlength="20"
              pattern="^[a-zA-Z0-9_.-]+$"
              class="relative input input-primary"
              title="Username can contain only letters, number, dashes, underscore"
              required
              placeholder="John Doe"
            />
          </label>
          <label for="email">
            <span
              v-if="emailError"
              class="absolute top-70 z-10 bg-red-400 text-center min-w-100 rounded-lg right-[55%] p-4"
              >{{ emailError }}</span
            >
            <input
              v-model="email"
              type="email"
              id="email"
              name="email"
              class="relative input input-primary"
              required
              placeholder="example@email.com"
            />
          </label>
          <div>
            <label for="password">
              <span
                v-if="passwordError"
                id="password-error"
                class="absolute top-90 z-10 bg-gray-500/50 text-center min-w-100 rounded-lg right-[50%] transform translate-x-[50%] p-4"
                >{{ passwordError }}</span
              >
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
            <div
              id="password-meter"
              class="text-black font-extrabold text-center p-2 rounded-lg mt-4"
            ></div>
          </div>
          <div>
            <label for="confirmpassword">
              <input
                type="password"
                v-model="confirmPassword"
                id="confirmpassword"
                name="confirmpassword"
                class="input input-primary"
                required
                placeholder="confirm password"
                minlength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number, one uppercase and one lowercase letter, and at least 12 or more characters"
              />
            </label>
            <label for="show-password" class="flex justify-center items-center gap-4 mt-3">
              <input type="checkbox" ref="showPassword" />
              <p class="text-gray-400/50">Show password</p>
            </label>
          </div>
          <div v-if="password != confirmPassword">
            <span class="input input-error text-center"> The password does not match </span>
          </div>
          <div class="flex gap-2 text-sm">
            <p>Already have an account?</p>
            <RouterLink to="/login" class="underline text-blue-400">Login Here</RouterLink>
          </div>
          <div v-if="isLoading" class="flex gap-3 items-center">
            <div class="loading loading-dots"></div>
            <p>Please wait for a moment</p>
          </div>
          <button type="submit" class="button"><span>Sign Up</span></button>
        </form>
      </div>
    </div>
  </div>
</template>
