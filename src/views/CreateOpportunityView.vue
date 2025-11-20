<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
const title = ref('')
const date = ref('')
const provider = ref('')
const description = ref('')
const schoolname = ref('')
const programoffered = ref('')
const eligibility = ref('')
const requireddocs = ref('')
const officiallinks = ref('')
const deadline = ref('')

const successMsg = ref('')
const errorMsg = ref('')

const handleSubmit = async () => {
  const programs_offered_arr = programoffered.value.split(';')
  const eligibility_arr = eligibility.value.split(';')
  const required_documents_arr = requireddocs.value.split(';')

  const payload = {
    title: title.value,
    provider: provider.value,
    description: description.value,
    institution_info: [
      {
        institution: schoolname.value,
        programs_offered: programs_offered_arr,
      },
    ],
    requirements: {
      eligibility: eligibility_arr,
      required_documents: required_documents_arr,
    },
    official_link: officiallinks.value,
    deadline_end: deadline.value,
  }
  const token = localStorage.getItem('token')
  try {
    const resp = await axios.post(`https://eduvision.live/api/scholarships`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (resp.data.success) {
      successMsg.value = 'Created Successfully'
      title.value = ''
      date.value = ''
      provider.value = ''
      description.value = ''
      schoolname.value = ''
      programoffered.value = ''
      eligibility.value = ''
      requireddocs.value = ''
      officiallinks.value = ''
      deadline.value = ''
      setTimeout(() => {
        successMsg.value = ''
      }, 3000)
    }
  } catch (err) {
    errorMsg.value = err || 'Something went wrong please try again later'
  }
}
</script>
<template>
  <p class="text-center font-corben font-bold text-2xl">Create New Opportunity</p>
  <p
    v-if="successMsg"
    class="bg-green-400 text-black text-center w-fit mx-auto px-10 py-2 mt-10 rounded-lg"
  >
    {{ successMsg }}
  </p>
  <p
    v-if="errorMsg"
    class="bg-red-400 text-black text-center w-fit mx-auto px-10 py-2 mt-10 rounded-lg"
  >
    {{ errorMsg }}
  </p>
  <form
    @submit.prevent="handleSubmit"
    class="grid grid-cols-2 grid-rows-9 gap-x-15 gap-y-4 max-w-[50%] mx-auto m-8 border-1 border-blue-500 px-10 py-10 rounded-lg"
  >
    <p class="row-start-1 col-span-2 text-center my-auto font-corben text-xl">Basic Information</p>
    <div class="row-start-2 col-start-1">
      <label for="title" class="block mb-3">Title <span class="text-red-500">*</span></label>
      <input type="text" v-model="title" id="title" required class="input input-primary w-full" />
    </div>
    <div class="row-start-2 col-start-2">
      <label for="deadline" class="block mb-3">Deadline <span class="text-red-500">*</span></label>
      <input type="date" v-model="date" id="deadline" required class="input input-primary w-full" />
    </div>
    <div class="row-start-3 col-start-1">
      <label for="provider" class="block mb-3">Provider <span class="text-red-500">*</span></label>
      <input
        type="text"
        v-model="provider"
        id="provider"
        required
        class="input input-primary w-full"
      />
    </div>
    <div class="row-start-3 col-start-2">
      <label for="description" class="block mb-3"
        >Description <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="description"
        id="description"
        required
        class="input input-primary w-full"
      />
    </div>
    <p class="row-start-4 col-span-2 text-center my-auto font-corben text-xl">
      Institution Information
    </p>
    <div class="row-start-5 col-start-1">
      <label for="schoolname" class="block mb-3"
        >School Name <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="schoolname"
        id="schoolname"
        required
        class="input input-primary w-full"
      />
    </div>
    <div class="row-start-5 col-start-2">
      <label for="programoffered" class="block mb-3"
        >Program Offered <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="programoffered"
        id="programoffered"
        required
        class="input input-primary w-full"
      />
    </div>
    <p class="row-start-6 col-span-2 text-center my-auto font-corben text-xl">
      Requirements Information
    </p>
    <div class="row-start-7 col-start-1">
      <label for="eligibility" class="block mb-3"
        >Eligibility <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="eligibility"
        id="eligibility"
        required
        class="input input-primary w-full"
      />
    </div>
    <div class="row-start-7 col-start-2">
      <label for="requireddocs" class="block mb-3"
        >Required　Documents <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="requireddocs"
        id="requireddocs"
        required
        class="input input-primary w-full"
      />
    </div>
    <div class="row-start-8 col-span-2 w-full">
      <label for="officiallinks" class="block mb-3"
        >Official Link <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        v-model="officiallinks"
        id="officiallinks"
        required
        class="input input-primary w-full"
      />
    </div>
    <button class="button row-start-9 col-span-2 m-auto"><span>Create</span></button>
  </form>
</template>
