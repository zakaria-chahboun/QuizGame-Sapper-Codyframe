<script>
  import { firebase } from "../components/store.js";
  import { firebaseConfig } from "../firebase-web-config.js";
  //export let segment;
  // import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    // Dynamic Import for SSR compatible 🤗
    // look at 🥰: https://stackoverflow.com/questions/56315901/how-to-import-firebase-only-on-client-in-sapper/63672503#63672503
    const module = await import("firebase/app");
    await import("firebase/auth");
    $firebase = module.default;

    // Initialize firebase: in the client side for the authentication reason
    $firebase = !$firebase.apps.length
      ? $firebase.initializeApp(firebaseConfig)
      : $firebase.app();

    $firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("User UID: ", user.uid);
      } else {
        console.log("NO USER");
        // No user is signed in.
      }
    });
  });
</script>

<style lang="scss" global>
  /* codyframe framework SASS - Global */
  @import "./codyframe/assets/css/style.scss";
</style>

<slot />
