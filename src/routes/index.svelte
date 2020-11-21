<script context="module">
  export async function preload(page, session) {
    let res = await this.fetch(`api/v1/user/tests`);
    let tests = await res.json();

    if (tests.status.isError)
      return this.redirect(302, `login?message=${tests.status.message}`);

    return { tests: tests.data };
  }
</script>

<script>
  import TestCard from "../components/TestCard.svelte";

  export let tests;
</script>

<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    {#each tests as { id, testTitle, testSubtitle, isPrivate, isCompleted, stepValue, maxSteps, lastQuestion }}
      <TestCard
        type="card--{isCompleted ? 'completed' : isPrivate ? 'locked' : 'uncompleted'}"
        title={testTitle}
        subtitle={testSubtitle}
        value={stepValue}
        url="/test/{id}/{lastQuestion == maxSteps ? lastQuestion : lastQuestion + 1}" />
    {/each}
  </ul>
</div>
