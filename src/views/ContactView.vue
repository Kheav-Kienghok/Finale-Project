<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
const message = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const messageState = reactive({
  isSuccess: false,
  message: '',
  loading: false,
})
const handleSubmit = async () => {
  messageState.loading = true
  let name = firstName.value
  if (lastName) {
    name = firstName.value + ' ' + lastName.value
  }
  const payload = {
    to: 'support@eduvision.live',
    subject: 'Support Ticket',
    message: `Sender Name: ${name}\nEmail: ${email.value}\nMessage: ${message.value}`,
  }
  try {
    const resp = await axios.post('https://gmail.corevibe.tech', payload, {
      'Content-Type': 'application/json',
    })
    if (resp.status === 200) {
      messageState.loading = false
      messageState.message = resp.data.message
      messageState.isSuccess = true
      message.value = ''
      email.value = ''
      firstName.value = ''
      lastName.value = ''
      setTimeout(() => {
        messageState.message = ''
      }, 5000)
    }
  } catch (err) {
    console.log(err)
    messageState.loading = false
    messageState.isSuccess = false
    messageState.message = 'Something went wrong please try again later.'
    setTimeout(() => {
      messageState.message = ''
    }, 5000)
  }
}
</script>
<template>
  <div class="grid grid-cols-3 grid-rows-2 mt-10">
    <div class="col-start-1 my-auto">
      <p class="text-5xl text-center font-corben font-extrabold mb-4 text-[#00bfff]">
        Get in Touch
      </p>
      <p class="mb-10 font-corben text-center text-[#00bfff] font-semibold">
        I'd like to hear from you!
      </p>
      <p class="font-light text-center mx-auto max-w-70 text-sm/relaxed">
        If you have any inquiries or just want to say hi, please feel free to use the contact form
        to reach out to us. Thank you!
      </p>
    </div>
    <div class="col-start-2 col-span-2 w-200 mx-auto">
      <p
        v-if="messageState.message && messageState.isSuccess"
        class="text-center w-fit mx-auto py-3 rounded-lg mb-4 text-xl px-10 bg-green-400 text-white font-bold"
      >
        {{ messageState.message }}
      </p>
      <p
        v-if="messageState.message && !messageState.isSuccess"
        class="text-center w-fit mx-auto py-3 rounded-lg mb-4 text-xl px-10 bg-red-400 text-white font-bold"
      >
        {{ messageState.message }}
      </p>
      <form class="flex flex-col" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 w-full gap-3 mb-2">
          <div class="col-start-1 w-full">
            <label for="firstname " class="block mb-2" name="firstname"
              >First Name <span class="text-red-500">*</span></label
            >

            <input
              v-model="firstName"
              type="text"
              id="firstname"
              class="input input-primary w-full"
              required
            />
          </div>
          <div class="col-start-2 w-full">
            <label for="lastname" class="block mb-2" name="lastname">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              id="lastname"
              class="w-full input input-primary"
            />
          </div>
        </div>
        <div class="mb-2">
          <label for="email" class="block mb-2" name="email"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            type="email"
            v-model="email"
            id="email"
            class="w-full input input-primary"
            required
          />
        </div>
        <div class="mb-5">
          <label for="message" class="block mb-2" name="message"
            >Message <span class="text-red-500">*</span></label
          >
          <input
            type="message"
            v-model="message"
            id="message"
            class="w-full h-40 input input-primary"
            required
            min="5"
            max="1000"
          />
        </div>
        <span v-if="messageState.loading" class="loading loading-dots loading-lg mx-auto"></span>
        <button v-else type="submit" class="button mx-auto mt-2"><span>Send</span></button>
      </form>
    </div>
    <div class="flex gap-10 items-center col-span-3 row-start-2 mx-auto">
      <a href="https://facebook.com" target="_blank">
        <span class="pi pi-facebook mr-2"></span>EduVision</a
      >
      <a href="https://instagram.com" target="_blank">
        <span class="pi pi-instagram mr-2"></span>EduVision</a
      >
      <a href="https://x.com" target="_blank"> <span class="pi pi-twitter mr-2"></span>EduVision</a>
      <a href="https://telegram.org" target="_blank">
        <span class="pi pi-telegram mr-2"></span>EduVision</a
      >
    </div>
  </div>
</template>
