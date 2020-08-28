<script context="module">
  export async function preload(page, session) {
    let res = await this.fetch(`api/v1/tests`);
    let tests = await res.json();

    return { tests: tests.data };
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
    <!-- from Tests collection >> (id, testTitle, testSubtitle, isAuth) -->
    <!-- from Users collection >> isCompleted, stepValue, lastQuestion -->
    {#each tests as { id, testTitle, testSubtitle, isAuth, isCompleted, stepValue, maxSteps, lastQuestion }}
      <TestCard
        type="card--{isAuth ? 'locked' : isCompleted ? 'completed' : 'uncompleted'}"
        title={testTitle}
        subtitle={testSubtitle}
        value={stepValue}
        url="/test/{id}/{lastQuestion == maxSteps ? lastQuestion : lastQuestion + 1}" />
    {/each}
  </ul>
</div>
