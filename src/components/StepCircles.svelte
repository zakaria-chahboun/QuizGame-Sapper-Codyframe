<script>
  import { goto } from "@sapper/app";

  // data format:
  export let data = [
    { type: "", url: "#", index: 1, done: false },
    { type: "", url: "#", index: 2, done: false },
    { type: "", url: "#", index: 3, done: false },
    { type: "", url: "#", index: 4, done: false }
  ];

  // Ui/Ux : loading data for each stepcircle: the user have to wait
  let wait = data.map(e => false);

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

{#each data as { type, index, url, done }, i}
  <div
    class="progress-cell {wait[i] ? 'is-striped' : type}"
    on:click={async () => {
      if (!done || isCompleted) {
        wait[i] = !wait[i];
        await goto(url);
        wait[i] = !wait[i];
      }
    }}>
    <p>{index}</p>
  </div>
{/each}
