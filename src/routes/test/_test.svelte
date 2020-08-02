<script>
  import Navbar from "../../components/Navbar.svelte";
  import { onMount } from "svelte";

  // to make description background strped animation when description is shown
  export let descriptionStriped = false;
  export let descriptionShow = false;

  // ------ To mount the CodyFrame scripts ------------------------
  let codyFrameScripts = "";
  onMount(() => {
    codyFrameScripts = "codyframe/scripts.js";
  });
</script>

<style>
  .is-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #e0efff,
      #e0efff 0.5rem,
      #1f87ff 0.5rem,
      #1f87ff 1rem
    );
    background-size: 200% 200%;
    animation: progress 7s linear infinite;
  }

  @keyframes progress {
    100% {
      background-position: 100% 100%;
    }
  }
</style>

<!-- Scripts CodyFrame (we do this here to mount the bad script on every call of route) -->
<svelte:head>
  <script defer src={codyFrameScripts}>

  </script>
</svelte:head>

<!-- Navbar CodyFrame -->
<Navbar />

<div class="padding-component hide@md no-js:is-hidden">
  <button class="btn btn--primary" aria-controls="sidebar">
    Show progress
  </button>
</div>

<div class="flex@md margin-auto max-width-lg">
  <!-- Side Bar Slot -->
  <slot name="sidebar" />

  <!-- Test Area -->
  <main class="flex-grow">
    <!-- start main content -->
    <div class="text-component padding-md max-width-md">
      <!-- StepBat Slot -->
      <slot name="stap-bar" />

      <legend class="form-legend text-bold">
        <!-- Question Slot -->
        <slot name="question" />
      </legend>
      <!-- <h4>Question "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, assumenda?"</h4> -->

      <ul class="radio-list flex flex-column gap-xxxs">
        <!-- Choices slot -->
        <slot />
      </ul>

      {#if descriptionShow}
        <section
          class="bg radius-md overflow-hidden padding-component"
          class:is-striped={descriptionStriped}
          class:bg-primary-light={!descriptionStriped}>
          <!-- Description Slot -->
          <slot name="description" />
        </section>
      {/if}

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
