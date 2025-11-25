<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const id = route.query.id
const opportunity = ref({})
const flat_opportunity = ref(null)
const fetchData = async () => {
  const resp = await axios.get(`https://eduvision.live/api/scholarships/${id}`)
  opportunity.value = resp.data.data
}
const editObj = reactive({
  title: String,
})

function flattenObject(obj, parentKey = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}_${key}` : key
    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === 'object')) {
        // Flatten array of objects
        value.forEach((v, i) => flattenObject(v, `${newKey}${i}`, result))
      } else {
        result[newKey] = value.join('; ')
      }
    } else if (typeof value === 'object' && value !== null) {
      flattenObject(value, newKey, result)
    } else {
      result[newKey] = value
    }
  }
  return result
}
function unflattenObject(flat) {
  const result = {}

  // Handle top-level keys directly
  for (const [key, value] of Object.entries(flat)) {
    // Handle requirements fields
    if (key.startsWith('requirements_')) {
      const subKey = key.replace('requirements_', '')
      if (!result.requirements) result.requirements = {}
      result.requirements[subKey] = value
        .split(';')
        .map((v) => v.trim())
        .filter(Boolean)
    }

    // Handle institution_info array (like institution_info0_institution)
    else if (key.startsWith('institution_info')) {
      const match = key.match(/institution_info(\d+)_(.+)/)
      if (match) {
        const index = Number(match[1])
        const subKey = match[2]

        if (!result.institution_info) result.institution_info = []
        if (!result.institution_info[index]) result.institution_info[index] = {}

        // Split programs_offered into an array
        if (subKey === 'programs_offered') {
          result.institution_info[index][subKey] = value
            .split(';')
            .map((v) => v.trim())
            .filter(Boolean)
        } else {
          result.institution_info[index][subKey] = value
        }
      }
    }

    // Everything else → top-level
    else {
      result[key] = value
    }
  }

  return result
}

const uploaded_file = ref(null)
const previewUrl = ref(null)
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploaded_file.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const isEditingTitle = ref(false)
const isEditingDeadline = ref(false)
const isEditingProvider = ref(false)
const isEditingDescription = ref(false)
const isEditingSchoolName = ref(false)
const isEditingProgramOffered = ref(false)
const isEditingEligibility = ref(false)
const isEditingRequiredDocs = ref(false)
const isEditingOfficialLink = ref(false)

const handleSubmit = async () => {
  const unflattenObj = unflattenObject(flat_opportunity.value[0])
  console.log(unflattenObj)

  const formData = new FormData()
  formData.append('data', JSON.stringify(unflattenObj))

  if (uploaded_file.value) {
    formData.append('photo_url', uploaded_file.value)
  }
  const token = localStorage.getItem('token')
  try {
    const resp = await axios.patch(`https://eduvision.live/api/scholarships/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    if (resp.data.success) {
      router.push({ name: 'AdminDashboard' })
    }
  } catch (err) {
    console.log('Error updating opportunity', err)
  }
}

