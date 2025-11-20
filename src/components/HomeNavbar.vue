<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { isAuthenticate, getUserName, checkExpired, logout, token } from '@/lib/helper.js'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const authenticated = ref()
const name = ref('')
watch(
  () => router.currentRoute.value,
  (newRoute) => {
    const username = getUserName()
    name.value = username
    authenticated.value = isAuthenticate()
  },
)

const handleLogout = () => {
  authenticated.value = false
  localStorage.removeItem('jwt')
  logout()
  window.location.reload()
}
</script>
<template>
  <nav
    class="flex justify-between lg:justify-center lg:gap-30 items-center p-7 text-3xl flex-nowrap"
  >
    <div class="lg:hidden dropdown flex items-center justify-evenly w-full">
      <div class="btn btn-primary flex flex-col relative">
        <input type="checkbox" id="menu-toggle" class="peer hidden" />
        <label for="menu-toggle" class="cursor-pointer">
          <i class="pi pi-bars"></i>
        </label>
        <ul
          class="rounded-box invisible absolute top-10 peer-checked:visible bg-[#793ef9] w-52 p-2 shadow flex flex-col gap-3 py-3 mt-3 items-center ml-4 justify-evenly min-h-[200px]"
        >
          <router-link to="/" class="border-1 w-[90%] py-1.5 rounded-lg"> Home </router-link>
          <router-link to="/about" class="border-1 w-[90%] py-1.5 rounded-lg"> About </router-link>
          <router-link to="/opportunities" class="border-1 w-[90%] py-1.5 rounded-lg">
            Opportunities
          </router-link>
          <router-link to="/contact" class="border-1 w-[90%] py-1.5 rounded-lg">
            Contact
          </router-link>
          <div
            class="border-1 w-[90%] py-1.5 rounded-lg"
            @click.prevent="handleLogout"
            v-if="authenticated"
          >
            <div>
              <p>Sign Out</p>
              <i class="pi pi-sign-out"></i>
            </div>
          </div>
          <router-link
            to="/login"
            v-else
            class="border-1 w-[90%] py-1.5 rounded-lg flex gap-3 justify-center"
          >
            Sign In
            <i class="pi pi-sign-in"></i>
          </router-link>
        </ul>
      </div>
      <img class="w-20" src="/logo-nobg.png" alt="logo" />
      <p v-if="authenticated" class="text-xs font-ultra">{{ name }}</p>
    </div>

    <!-- Big Display -->
    <div class="hidden lg:flex items-center justify-evenly w-full">
      <router-link class="flex items-center" to="/">
        <img class="w-[120px] h-[90px]" src="/logo-nobg.png" alt="logo" />
        <p class="text-lg font-corben ml-1">EduVision</p>
      </router-link>

      <ul class="flex gap-5">
        <router-link class="button" to="/"><span>Home</span></router-link>
        <router-link class="button" to="/about"><span>About</span></router-link>
        <div class="button group relative z-40">
          <span class="">
            <router-link to="/opportunities">Opportunities</router-link>
          </span>
          <div
            class="bg-base-400 py-7 rounded-lg absolute left-1/2 transform -translate-x-1/2 w-70 h-fit p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300"
          >
            <ul class="flex flex-col items-center gap-5 text-sm">
              <router-link
                class="border-1 w-[90%] p-3 rounded-lg hover:bg-gray-400/50 border-gray-400/50 text-center"
                to="/valid-opportunities"
              >
                Valid Opportunities
              </router-link>
              <router-link
                class="border-1 w-[90%] p-3 rounded-lg hover:bg-gray-400/50 border-gray-400/50 text-center"
                to="/opportunities"
              >
                All Opportunities
              </router-link>
            </ul>
          </div>
        </div>
        <RouterLink class="button" to="/contact"><span>Contact</span></RouterLink>
      </ul>
      <div v-if="authenticated" class="flex gap-4 items-center">
        <p class="text-xl font-ultra">{{ name }}</p>
        <button @click="handleLogout" class="button"><span>Logout</span></button>
      </div>
      <div class="flex gap-3 items-center" v-else>
        <router-link class="button" to="/login" @click="console.log('click')"
          ><span>Login</span></router-link
        >
        <router-link class="button" to="/register"><span>Sign Up</span></router-link>
      </div>
    </div>
  </nav>
</template>
