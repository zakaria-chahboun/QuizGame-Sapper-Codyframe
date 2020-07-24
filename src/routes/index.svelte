<script context="module">
  export async function preload(page, session) {
    let res = await this.fetch(`api/tests`);
    let tests = await res.json();
    return { tests };
  }
</script>

<script>
  import TestCard from "../components/TestCard.svelte";
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  export let tests;

  // ------ To mount the CodyFrame scripts ------------------------
  let codyFrameScripts = "";
  onMount(() => {
    codyFrameScripts = "codyframe/scripts.js";
  });
</script>

<!-- Scripts CodyFrame (we do this here to mount the bad script on every call of route) -->
<svelte:head>
  <script defer src={codyFrameScripts}>

  </script>
</svelte:head>

<!-- Navbar CodyFrame -->
<Navbar />

<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    {#each tests as { id, testTitle, testSubtitle, isAuth }}
      <TestCard
        type="card--{isAuth ? 'locked' : 'uncompleted'}"
        title={testTitle}
        subtitle={testSubtitle}
        value="25"
        url="/test/{id}/{0}" />
    {/each}
  </ul>
</div>
