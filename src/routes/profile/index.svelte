<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    //console.log(user);
    if (user && user.isAnonymous) this.redirect(302, "/");
    return { user, ...user };
  }
</script>

<script>
  import { FirebaseProviders } from "../../tools/cool.js";
  // original data
  export let user;

  // current data: just for to compare between changed data and original data, to submit changes or not! 🐱
  export let name;
  export let phoneNumber;
  export let email;
  export let avatar;
</script>

<!-- Body -->
<div class="container margin-top-lg justify-between@md max-width-xs">
  <div class="shadow-md radius-md padding-md">
    <div class="text-component text-center margin-bottom-md">
      <!-- Avatar -->
      <div style="justify-content: center; display: flex;">
        <div class="avatar avatar--lg margin-bottom-md">
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
            {#if avatar}
              <img class="avatar__img" src={avatar} alt="" title="" />
            {/if}
          </figure>
        </div>
      </div>
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
          <div class="input-group__tag">
            {user.provider != FirebaseProviders.email_password ? user.provider : 'Email'}
          </div>
          <input
            disabled={user.provider != FirebaseProviders.email_password}
            bind:value={email}
            class="form-control flex-grow"
            type="text" />
          {#if user.provider == FirebaseProviders.email_password}
            <button
              disabled={user.email == email}
              class="btn btn--primary {user.email == email ? 'btn--disabled' : ''}">save</button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
