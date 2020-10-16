<script context="module">
  export async function preload(page, session) {
    const { user } = session;
    const { redirect } = page.query;

    if (user) return this.redirect(302, "/");

    return { redirect };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { StatusTypes } from "../../tools/status.js";
  import { firebaseConfig } from "../../firebase-web-config.js";

  export let redirect;

  let firebaseCore;
  let firebaseApp;
  let authentication;
  let csrfCookie;

  let isLoading = false; // UI UX
  let isError = false; // UI UX
  let message;

  async function anonymous_session_login() {
    // UX
    isLoading = true;
    try {
      // Authenticate 🔥!
      let UserResult = await authentication.signInAnonymously();
      // Get the Firebase TokenID 👈
      let tokenID = await authentication.currentUser.getIdToken(true);
      // Send the CSRF Cookie with the TokenID to the server 👌
      let toServer = await fetch("/api/v1/user/session_login", {
        method: "POST",
        headers: {
          Accept: "application/json",
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
        message = `Success Login! Hello " ${UserResult.user.displayName} "!`;
        // logout from firebase, WHY? because the backend (and session) is taken the place now 😉
        //authentication.signOut();
        // redirect to the url or to home!
        if (redirect) return window.location.assign(redirect);
        return window.location.assign("/");
      }

      // Failure Case 👎
      isError = true;
      message = serverResult.status.message;
    } catch (error) {
      console.log(error);
      // UX
      isLoading = false;
      isError = true;
      // error cases: 😉
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
    firebaseCore = module.default;

    // init the firebase app
    firebaseApp = !firebaseCore.apps.length
      ? firebaseCore.initializeApp(firebaseConfig)
      : firebaseCore.app();

    authentication = firebaseApp.auth();

    // ---- get crsf cookie ----
    let jsc = await import("js-cookie");
    let Cookies = jsc.default;
    csrfCookie = Cookies.get("XSRF-TOKEN");

    // - start anonymouse login -
    anonymous_session_login();
  });
</script>

<style>
  .loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
  }
  .loader {
    left: 50%;
    margin-left: -4em;
    font-size: 10px;
    border: 0.8em solid rgba(218, 219, 223, 1);
    border-left: 0.8em solid rgba(58, 166, 165, 1);
    animation: spin 1.1s infinite linear;
  }
  .loader,
  .loader:after {
    border-radius: 50%;
    width: 8em;
    height: 8em;
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -4.05em;
  }

  @keyframes spin {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>

{#if !isError}
  <div class="loading">
    <div class="loader" />
  </div>
{:else}{message}{/if}
