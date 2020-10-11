<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    let { testID } = page.params;
    let isCompleted;

    if (!user) this.redirect(302, "/");

    const result = await this.fetch(`api/v1/user/tests/${testID}`);
    const testData = await result.json();

    if (testData.status.isError)
      return this.error(result.status, testData.status.message);

    if (!testData.data.isCompleted)
      return this.redirect(
        302,
        `/test/${testID}/${testData.data.lastQuestion}`
      );
  }
</script>

<script>
  export let progress = 20;
  export let neededToPass = 80;
</script>

<div class="text-component padding-md margin-auto margin-top-md max-width-md">
  <!-- Change the Style to User Score to change the color -->
  <div
    class="progress-bar progress-bar--color-update flex flex-column items-center
    js-progress-bar progress-bar--fill-color-1 progress-bar--init"
    data-animation="on"
    data-duration="2000">
    <div class="progress-bar__bg " aria-hidden="true">
      <!-- Pass Success Score for the Test -->
      <div class="progress-bar__pass">
        Needed to pass
        <br />
        {neededToPass}%
      </div>
      <!-- Change the Style to User Score to change the value -->
      <div class="progress-bar__fill" style="width: {progress}%;">
        <div class="progress-bar__score">
          You Scored
          <br />
          <span class="progress-bar__value margin-bottom-xs" aria-hidden="true">
            <br />
            50%
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
