<div class="text-component padding-md margin-auto margin-top-md max-width-md">
  <!-- Change the Style to User Score to change the color -->
  <div
    class="progress-bar progress-bar--color-update js-progress-bar flex
    flex-column items-center"
    style="--progress-bar-color-1: 79%;"
    data-animation="on"
    data-duration="2000">
    <div class="progress-bar__bg " aria-hidden="true">
      <!-- Pass Success Score for the Test -->
      <div class="progress-bar__pass">
        Needed to pass
        <br />
        80%
      </div>
      <!-- Change the Style to User Score to change the value -->
      <div class="progress-bar__fill" style="width: 80%;">
        <div class="progress-bar__score">
          You Scored
          <br />
          <span class="progress-bar__value margin-bottom-xs" aria-hidden="true">
            <br />
            /span>
          </span>
        </div>
        <p class="sr-only" aria-live="polite" aria-atomic="true">
          Progress value is
          <span class="js-progress-bar__aria-value" />
        </p>
      </div>
    </div>
  </div>
</div>
