<script context="module">
  export async function preload(page, session) {
    let res = await this.fetch(`index.json`);
    let tests = await res.json();
    return { tests };
  }
</script>

<script>
  import TestCard from "../components/testCard/TestCard.svelte";
  import { types } from "../components/testCard/TestCard.js";

  export let tests;
</script>

<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    {#each tests as { testTitle, testSubTitle, testProgress, testStatus }}
      <TestCard
        type="card--{testStatus}"
        value={testProgress}
        title={testTitle}
        subtitle={testSubTitle}
        url="#" />
    {/each}
  </ul>
</div>
