<script context="module">
  export async function preload(page, session) {
    //> /login?message=text
    let { message } = page.query;
    let { user } = session;
    if (!message) message = "welcome to our game!";
    if (user) this.redirect(302, "/");
    return { message };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { StatusTypes } from "../../tools/status.js";
  import { firebaseConfig } from "../../firebase-web-config.js";
  import { goto } from "@sapper/app";

  // ------ Props ------
  export let message; // To show it to the user in case samething happen
  let email;
  let password;

  let firebase;
  let authentication;
  let csrfCookie;

  let isLoading = false; // UI UX
  let isError = false; // UI UX

  // ------ Login with email & password ------
  async function login() {
    // UX
    isLoading = true;
    try {
      /* As httpOnly cookies are to be used, do not persist any state client side 👍
        For the Seesion authentication not the JWT */
      firebase.auth().setPersistence("none");
      // Authenticate 🔥!
      let UserResult = await authentication.signInWithEmailAndPassword(
        email,
        password
      );
      // Get the Firebase TokenID 👈
      let tokenID = await authentication.currentUser.getIdToken(true);
      // Send the CSRF Cookie with the TokenID to the server 👌
      let toServer = await fetch("/api/v1/session_login", {
        method: "POST",
        headers: {
          //Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": csrfCookie
        },
        credentials: "include",
        body: JSON.stringify({ tokenID })
      });
      // Get the result from server (success or failure) 👈
      const serverResult = await toServer.json();
      // Ux
      isLoading = false;
      // Check the result: Success Case 👍
      if (serverResult.status.code == StatusTypes.SUCCESS.code) {
        isError = false;
        message = `Success Login!,your name is ${UserResult.user.displayName}, your id is: ${UserResult.user.uid}`;
        // logout from firebase, WHY? because the backend (and session) is taken the place now 😉
        authentication.signOut();
        // redirect to the home!
        return window.location.assign("/");
      }

      // Failure Case 👎
      isError = true;
      message = data.status.message;
    } catch (error) {
      // UX
      isLoading = false;
      isError = true;
      // Empty fields case: 😉
      if (error.code == StatusTypes.Invalid_Argument.code) {
        message = "Empty fields! Login with a valid email and password!";
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
    // look at 🥰: https://stackoverflow.com/questions/56315901/how-to-import-firebase-only-on-client-in-sapper/63672503#63672503
    const module = await import("firebase/app");
    await import("firebase/auth");
    firebase = module.default;

    firebase = !firebase.apps.length
      ? firebase.initializeApp(firebaseConfig)
      : firebase.app();

    authentication = firebase.auth();

    // ---- get crsf cookie ----
    let jsc = await import("js-cookie");
    let Cookies = jsc.default;
    csrfCookie = Cookies.get("XSRF-TOKEN");
  });
</script>

<div
  class="container margin-top-md margin-bottom-lg justify-between@md
  max-width-xs">
  <div class="login-form">
    <div class="text-component text-center margin-bottom-sm">
      <h1>Log in</h1>
      {#if !isLoading}
        <p class:bg-error-light={isError} class:color-white={isError}>
          {message}
        </p>
      {:else}
        <div class="fill-loader fill-loader--v1" role="alert">
          <p class="fill-loader__label">Content is loading...</p>
          <div aria-hidden="true">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill" />
          </div>
        </div>
      {/if}
    </div>

    <div class="grid gap-xs">
      <div class="col-6@xs">
        <button class="btn btn--subtle width-100%">
          <svg
            aria-hidden="true"
            class="icon margin-right-xxxs"
            viewBox="0 0 16 16">
            <g>
              <path
                d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1
                C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7
                c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3
                c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
            </g>
          </svg>
          <span>Login with Twitter</span>
        </button>
      </div>

      <div class="col-6@xs">
        <button class="btn btn--subtle width-100%">
          <svg
            aria-hidden="true"
            class="icon margin-right-xxxs"
            viewBox="0 0 16 16">
            <g>
              <path
                d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3
                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z" />
            </g>
          </svg>
          <span>Login with Facebook</span>
        </button>
      </div>
    </div>

    <p class="text-center margin-y-sm">or</p>

    <div class="margin-bottom-sm">
      <label class="form-label margin-bottom-xxxs" for="inputEmail1">
        Email
      </label>
      <input
        class="form-control width-100%"
        type="email"
        name="inputEmail1"
        id="inputEmail1"
        bind:value={email}
        placeholder="email@myemail.com" />
    </div>

    <div class="margin-bottom-sm">
      <div class="flex justify-between margin-bottom-xxxs">
        <label class="form-label" for="inputPassword1">Password</label>
        <span class="text-sm">
          <a rel="external" href="reset">Forgot?</a>
        </span>
      </div>

      <input
        class="form-control width-100%"
        type="password"
        name="inputPassword1"
        bind:value={password}
        id="inputPassword1" />
    </div>

    <div class="margin-bottom-sm">
      <button class="btn btn--primary btn width-100%" on:click={login}>
        Login
      </button>
    </div>

    <div class="text-center">
      <p class="text-sm">
        Don't have an account?
        <a rel="external" href="signup">Get started</a>
      </p>
    </div>
  </div>
</div>
