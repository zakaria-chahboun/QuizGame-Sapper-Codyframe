<script>
  import { goto } from "@sapper/app";

  // data format:
  export let data = [
    { type: "", url: "#", index: 1 },
    { type: "", url: "#", index: 2 },
    { type: "", url: "#", index: 3 },
    { type: "", url: "#", index: 4 }
  ];
</script>

{#each data as { type, index, url }}
  <div class="progress-cell {type}" on:click={() => goto(url)}>
    <p>{index + 1}</p>
  </div>
{/each}
