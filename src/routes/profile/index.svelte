<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    //console.log(user);
    if (!user || user.isAnonymous) this.redirect(302, "/");
    return { user, ...user };
  }
</script>

<script>
  import { FirebaseProviders } from "../../tools/cool.js";
  import getCroppedImg from "./_cropedImage";
  import { onMount } from "svelte";

  // original data
  export let user;

  // current data: just for to compare between changed data and original data, to submit changes or not! 🐱
  export let name;
  export let phoneNumber;
  export let email;
  export let avatar;

  // Set new avatar image
  let Cropper;
  let crop = { x: 0, y: 0 };
  let files = [];
  let zoom = 1;
  let croppedImage;
  const generateCroppedImage = async (e) => {
    const myCroppedImage = await getCroppedImg(URL.createObjectURL(files[0]), e.detail.pixels);
    croppedImage = myCroppedImage;
  };

  onMount(async () => {
    const module = await import("svelte-easy-crop");
    Cropper = module.default;
  });
</script>

<style>
  .crop-container {
    position: relative;
    padding: 5rem;
    margin-bottom: 50px;
  }
</style>

<!-- Body -->
<div class="container margin-top-lg justify-between@md max-width-xs">
  <div class="shadow-md radius-md padding-md">
    <div class="text-component text-center">
      <!-- Avatar -->
      <div style="justify-content: center; display: flex;">
        <div class="avatar avatar--lg">
          <figure class="avatar__figure" role="img">
            <svg
              class="avatar__placeholder"
              aria-hidden="true"
              viewBox="0 0 20 20"
              stroke-linecap="round"
              stroke-linejoin="round"><circle
                cx="10"
                cy="6"
                r="2.5"
                stroke="currentColor" />
              <path
                d="M10,10.5a4.487,4.487,0,0,0-4.471,4.21L5.5,15.5h9l-.029-.79A4.487,4.487,0,0,0,10,10.5Z"
                stroke="currentColor" /></svg>
            <!-- Avatar Image -->
            {#if avatar || croppedImage}
              <img
                class="avatar__img"
                src={croppedImage || avatar}
                alt=""
                title="" />
            {/if}
          </figure>
        </div>
      </div>
      <!-- Avatar Button -->
      <div class="file-upload inline-block">
        <label
          for="upload2"
          class="file-upload__label btn btn--primary btn--sm margin-bottom-md">
          <span class="flex items-center">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><g
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <path
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  d="M2 16v6h20v-6" />
                <path
                  stroke-linejoin="miter"
                  stroke-linecap="butt"
                  d="M12 17V2" />
                <path
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  d="M18 8l-6-6-6 6" />
              </g></svg>
            <span
              class="margin-left-xxs file-upload__text file-upload__text--has-max-width">Change
              Your Avatar</span>
          </span>
        </label>
        <input
          type="file"
          bind:files
          class="file-upload__input"
          name="upload2"
          id="upload2"
          multiple
          accept="image/png, image/jpeg" />
      </div>
      <!-- Image Cropper -->
      {#if files && files[0]}
        <div class="crop-container ">
          <svelte:component
            this={Cropper}
            image={URL.createObjectURL(files[0])}
            bind:crop
            bind:zoom
            minZoom="0.5"
            on:cropcomplete={generateCroppedImage}
            cropSize={{ height: 100, width: 100 }}
            cropShape="round" />
        </div>
      {/if}
      <!-- Full name -->
      <div class="margin-bottom-md">
        <div class="input-group">
          <div class="input-group__tag">Full name</div>
          <input bind:value={name} class="form-control flex-grow" type="text" />
          <button
            disabled={user.name == name}
            class="btn btn--primary {user.name == name ? 'btn--disabled' : ''}">save</button>
        </div>
      </div>
      <!-- Phone number -->
      <div class="margin-bottom-md">
        <div class="input-group">
          <div class="input-group__tag">Phone number</div>
          <input
            bind:value={phoneNumber}
            class="form-control flex-grow"
            type="text" />
          <button
            disabled={user.phoneNumber == phoneNumber}
            class="btn btn--primary {user.phoneNumber == phoneNumber ? 'btn--disabled' : ''}">save</button>
        </div>
      </div>
      <!-- Email -->
      <div class="margin-bottom-md">
        <div class="input-group">
          <div class="input-group__tag">Email</div>
          <input
            disabled
            value={email}
            class="form-control flex-grow"
            type="text" />
        </div>
      </div>
      {#if user.provider != FirebaseProviders.email_password}
        <span
          class="margin-left-xs margin-right-xs badge badge--outline text-sm">
          You are logged with
          {user.provider}</span>
      {/if}
    </div>
  </div>
</div>
