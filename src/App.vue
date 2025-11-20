<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <div>
    <AdminNavbar
      v-if="
        route.name == 'AdminDashboard' ||
        route.name == 'CreateOpportunity' ||
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
