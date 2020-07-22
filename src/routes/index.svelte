<script context="module">
  export async function preload(page, session) {
    let res = await this.fetch(`api/tests`);
    let tests = await res.json();
    return { tests };
  }
</script>

<script>
  import TestCard from "../components/TestCard.svelte";
  import { goto } from "@sapper/app";

  export let tests;
</script>

<svelte:head>
  <script defer src="codyframe/scripts.js">

  </script>
</svelte:head>

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
