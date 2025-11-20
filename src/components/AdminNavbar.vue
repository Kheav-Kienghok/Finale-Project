<script setup>
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
const token = localStorage.getItem('token') || ''
let name = ref('')
if (token !== '') {
  name.value = jwtDecode(token).username
}
const handleLogout = () => {
  localStorage.removeItem('token')
  name.value = ''
}
</script>
<template>
  <nav
    class="flex justify-between lg:justify-center lg:gap-30 items-center p-7 text-3xl flex-nowrap"
  >
    <!-- Big Display -->
    <div class="hidden lg:flex items-center justify-evenly w-full">
      <router-link class="flex items-center" to="/">
        <img class="w-[120px] h-[90px]" src="/logo-nobg.png" alt="logo" />
        <p class="text-lg font-corben ml-1">EduVision</p>
      </router-link>

      <ul class="flex items-center gap-5">
        <router-link class="button" to="/admin/dashboard"><span>Dashboard</span></router-link>
        <router-link class="button" to="/admin/create-opportunity"
          ><span>Add New</span></router-link
        >
      </ul>
      <div v-if="name" class="flex gap-4 items-center">
        <p class="text-xl font-ultra">{{ name }}</p>
        <button @click="handleLogout" class="button"><span>Logout</span></button>
      </div>
      <router-link to="/admin/login" v-else>
        <button class="button"><span>Login</span></button>
      </router-link>
    </div>
  </nav>
</template>
