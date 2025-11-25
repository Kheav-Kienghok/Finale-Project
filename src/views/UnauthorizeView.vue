<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// watch(
//   () => route.path,
//   (oldRoute, newRoute) => {
//     if (oldRoute == '/admin/login') {
//       console.log(oldRoute)
//       const token = localStorage.getItem('token')
//       if (token) {
//         router.push({ name: 'AdminDashboard' })
//       }
//     }
//   },
// )
// const token = localStorage.getItem('token')
// if (token) {
//   router.push({ name: 'AdminDashboard' })
// }
</script>
<template>
  <div class="grid place-content-center h-screen overflow-hidden">
    <p class="text-7xl font-extrabold text-center">You don't have permission to visit this page.</p>
    <a href="/" class="link text-blue-900 text-2xl text-center mt-7">Go back home</a>
  </div>
</template>
