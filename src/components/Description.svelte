<script>
  export let isVisible = false;
  export let isLoading = false;
  export let data = "";
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

{#if isVisible}
  <section
    class="bg radius-md overflow-hidden padding-component color-white"
    class:is-striped={isLoading}
    class:bg-primary-light={!isLoading}>
    <!-- Description Slot -->
    <slot name="description" />
    {#if !isLoading}{data}{/if}
  </section>
{/if}
