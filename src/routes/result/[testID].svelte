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
  export let progress;
  export let needToPass;
  export let max;

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
    quite: "#12B95D", // 🥰
    almost: "#1F87FF", // 🙂
    weak: "#7CAEFF" // 😭
  };

  // Values
  let series;

  // Status with Levels
  if (variation < 0) {
    series = [
      {
        perc: calculation,
        color: levels.weak
      },
      {
        perc: variation * -1,
        color: "#1F87FF"
      }
    ];
  } else if (variation > 0) {
    series = {
      perc: calculation,
      color: levels.quite
    };
  } else {
    series = {
      perc: calculation,
      color: levels.almost
    };
  }

  // Component
  let ProgressBar;

  onMount(async () => {
    const module = await import("@okrad/svelte-progressbar");
    ProgressBar = module.default;
  });
</script>

<!-- Body -->
<div
  class="container margin-top-md margin-bottom-lg justify-between@md
  max-width-xs">
  <div class="text-component text-center margin-bottom-sm">
    <svelte:component
      this={ProgressBar}
      textSize={50}
      style="semicircle"
      {series}
      thickness={10}
      width="500px" />
  </div>
</div>
