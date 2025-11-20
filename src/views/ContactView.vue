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
      <form class="flex flex-col" action="">
        <div class="grid grid-cols-2 w-full gap-3 mb-2">
          <div class="col-start-1 w-full">
            <label for="firstname " class="block mb-2" name="firstname"
              >First Name <span class="text-red-500">*</span></label
            >
            <input type="text" id="firstname" class="input input-primary w-full" required />
          </div>
          <div class="col-start-2 w-full">
            <label for="lastname" class="block mb-2" name="lastname">Last Name</label>
            <input type="text" id="lastname" class="w-full input input-primary" />
          </div>
        </div>
        <div class="mb-2">
          <label for="email" class="block mb-2" name="email"
            >Email <span class="text-red-500">*</span></label
          >
          <input type="email" id="email" class="w-full input input-primary" required />
        </div>
        <div class="mb-5">
          <label for="message" class="block mb-2" name="message"
            >Message <span class="text-red-500">*</span></label
          >
          <input
            type="message"
            id="message"
            class="w-full h-40 input input-primary"
            required
            min="5"
            max="1000"
          />
        </div>
        <button type="submit" class="button mx-auto"><span>Send</span></button>
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
