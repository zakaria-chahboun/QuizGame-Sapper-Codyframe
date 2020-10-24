<script context="module">
  import { StatusTypes } from "../../tools/status.js";
  export async function preload(page, session) {
    let { user } = session;
    let { testID } = page.params;
    let isError = false;
    let message = "";

    if (!user || user.isAnonymous) return this.redirect(302, "/signup");

    const result = await this.fetch(`api/v1/user/result/${testID}`);
    const testData = await result.json();

    // check errors
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
  export let isError;
  export let message;

  export let progress;
  export let needToPass;

  export let test;
  export let testTitle;
  export let testSubtitle;
</script>

{#if isError}
  {message}
{:else}
  <div class="text-component padding-md margin-auto margin-top-md max-width-md">
    <!-- Change the Style to User Score to change the color -->
    <div
      class="progress-bar progress-bar--color-update flex flex-column
      items-center js-progress-bar progress-bar--fill-color-1 progress-bar--init"
      data-animation="on"
      data-duration="2000">
      <div class="progress-bar__bg " aria-hidden="true">
        <!-- Pass Success Score for the Test -->
        <div class="progress-bar__pass">
          Needed to pass
          <br />
          {needToPass}%
        </div>
        <!-- Change the Style to User Score to change the value -->
        <div class="progress-bar__fill" style="width: {progress}%;">
          <div class="progress-bar__score">
            You Scored
            <br />
            <span
              class="progress-bar__value margin-bottom-xs"
              aria-hidden="true">
              <br />
              {progress}%
            </span>
          </div>
          <p class="sr-only" aria-live="polite" aria-atomic="true">
            Progress value is
            <span class="js-progress-bar__aria-value">{progress}%</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- Test Title -->
  <br />
  {testTitle}
  <br />
  {testSubtitle}
{/if}
