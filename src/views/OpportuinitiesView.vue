<script setup>
import { reactive, onMounted, ref, computed, watch, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useDataStore } from '@/stores/dataStore'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import * as THREE from 'three'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const storage = localStorage

const toast = useToast()
const show = () => {
  toast.add({ severity: 'success', summary: 'Added to Favorite Succuessfully', life: 3000 })
}
const showError = () => {
  toast.add({ severity: 'warn', summary: 'You are not logged in.', life: 3000 })
}

let scholarships = ref([])
const dataStore = useDataStore()
const router = useRouter()
const routeName = ref('')
const searchQuery = ref('')
const originalData = ref([])
routeName.value = router.currentRoute.value.name

const filterValidOpportunities = (scholarships) => {
  const filteredOpportunities = scholarships.filter((s) => new Date(s.deadline_end) > Date.now())
  return filteredOpportunities
}

const handleSearch = () => {
  console.log(searchQuery.value)
  scholarships.value = originalData.value.filter((scholarship) => {
    return scholarship.provider.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    if (newRoute.name == 'ValidOpportunitiesView') {
      scholarships.value = filterValidOpportunities(originalData.value)
    }
    if (newRoute.name == 'OpportunitiesView') {
      scholarships.value = originalData.value
    }
  },
)

const fetchData = async () => {
  try {
    let resp = await axios.get('https://eduvision.live/api/scholarships')
    originalData.value = resp.data.data
    if (routeName.value == 'ValidOpportunitiesView') {
      const filteredOpportunities = filterValidOpportunities(resp.data.data)
      scholarships.value = filteredOpportunities
    } else {
      scholarships.value = originalData.value
    }
  } catch (err) {
    console.log('error fetching data', err)
  }
}
const isFavorite = ref(false)
const jwt = localStorage.getItem('jwt')
const handleAddFavorite = async (id) => {
  try {
    const resp = await axios.post(
      'https://eduvision.live/api/favorite',
      { scholarship_id: id },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    if (resp.data.success) {
      localStorage.setItem(id, true)
      window.location.reload()
    }
  } catch (err) {
    showError()
    console.log('Error adding favorite: ', err)
  }
}
const handleDeleteFavorite = async (id) => {
  try {
    const resp = await axios.delete(`https://eduvision.live/api/favorite/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    if (resp.data.success) {
      localStorage.removeItem(id)
      window.location.reload()
    }
  } catch (err) {
    showError()
    console.log('Error deleting favotire', err)
  }
}

onMounted(async () => {
  await fetchData()
  function initBrand3D() {
    const canvas = document.getElementById('brandname')
    if (!canvas) {
      return
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    )

    const sizes = {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = canvas.clientWidth
      sizes.height = canvas.clientHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setAnimationLoop(animate)

    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    const pointLight = new THREE.PointLight('#0f2f80', 2000)
    scene.add(pointLight)
    pointLight.position.set(0, 15, 0)

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight('#d56801', 5)
    scene.add(dirLight1)
    dirLight1.position.set(-4, 10, 10)

    const loader = new TTFLoader()
    let textMesh = null
    let fontData = null
    let textGeo = null
    const textMat = new THREE.MeshPhongMaterial({ color: 0xffffff })
    textMat.shininess = 150
    const brand = 'EduVision'
    loader.load(
      '/fonts/ttf/noto-serif.ttf',
      function (ttfData) {
        fontData = new FontLoader().parse(ttfData)
        textMesh = createText(fontData)
      },
      undefined,
      function (err) {
        console.log('Error loading font', err)
      },
    )
    camera.position.z = 50
    function createText(font) {
      if (textMesh !== null) {
        textGeo.dispose()
        textMat.dispose()
        scene.remove(textMesh)
      }
      textGeo = new TextGeometry(brand, {
        font: font,
        size: 10,
        depth: 4,
        curveSegments: 6,
        bevelThickness: 0.8,
        bevelSize: 0.8,
        bevelEnabled: true,
      })
      textGeo.computeBoundingBox()
      textGeo.center()
      textGeo.computeVertexNormals()

      textMesh = new THREE.Mesh(textGeo, textMat)
      textMesh.position.set(0, 1, 2)
      scene.add(textMesh)
      camera.lookAt(0, 0, 0)
      return textMesh
    }

    function animate(time) {
      if (textMesh !== null) {
        textMesh.rotation.y = Math.sin(time * 0.0005) * 0.1
      }
      renderer.render(scene, camera)
    }
  }
  initBrand3D()
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    if (renderer) {
      renderer.dispose()
    }
    if (scene) {
      scene.traverse((obj) => {
        if (!obj.isMesh) return
        if (obj.geometry) {
          obj.geometry.dispose()
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose())
          } else {
            material.dispose()
          }
        }
      })
    }
  })
})
</script>
<template>
  <!-- Component 1 -->
  <div class="flex flex-col mt-15 w-full items-center justify-evenly mb-10 relative">
    <canvas id="brandname" class="w-full h-[500px] block mx-auto"></canvas>
    <div class="absolute top-130 left-[50%] transform -translate-x-[50%] z-5 w-fit">
      <div class="flex gap-4 items-start">
        <div class="w-fit h-full rounded-lg">
          <form @submit.prevent="handleSearch" class="flex flex-col items-center gap-4">
            <input
              type="text"
              class="text-2xl input input-primary h-18"
              placeholder="Type anything to search"
              v-model="searchQuery"
            />
            <button class="button" type="submit"><span>Search</span></button>
          </form>
        </div>
        <div class="flex justify-evenly border-1 items-center py-5 rounded-lg w-200">
          <div class="relative group">
            <input type="checkbox" class="peer hidden" id="sort" />
            <label for="sort" class="cursor-pointer">
              <div class="flex items-center gap-4">
                <i class="pi pi-sort-amount-down text-2xl"></i>
                <p class="text-lg font-corben">Sort</p>
              </div>
            </label>
            <ul
              class="absolute invisible group-hover:visible w-50 h-fit flex flex-col top-[100%] left-[50%] -translate-x-[50%] bg-[#793ef9] items-center py-4 rounded-lg"
            >
              <li
                class="hover:bg-gray-400/80 w-full font-corben text-center py-2 cursor-pointer rounded-lg"
              >
                Newest
              </li>
              <li
                class="hover:bg-gray-400/80 w-full text-center font-corben py-2 cursor-pointer rounded-lg"
              >
                Oldest
              </li>
            </ul>
          </div>
          <div class="relative group">
            <label for="filter" class="cursor-pointer">
              <div class="flex items-center gap-4">
                <i class="pi pi-filter-fill text-2xl"></i>
                <p class="text-lg font-corben">Filter</p>
              </div>
            </label>
            <ul
              class="absolute font-corben invisible group-hover:visible w-50 h-fit flex flex-col bg-[#793ef9] items-center py-4 rounded-lg top-[100%] left-[50%] translate-x-[-50%]"
            >
              <li class="hover:bg-gray-400/80 w-full text-center py-2 cursor-pointer rounded-lg">
                School
              </li>
              <li class="hover:bg-gray-400/80 w-full text-center py-2 cursor-pointer rounded-lg">
                Major
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="scholarships.length === 0" class="absolute top-175">
      <p class="font-corben text-3xl">
        There is nothing to show. Maybe try to adjust your filter view.
      </p>
    </div>
    <div v-else v-for="(dat, key, index) in scholarships" class="w-[75%]" :key="dat.id">
      <div class="border-1 border-white/50 rounded-lg md:hidden">
        <div class="max-h-[500px] overflow-y-scroll arounded-lg p-6 flex flex-col items-center">
          <img :src="`${dat.photo_url}`" alt="" class="w-[200px] rounded-lg" />
          <p class="text-sm/relaxed text-center mt-4">{ dat.title }</p>
          <div
            v-if="dat.provider"
            class="font-extrabold mt-4 p-4 relative after:absolute after:content-[''] after:border-t-[0.5px] after:border-white/50 after:left-10 after:right-10 after:bottom-10 after:-z-2 after:inset-0 w-full"
          >
            <p class="text-sm text-center italic font-extrabold">Provider</p>
            <p class="text-xs text-center font-normal mt-3">{{ dat.provider }}</p>
          </div>
          <div
            v-if="dat.description"
            class="font-extrabold mt-4 p-4 relative after:absolute after:content-[''] after:border-t-[0.5px] after:border-white/50 after:left-10 after:right-10 after:bottom-10 after:-z-2 after:inset-0 w-full"
          >
            <p class="text-sm font-extrabold text-center italic">Description</p>
            <p class="text-xs/relaxed text-center font-normal mt-3">{{ dat.description }}</p>
          </div>
          <div
            v-if="dat.requirements"
            class="font-extrabold mt-4 p-4 relative after:absolute after:content-[''] after:border-t-[0.5px] after:border-white/50 after:left-10 after:right-10 after:bottom-10 after:-z-2 after:inset-0 w-full"
          >
            <p class="text-sm font-extrabold text-center italic">Requirements</p>
            <div v-for="(val, k, idx) in dat.requirements" class="mt-5">
              <p class="text-xs font-bold italic text-left w-full">
                {{ `${k.split('_').join(' ').toUpperCase()} :` }}
              </p>
              <ul class="list-disc text-xs/relaxed" v-for="detail in val">
                <li class="font-normal">{{ detail }}</li>
              </ul>
            </div>
          </div>
          <div
            v-if="dat.institution_info"
            v-for="val in dat.institution_info"
            class="font-extrabold mt-4 p-4 relative after:absolute after:content-[''] after:border-t-[0.5px] after:border-white/50 after:left-10 after:right-10 after:bottom-10 after:-z-2 after:inset-0 w-full"
          >
            <p class="text-sm text-center italic font-extrabold">Institution Info</p>
            <p v-if="val.institution" class="text-xs font-bold italic mt-3">
              Name: <span class="font-normal not-italic">{{ val.institution }}</span>
            </p>
            <p v-if="val.programs_offered" class="text-xs font-bold italic mt-5">
              Programs Offered
            </p>
            <ul
              v-if="val.programs_offered"
              class="list-disc text-xs/relaxed"
              v-for="i in val.programs_offered"
            >
              <li class="font-normal">{{ i }}</li>
            </ul>
          </div>
          <p v-if="dat.extra_notes" class="italic font-bold text-xs">
            {{ `*  ${dat.extra_notes}` }}
          </p>
          <div class="flex justify-evenly mt-3 flex-col gap-4 items-center">
            <p v-if="dat.deadline_end" class="font-bold italic">
              <span class="font-bold mr-3 not-italic">Deadline:</span>
              <span class="underline text-red-400 font-normal">{{
                new Date(dat.deadline_end).toDateString()
              }}</span>
            </p>
            <a v-if="dat.official_link" class="button" :href="dat.official_link"
              ><span>See Original</span></a
            >
          </div>
        </div>
      </div>

      <!-- Big display -->
      <div class="md:block relative hidden overscroll-auto h-[900px] mt-70 z-1">
        <div
          v-if="dat.photo_url"
          class="bg-no-repeat blur-[3px] bg-center bg-cover h-full absolute inset-0 -z-3"
          :style="{ backgroundImage: `url(${dat.photo_url})` }"
        ></div>
        <div
          v-else
          class="bg-no-repeat blur-[3px] bg-center bg-cover h-full absolute inset-0 -z-3"
          :style="{ backgroundImage: `url('/logo.png')` }"
        ></div>
        <div class="w-full absolute inset-0 text-white flex-col items-center">
          <div class="h-full custom-dark overflow-y-scroll">
            <h1
              class="text-3xl tracking-wide text-[#00bfff] mx-auto border-1 rounded-lg border-gray-400/50 p-6 max-w-[90%] text-center font-semibold font-corben mt-9 bg-gray-900/50"
            >
              {{ dat.title }}
              <Toast />
              <div
                v-if="storage.getItem(dat.id) !== 'true'"
                class="pi pi-heart w-20 cursor-pointer"
                @click="handleAddFavorite(dat.id)"
              ></div>
              <div
                v-if="storage.getItem(dat.id) === 'true'"
                class="pi pi-heart-fill w-20 cursor-pointer"
                @click="handleDeleteFavorite(dat.id)"
              ></div>
            </h1>
            <div class="text-lg/loose p-9 ml-10 mr-10 mt-7 mb-5">
              <p v-if="dat.deadline_end" class="italic">
                <span class="text-[#00bfff] mr-3 not-italic font-semibold tracking-wide"
                  >Deadline: </span
                ><span class="font-extrabold text-red-400">{{
                  new Date(dat.deadline_end).toDateString()
                }}</span>
              </p>
              <p v-if="dat.provider" class="">
                <span v-if="dat.provider" class="mr-2 text-[#00bfff] font-semibold tracking-wide"
                  >Provider: </span
                ><a :href="dat.official_link">{{ dat.provider }}</a>
              </p>
              <p v-if="dat.description">
                <span v-if="dat.description" class="text-[#00bfff] font-semibold tracking-wide mr-2"
                  >Description: </span
                >{{ dat.description }}
              </p>
              <p
                v-if="dat.requirements"
                class="text-center font-corben tracking-wide text-xl relative after:content-[''] mt-4 after:left-30 after:right-30 after:top-0 pt-4 after:bottom-0 after:opacity-30 after:border-t-2 after:absolute font-semibold text-[#00bfff]"
              >
                Requirements
              </p>
              <div v-if="dat.requirements" v-for="(val, k, idx) in dat.requirements">
                <span class="text-[#00bfff] mr-3 not-italic font-semibold tracking-wide"
                  >{{
                    k
                      .split('_')
                      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                      .join(' ')
                  }}:</span
                >
                <ul
                  class="ml-5 list-disc"
                  v-if="typeof val === 'object' && val !== null"
                  v-for="item in val"
                >
                  <li class="ml-6">{{ item }}</li>
                </ul>
                <li v-else class="ml-6">{{ val }}</li>
              </div>
              <p
                v-if="dat.requirements"
                class="text-center font-corben tracking-wide text-xl relative after:content-[''] mt-4 after:left-30 after:right-30 after:top-0 pt-4 after:bottom-0 after:opacity-30 after:border-t-2 after:absolute font-semibold text-[#00bfff]"
              >
                Institution Information
              </p>
              <div v-if="dat.institution_info" v-for="(val, k, idx) in dat.institution_info">
                <p v-if="val.institution" class="">
                  <span class="text-[#00bfff] mr-3 not-italic font-semibold tracking-wide"
                    >Name:</span
                  >
                  {{ val.institution }}
                </p>
                <p
                  v-if="val.programs_offered"
                  class="text-[#00bfff] mr-3 not-italic font-semibold tracking-wide"
                >
                  Program Offred:
                </p>
                <ul
                  v-if="val.programs_offered"
                  class="ml-5 list-disc"
                  v-for="item in val.programs_offered"
                >
                  <li class="ml-6">{{ item }}</li>
                </ul>
              </div>
              <p v-if="dat.extra_notes" class="italic font-bold text-sm">
                {{ `*  ${dat.extra_notes}` }}
              </p>
              <div class="flex justify-evenly mt-3">
                <a v-if="dat.official_link" class="button" :href="dat.official_link"
                  ><span>See Original</span></a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
