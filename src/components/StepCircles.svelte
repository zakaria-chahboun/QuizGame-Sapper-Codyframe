<script>
  import { goto } from "@sapper/app";

  // Ui/Ux : loading data >> for tell the user to wait
  let wait = false;

  // data format:
  export let data = [
    { type: "", url: "#", index: 1 },
    { type: "", url: "#", index: 2 },
    { type: "", url: "#", index: 3 },
    { type: "", url: "#", index: 4 }
  ];

  // test is completed?
  export let isCompleted = false;
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

{#each data as { type, index, url }}
  <div
    class="progress-cell {wait ? 'is-striped' : type}"
    on:click={async () => {
      if (isCompleted) {
        wait = !wait;
        await goto(url);
        wait = !wait;
      }
    }}>
    <p>{index}</p>
  </div>
{/each}
