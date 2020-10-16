<script>
  export let currentTestID;
</script>

<button
  class="btn btn--default text-component"
  on:click={() => window.location.assign(`result/${currentTestID}`)}>
  Show The Result!
</button>
