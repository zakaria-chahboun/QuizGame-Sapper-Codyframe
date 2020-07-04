<script>
  import Choice from "../../components/test/Choice.svelte";
  import Step from "../../components/test/Step.svelte";
  import Choices from "../../components/test/Choices.svelte";
  import MyLayout from "./_myLayout.svelte";
  import { types } from "../../components/test/types.js";

  let table = [
    { type: types.current, url: "google.com" },
    { type: types.correct, url: "google.com" },
    { type: types.uncorrect, url: "google.com" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" }
  ];
</script>

<MyLayout>

  <!-- Choices Data as: x4 {data1:{type:...,answer:....},data2:{type:...,answer:....}}-->
  <Choices />

  <!-- Steps Data -->
  <span slot="steps">
    {#each table as t, i}
      <Step type={t.type} index={i + 1} url={t.url} />
    {/each}
  </span>

  <!-- Hint Data -->
  <p slot="hint">This is a hint</p>

  <!-- Prev Button Data -->
  <button slot="prevButton" class=" btn btn--default text-component">
    Prev Question
  </button>

  <!-- Next Button Data -->
  <button slot="nextButton" class="btn btn--default text-component ">
    Next Question
  </button>

</MyLayout>
