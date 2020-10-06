<script context="module">
  import { StatusTypes } from "../tools/status.js";

  export async function preload(page, session) {
    let res = await this.fetch(`api/v1/user/tests`);
    let tests = await res.json();
    const { user } = session;

    if (tests.status.isError)
      return this.redirect(302, `login?message=${tests.status.message}`);

    if (!user) return this.redirect(302, `anonymous`);

    return { tests: tests.data };
  }
</script>

<script>
  import TestCard from "../components/TestCard.svelte";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  export let tests;
</script>

<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    {#each tests as { id, testTitle, testSubtitle, isAuth, isCompleted, stepValue, maxSteps, lastQuestion }}
      <TestCard
        type="card--{isCompleted ? 'completed' : isAuth ? 'locked' : 'uncompleted'}"
        title={testTitle}
        subtitle={testSubtitle}
        value={stepValue}
        url="/test/{id}/{lastQuestion == maxSteps ? lastQuestion : lastQuestion + 1}" />
    {/each}
  </ul>
</div>
