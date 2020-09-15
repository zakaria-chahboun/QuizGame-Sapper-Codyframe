<script>
  export let segment;
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";

  let codyFrameScripts = "";
  onMount(async () => {
    // ---- To mount the CodyFrame scripts ----
    codyFrameScripts = "codyframe/scripts.js";
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

<Navbar {segment} />
<slot />
