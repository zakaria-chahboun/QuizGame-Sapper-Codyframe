<script context="module">
  import { StatusTypes } from "../../tools/status.js";
  export async function preload(page, session) {
    let { user } = session;
    let { testID } = page.params;

    // No User or Anonymous?
    if (!user || user.isAnonymous) return this.redirect(302, "/signup");

    const result = await this.fetch(`api/v1/user/result/${testID}`);
    const testData = await result.json();

    // check server errors
    if (testData.status.isError) {
      // No User or Anonymous?
      if (testData.status.code == StatusTypes.Login_Is_Required.code)
        return this.redirect(302, "/signup");
    }

    // No Completed Test = No Result baby 🍪!
    if (!testData.data.isCompleted)
      return this.redirect(302, `/test/${testID}/1`);

    return { ...testData.data };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let progress;
  export let needToPass;
  export let max;

  // page loading content
  let isReady = false;

  // export let testTitle;
  // export let testSubtitle;

  /*
  -- Calculation of percent of progress by the rule of three
    Max => 100%
    progress => {(progress*100)/Max}%
  */

  const calculation = Math.round((progress * 100) / max);
  const variation = calculation - needToPass;

  // Levels
  let levels = {
    quite: "#12B95D", // 😎
    almost: "#7CAEFF", // 🙂
    weak: "#DC2528" // 😭
  };

  let status;

  // Values
  let series;

  // Status with Levels
  if (variation < 0) {
    status = "weak";
    series = [
      {
        perc: calculation,
        color: levels.weak
      },
      {
        perc: needToPass,
        color: "#1F87FF"
      }
    ];
  } else if (variation > 0) {
    status = "quite";
    series = [
      {
        perc: calculation,
        color: levels.quite
      },
      {
        perc: needToPass,
        color: "#1F87FF"
      }
    ];
  } else {
    status = "almost";
    series = [
      {
        perc: calculation,
        color: levels.almost
      },
      {
        perc: needToPass,
        color: "#1F87FF"
      }
    ];
  }

  // Component
  let ProgressBar;

  onMount(async () => {
    const module = await import("@okrad/svelte-progressbar");
    ProgressBar = module.default;
    isReady = true;
  });
</script>

<style>
  .scorebox-quite {
    background-color: #12b95d;
  }
  .scorebox-almost {
    background-color: #7caeff;
  }
  .scorebox-weak {
    background-color: #dc2528;
  }
  .needtopassbox {
    background-color: #1f87ff;
  }
</style>

<!-- Body -->
<div
  class="container margin-top-md margin-bottom-lg justify-between@md
  max-width-xs">
  <div class="text-component text-center margin-bottom-md">
    {#if isReady}
      <!-- Chart Data -->
      <svelte:component
        this={ProgressBar}
        valueLabel={' '}
        textSize={50}
        style="semicircle"
        {series}
        thickness={10}
        width="100%"
        stackSeries={false}
        margin={2} />

      <!-- Scores -->
      <div class="text-component align-middle" transition:fade>
        <span class="progress-cell scorebox-{status}" />
        <span class="col-9 text-lg">Your score is {calculation}%</span>
        <span class="progress-cell needtopassbox" />
        <span class="col-9 text-lg">Need to pass is {needToPass}%</span>

        <br />
        <!-- Status -->
        {#if status == 'quite'}
          <span>You are legend! 😎</span>
        {:else if status == 'almost'}
          <span>Oh! In the middle! 🙂 Good luck in the next test!</span>
        {:else}
          <span>C'mon man! 😭 Replay the test!</span>
        {/if}
      </div>
    {:else}
    <!-- Loading ... -->
      <div class="fill-loader fill-loader--v6" role="alert">
        <p class="fill-loader__label">Content is loading...</p>
        <div aria-hidden="true" class="fill-loader__grid">
          <div class="fill-loader__bar">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill fill-loader__fill--1st" />
          </div>

          <div class="fill-loader__bar">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill fill-loader__fill--2nd" />
          </div>

          <div class="fill-loader__bar">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill fill-loader__fill--3rd" />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
