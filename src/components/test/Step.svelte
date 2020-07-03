<script>
  import { goto } from "@sapper/app";
  export let index = 1; // default
  export let type = ""; // default
  export let url = "#"; // default
</script>

<div class="progress-cell {type}-cell" on:click={() => goto(url)}>
  <p>{index}</p>
</div>
