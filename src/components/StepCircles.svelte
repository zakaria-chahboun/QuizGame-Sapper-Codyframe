<script>
  import { goto } from "@sapper/app";

  // Ui/Ux : loading data >> for tell the user to wait
  let wait = false;

  // data format:
  export let data = [
    { type: "", url: "#", index: 1, done: false },
    { type: "", url: "#", index: 2, done: false },
    { type: "", url: "#", index: 3, done: false },
    { type: "", url: "#", index: 4, done: false }
  ];

  // test is completed?
  export let isCompleted = false;

  /*
  Let User Show His Previous Progress IF:
    - question is not done.
    - test is completed.
  */
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

{#each data as { type, index, url, done }}
  <div
    class="progress-cell {wait ? 'is-striped' : type}"
    on:click={async () => {
      if (!done || isCompleted) {
        wait = !wait;
        await goto(url);
        wait = !wait;
      }
    }}>
    <p>{index}</p>
  </div>
{/each}
