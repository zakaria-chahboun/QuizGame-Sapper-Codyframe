<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    if (user && !user.isAnonymous) this.redirect(302, "/");
  }
</script>

<script>
  import { onMount } from "svelte";
  import { StatusTypes } from "../../tools/status.js";
  import { firebaseConfig } from "../../firebase-web-config.js";

  // for errors or whatever message
  let message = "Plese enter your email of your account";

  // UI/UX
  let isLoading = false;
  let isError = false;

  // is page ready?
  let isReady = false; // page

  // email of user
  let email;

  // firebase
  let authentication;

  async function reset() {
    try {
      isLoading = true;
      authentication.useDeviceLanguage();
      await authentication.sendPasswordResetEmail(email);
      isLoading = false;
      message = "Now check your email!";
    } catch (error) {
      console.log(error);
      // UX
      isLoading = false;
      isError = true;
      // Empty fields case: 😉
      if (error.code == StatusTypes.Invalid_Argument.code) {
        message = "empty field! put an email!";
        return;
      }
      // Other cases: 😉
      for (const el in StatusTypes) {
        if (StatusTypes[el].code == error.code) {
          message = StatusTypes[el].message;
          break;
        }
      }
    }
  }

  // ------ client side only ------------------
  onMount(async () => {
    // ---- Firbase Init : For Authentication -
    // Dynamic Import for SSR compatible 🤗
    const module = await import("firebase/app");
    await import("firebase/auth");
    const firebaseCore = module.default;

    // init the firebase app
    const firebaseApp = !firebaseCore.apps.length
      ? firebaseCore.initializeApp(firebaseConfig)
      : firebaseCore.app();

    authentication = firebaseApp.auth();
    isReady = true;
  });
</script>

<div class="container margin-top-lg justify-between@md max-width-xs">
  <div class="password-reset-form">
    <div class="text-component text-center margin-bottom-md">
      <h1>Forgot your password?</h1>
      {#if !isLoading}
        <p class:bg-error-light={isError} class:color-white={isError}>
          {message}
        </p>
      {:else}
        <div class="fill-loader fill-loader--v4" role="alert">
          <p class="fill-loader__label">Content is loading...</p>
          <div aria-hidden="true">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill" />
          </div>
        </div>
      {/if}
    </div>
    {#if isReady}
      <div class="margin-bottom-sm">
        <label class="form-label margin-bottom-xxxs" for="inputEmail1">
          Email
        </label>
        <input
          bind:value={email}
          class="form-control width-100%"
          type="email"
          name="inputEmail1"
          id="inputEmail1"
          placeholder="email@myemail.com" />
      </div>

      <div class="margin-bottom-sm">
        <button class="btn btn--primary btn--md width-100%" on:click={reset}>
          Request reset link
        </button>
      </div>

      <div class="text-center">
        <p class="text-sm">
          <a rel="external" href="login">&larr; Back to login</a>
        </p>
      </div>
    {:else}
      <!-- Loading .. The page is not ready -->
      <div
        class="container margin-top-md margin-bottom-lg justify-between@md
        max-width-xs text-center">
        <div class="fill-loader fill-loader--v6" role="alert">
          <p class="fill-loader__label">Content is loading...</p>
          <div aria-hidden="true" class="fill-loader__grid">
            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--1st" />
            </div>

            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--2nd" />
            </div>

            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--3rd" />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
