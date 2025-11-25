<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
import axios from 'axios'
const allScholarships = ref([])
const fetchData = async () => {
  const resp = await axios.get('https://eduvision.live/api/scholarships')
  if (resp.data.success) {
    allScholarships.value = resp.data.data
  }
}
const token = localStorage.getItem('token') || ''
const handleDelete = async (id) => {
  const confirmed = confirm('Are you sure you want to delete this? This action cannot be undone.')
  if (confirmed) {
    try {
      const resp = await axios.delete(`https://eduvision.live/api/scholarships/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (resp.data.success) {
        window.location.reload()
      }
    } catch (err) {
      console.log('Error deleting opportunity', err)
    }
  } else {
    return
  }
}
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath === '/admin/login') {
      console.log(newPath)
      console.log(oldPath)
      window.location.reload()
    }
  },
)

onMounted(async () => {
  await fetchData()
})
</script>
<template>
  <div class="w-full flex flex-col items-center gap-20 text-lg/relaxed mb-15">
    <div class="border-1 w-[50%] relative p-12 rounded-lg" v-for="scholarship in allScholarships">
      <img :src="scholarship.photo_url" alt="" class="w-60 rounded-lg mx-auto" />
      <div class="absolute right-5 top-4">
        <button
          @click="router.push({ name: 'EditOpportunity', query: { id: scholarship.id } })"
          class="btn btn-primary mr-2"
        >
          Edit
        </button>
        <button class="btn btn-primary" @click="handleDelete(scholarship.id)">Delete</button>
      </div>
      <div class="mt-6 flex flex-col items-start gap-4">
        <p class="">
          <span class="italic text-red-400 font-bold">TITLE: </span>{{ scholarship.title }}
        </p>
        <p>
          <span class="italic text-red-400 font-bold">DESCRIPTION: </span
          >{{ scholarship.description }}
        </p>
        <p>
          <span class="italic text-red-400 font-bold">PROVIDER: </span>{{ scholarship.provider }}
        </p>
        <p>
          <span class="italic text-red-400 font-bold">DEADLINE: </span
          >{{ scholarship.deadline_end }}
        </p>
      </div>
      <div class="w-full mt-6">
        <p class="border-t-1 border-t-gray-400 mx-auto w-fit pt-4 font-extrabold text-red-400">
          REQUIREMENTS
        </p>
        <div v-for="(val, key, idx) in scholarship.requirements">
          <p class="text-red-400 font-bold">{{ key.split('_').join(' ').toUpperCase() }}</p>
          <ul class="list-disc">
            <li class="ml-6" v-for="item in val">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="w-full mt-6">
        <p class="border-t-1 border-t-gray-400 mx-auto w-fit pt-4 font-extrabold text-red-400 mb-4">
          INSTITUTION INFORMATION
        </p>
        <div v-for="val in scholarship.institution_info">
          <p class="">
            <span class="text-red-400 font-bold">INSTITUTION NAME: </span>{{ val.institution }}
          </p>
          <p class="text-red-400 font-bold">PROGRAMS OFFERED:</p>
          <ul class="list-disc">
            <li class="ml-6" v-for="item in val.programs_offered">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="w-full grid place-content-center mt-4">
        <button class="btn btn-primary">See Original</button>
      </div>
    </div>
  </div>
</template>
