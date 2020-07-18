<script>
  export let type = "card--locked"; // default
  export let title = "title of test"; // default
  export let subtitle = "subtitle of test"; // default
  export let value = 0; // default
  export let url = "#"; // default

  // local data
  let icon = "locked"; // default
  let color = "color-contrast"; // default

  // Check the type of TestCard and set the right proprties
  $: if (type === "card--locked") {
    icon = "locked";
    color = "color-contrast";
  } else if (type === "card--uncompleted") {
    icon = "unlocked";
    color = "color-primary";
  } else {
    icon = "completed";
    color = "color-success";
  }
</script>

<li class="card {type} padding-sm">
  <a href={url}>
    <div class="card__content">
      <div class="text-component">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
    <!-- progress bar circle  -->
    <div
      class="c-progress-bar js-c-progress-bar"
      data-progress="{value}%"
      data-animation="on">
      <p class="sr-only" aria-live="polite" aria-atomic="true">
        Progress value is
        <span class="js-c-progress-bar__aria-value">{value}%</span>
      </p>

      <div class="c-progress-bar__shape {color}" aria-hidden="true">
        <span class="c-progress-bar__icon {icon}" />

        <svg
          viewBox="0 0 100 100"
          stroke-width="6"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round">
          <circle class="c-progress-bar__bg" cx="50" cy="50" r="44" />
          <circle class="c-progress-bar__fill" cx="50" cy="50" r="44" />
        </svg>
      </div>
    </div>
  </a>
</li>