onMounted(async () => {
  await fetchData()
  flat_opportunity.value = [flattenObject(opportunity.value)]
})
</script>
<template>
  <div class="w-[75%] h-fit mx-auto mb-10">
    <h1 class="text-center text-[#00bfff] text-4xl w-full mt-4 font-extralight font-ultra">
      Edit Page
    </h1>
    <div
      v-for="opportunity in flat_opportunity"
      class="flex flex-col items-start gap-10 mt-15 h-fit border-1 text-lg/relaxed p-10 rounded-lg"
    >
      <p
        class="text-center border-t-gray-400/50 text-[#00bfff] font-corben text-2xl border-t-1 max-w-fit block mx-auto py-5"
      >
        Basic Information
      </p>
      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">Title:</p>
        <input
          type="text"
          v-if="isEditingTitle"
          @keyup.enter="isEditingTitle = false"
          v-model="opportunity.title"
          class="input input-primary w-150 text-lg/relaxed"
        />
        <p v-else @click="isEditingTitle = true" class="w-150 text-lg/relaxed">
          {{ opportunity.title }}
        </p>
      </div>

      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">Deadline:</p>
        <input
          type="date"
          v-if="isEditingDeadline"
          @keyup.enter="isEditingDeadline = false"
          v-model="opportunity.deadline_end"
          class="input input-primary w-150 text-lg/relaxed"
        />
        <p v-else @click="isEditingDeadline = true" class="w-150 text-lg/relaxed">
          {{ opportunity.deadline_end }}
        </p>
      </div>

      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">Provider:</p>
        <input
          type="text"
          v-if="isEditingProvider"
          @keyup.enter="isEditingProvider = false"
          v-model="opportunity.provider"
          class="text-lg/relaxed w-150 input input-primary"
        />
        <p v-else @click="isEditingProvider = true" class="w-150 text-lg/relaxed">
          {{ opportunity.provider }}
        </p>
      </div>

      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">Description:</p>
        <textarea
          v-if="isEditingDescription"
          @keyup.enter="isEditingDescription = false"
          v-model="opportunity.description"
          class="text-lg/relaxed p-3 rounded-lg w-150 border-1 border-[#605efe] focus:border-[#605efe] focus:outline-none focus:ring-0"
          cols="10"
          rows="4"
        ></textarea>
        <p v-else @click="isEditingDescription = true" class="w-150 text-lg/relaxed">
          {{ opportunity.description }}
        </p>
      </div>

      <p
        class="text-center border-t-gray-400/50 text-[#00bfff] font-corben text-2xl border-t-1 max-w-fit block mx-auto py-5"
      >
        Institution Info
      </p>

      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">SchoolName:</p>
        <input
          type="text"
          v-if="isEditingSchoolName"
          @keyup.enter="isEditingSchoolName = false"
          v-model="opportunity.institution_info0_institution"
          class="text-lg/relaxed input input-primary w-150"
        />
        <p v-else @click="isEditingSchoolName = true" class="w-150 text-lg/relaxed">
          {{ opportunity.institution_info0_institution }}
        </p>
      </div>

      <div class="mx-auto flex items-baseline w-[60%] justify-between">
        <p class="text-[#00bfff] font-corben">Programs Offered:</p>
        <textarea
          v-if="isEditingProgramOffered"
          @keyup.enter="isEditingProgramOffered = false"
          v-model="opportunity.institution_info0_programs_offered"
          class="text-lg/relaxed w-150 rounded-lg p-3 border-1 border-[#605efe] focus:border-[#605efe] focus:outline-none focus:ring-0"
          cols="20"
          rows="4"
        ></textarea>
        <p v-else @click="isEditingProgramOffered = true" class="w-150 text-lg/relaxed">
          {{ opportunity.institution_info0_programs_offered }}
        </p>
      </div>

      <p
        class="text-center border-t-gray-400/50 text-2xl font-corben text-[#00bfff] border-t-1 max-w-fit block mx-auto py-5"
      >
        Requirements Info
      </p>

      <div class="flex items-baseline w-[60%] mx-auto justify-between">
        <p class="text-[#00bfff] font-corben">Eligibility:</p>
        <textarea
          v-if="isEditingEligibility"
          @keyup.enter="isEditingEligibility = false"
          v-model="opportunity.requirements_eligibility"
          class="w-150 text-lg/relaxed rounded-lg p-3 border-1 border-[#605efe] focus:border-[#605efe] focus:outline-none focus:ring-0"
          cols="40"
          rows="4"
        ></textarea>
        <p v-else @click="isEditingEligibility = true" class="w-150 text-lg/relaxed">
          {{ opportunity.requirements_eligibility }}
        </p>
      </div>

      <div class="flex items-baseline w-[60%] justify-between mx-auto">
        <p class="font-corben text-[#00bfff]">Required Documents:</p>
        <textarea
          v-if="isEditingRequiredDocs"
          @keyup.enter="isEditingRequiredDocs = false"
          v-model="opportunity.requirements_required_documents"
          class="w-150 text-lg/relaxed border-1 rounded-lg p-3 border-[#605efe] focus:border-[#605efe] focus:outline-none focus:ring-0"
          cols="40"
          rows="4"
        ></textarea>
        <p v-else @click="isEditingRequiredDocs = true" class="w-150 text-lg/relaxed">
          {{ opportunity.requirements_required_documents }}
        </p>
      </div>

      <div class="flex items-baseline w-[60%] justify-between mx-auto">
        <p class="font-corben text-[#00bfff]">Official Link:</p>
        <input
          type="text"
          v-if="isEditingOfficialLink"
          @keyup.enter="isEditingOfficialLink = false"
          v-model="opportunity.official_link"
          class="text-lg input input-primary w-150"
        />
        <p v-else @click="isEditingOfficialLink = true" class="w-150 text-lg/relaxed">
          {{ opportunity.official_link }}
        </p>
      </div>

      <div class="flex items-baseline w-[60%] justify-between mx-auto">
        <p class="text-[#00bfff] font-corben">Photo:</p>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple
          class="w-150 border-[#605efe] focus:border-[#605efe] focus:outline-none focus:ring-0"
          @change="onFileChange"
        />
      </div>
      <div v-if="previewUrl" class="mx-auto mt-5">
        <p>Preview:</p>
        <img :src="previewUrl" alt="Preview" width="500" />
      </div>
      <button class="button w-full mx-auto" @click="handleSubmit()">
        <span>Submit</span>
      </button>
    </div>
  </div>
</template>
