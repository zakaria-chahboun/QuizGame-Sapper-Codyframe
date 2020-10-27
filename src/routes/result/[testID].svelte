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

  // export let testTitle;
  // export let testSubtitle;

  let levels = {
    quite: "#6DDE4E",
    almost: "#DEA461",
    weak: "#DE205C"
  };

  let ProgressBar;
  let series = [
    {
      perc: progress * 10,
      color: "#5AB6DF"
    },
    {
      perc: needToPass,
      color: "#1F87FF"
    }
  ];

  onMount(async () => {
    const module = await import("@okrad/svelte-progressbar");
    ProgressBar = module.default;
  });
</script>

<div class="text-component padding-md margin-auto margin-top-md max-width-md">

  <svelte:component
    this={ProgressBar}
    textSize={50}
    style="semicircle"
    {series}
    thickness={10}
    width="500px" />
</div>
