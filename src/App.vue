<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import { useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
<template>
  <div>
    <p>{{ isDark ? 'ON' : 'OFF' }}</p>
    <button @click="toggleDark()">Toggle</button>
    <div class="p-4 bg-white text-black dark:bg-gray-900 dark:text-white">Probe block</div>
    <AdminNavbar
      v-if="
        route.name == 'AdminDashboard' ||
        route.name == 'CreateOpportunity' ||
        route.name == 'AdminLogin' ||
        route.name == 'EditOpportunity'
      "
    />
    <HomeNavbar v-else />
    <router-view v-slot="{ Component }">
      <keep-alive include="OpportunitiesView">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
