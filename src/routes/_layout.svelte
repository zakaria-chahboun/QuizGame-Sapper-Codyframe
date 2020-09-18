<script>
  export let segment;
  import Navbar from "../components/Navbar.svelte";
  //import { firebaseConfig } from "../firebase-web-config";
  // import { firebase } from "../components/store";
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  const { session } = stores();

  if ($session.user && !$session.user.isAnonymous) {
    segment = "logout";
  }

  // let uid;
  //let isAnonymous;

  let codyFrameScripts = "";
  onMount(async () => {
    // ---- To mount the CodyFrame scripts ----
    codyFrameScripts = "codyframe/scripts.js";
    // ---- To init the firebase ----
    // Dynamic Import for SSR compatible 🤗
    // look at 🥰: https://stackoverflow.com/questions/56315901/how-to-import-firebase-only-on-client-in-sapper/63672503#63672503
    //   const module = await import("firebase/app");
    //   await import("firebase/auth");
    //   $firebase = module.default;

    //   $firebase = !$firebase.apps.length
    //     ? $firebase.initializeApp(firebaseConfig)
    //     : $firebase.app();

    //   let currentUser = $firebase.auth().currentUser;

    //   if (!currentUser) {
    //     $firebase.auth().signInAnonymously();
    //   }

    //   $firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //       isAnonymous = user.isAnonymous;
    //       uid = user.uid;
    //     }
    //   });
  });
</script>

<style lang="scss" global>
  /* codyframe framework SASS - Global */
  @import "./codyframe/assets/css/style.scss";
</style>

<svelte:head>
  <script defer src={codyFrameScripts}>

  </script>
</svelte:head>
{#if $session.user}
  User: ID: {$session.user.uid || '__'}, isAnonymous: {$session.user.isAnonymous || '__'}
{:else}No User{/if}
<Navbar {segment} />
<slot />
