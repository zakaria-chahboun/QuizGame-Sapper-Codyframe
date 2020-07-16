<script>
  import Sidebar from "../../components/Sidebar.svelte";
</script>

<div class="padding-component hide@md no-js:is-hidden">
  <button class="btn btn--primary" aria-controls="sidebar">
    Show progress
  </button>
</div>

<div class="flex@md margin-auto max-width-lg">
  <!-- Side Bar Slot -->
  <Sidebar /> <!-- You should pass the Data inside the component -->

  
    <!-- Steps Data -->
    <!-- <span slot="steps">
      {#each table as t, i}
        <Step type={t.type} index={i + 1} url={t.url} />
      {/each}
    </span>
  </Sidebar> -->

  <!-- Test Area -->
  <main class="flex-grow">
    <!-- start main content -->
    <div class="text-component padding-md max-width-md">
      <!-- Score Slot -->
      <slot name="score" />

      <legend class="form-legend text-bold">
        <!-- Question Slot -->
        <slot name="question" />
      </legend>
      <!-- <h4>Question "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, assumenda?"</h4> -->

      <ul class="radio-list flex flex-column gap-xxxs">
        <!-- Choices slot -->
        <slot />
      </ul>

      <details class="details js-details">
        <summary class="details__summary js-details__summary" role="button">
          <span class="flex items-center">
            <svg
              class="icon icon--xxs margin-right-xxs"
              aria-hidden="true"
              viewBox="0 0 12 12">
              <path
                d="M2.783.088A.5.5,0,0,0,2,.5v11a.5.5,0,0,0,.268.442A.49.49,0,0,0,2.5,12a.5.5,0,0,0,.283-.088l8-5.5a.5.5,0,0,0,0-.824Z" />
            </svg>
            <span>Hint</span>
          </span>
        </summary>

        <div
          class="details__content text-component margin-top-xs
          js-details__content">
          <!-- Hint Slot -->
          <slot name="hint" />
        </div>
      </details>

      <div class="flex flex-wrap justify-between margin-top-sm">
        <div class="text-left">
          <!-- Prev Button Slot -->
          <slot name="prevButton" />
        </div>
        <div class="text-right">
          <!-- Next Button Slot -->
          <slot name="nextButton" />
        </div>
      </div>

    </div>
    <!-- end main content -->
  </main>
</div>
